import { useState } from 'react'
import HospitalSearch from './HospitalSearch'

export default function PropertySearch({ onSearch }) {
  const [location, setLocation] = useState('')
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to fetch access token from Amadeus
  const fetchAccessToken = async () => {
    try {
      const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: process.env.NEXT_PUBLIC_AMADEUS_API_KEY,
          client_secret: process.env.NEXT_PUBLIC_AMADEUS_API_SECRET
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || "Failed to get token");
      }
      
      return data.access_token;
    } catch (error) {
      console.error("Error in fetchAccessToken:", error);
      throw error;
    }
  }

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital)
    
    // Automatically set the location based on hospital's city code
    if (hospital.city_code) {
      setLocation(hospital.city_code)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Require a hospital to be selected
    if (!selectedHospital) {
      setError("Please select a hospital or medical facility")
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Retrieve a valid access token
      const token = await fetchAccessToken()

      // Use the token to fetch hotels near the city code provided
      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${location}&radius=5&radiusUnit=KM`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      const responseText = await response.text();
      
      if (!response.ok) {
        throw new Error(`Failed to fetch hotels: ${response.status}`);
      }
      
      const data = JSON.parse(responseText);
      
      let hotels = data.data || [];
      
      // If a hospital is selected and has location, sort hotels by proximity to hospital
      if (selectedHospital && selectedHospital.location) {
        hotels = sortHotelsByProximityToHospital(hotels, selectedHospital.location);
      }
      
      setHotels(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }

    onSearch({
      location,
      hospital: selectedHospital?.name || '',
      accessibilityFeatures
    })
  }

  // Function to sort hotels by distance to hospital
  const sortHotelsByProximityToHospital = (hotels, hospitalLocation) => {
    return hotels.sort((a, b) => {
      const distanceA = calculateDistance(
        hospitalLocation.lat, 
        hospitalLocation.lng,
        a.geoCode?.latitude,
        a.geoCode?.longitude
      );
      
      const distanceB = calculateDistance(
        hospitalLocation.lat, 
        hospitalLocation.lng,
        b.geoCode?.latitude,
        b.geoCode?.longitude
      );
      
      return distanceA - distanceB;
    });
  }

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  }

  const handleAccessibilityChange = (feature) => {
    setAccessibilityFeatures((prevFeatures) =>
      prevFeatures.includes(feature)
        ? prevFeatures.filter((f) => f !== feature)
        : [...prevFeatures, feature]
    )
  }

  return (
    <div className="single-page-container">
      <div className="search-panel">
        <h2>Find Accommodations Near Hospitals</h2>
        <p className="description">Search for hotels near medical facilities for your treatment or hospital visit.</p>
        
        <form onSubmit={handleSubmit} className="search-form-simple">
          {/* Hospital Search - now the only location option */}
          <div className="search-item">
            {/* <label>Hospital or Medical Facility <span className="required">*</span></label> */}
            <HospitalSearch onHospitalSelect={handleHospitalSelect} />
            {!selectedHospital && (
              <p className="helper-text">Start typing a hospital name to search</p>
            )}
            {selectedHospital && (
              <div className="selection-indicator">
                <span className="checkmark">✓</span> {selectedHospital.name} selected
              </div>
            )}
          </div>
          
          {/* City Code field is removed */}
          
          {/* Accessibility Features */}
          <div className="search-item">
            <label>Accessibility Needs</label>
            <div className="simple-checkbox-group">
              {[
                { label: "Wheelchair Accessible", value: "wheelchair_accessible" },
                { label: "Step-Free Access", value: "step_free_access" },
                { label: "Hospital Bed", value: "hospital_bed" },
                { label: "Adapted Bathroom", value: "adapted_bathroom" }
              ].map((feature) => (
                <label key={feature.value} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={accessibilityFeatures.includes(feature.value)}
                    onChange={() => handleAccessibilityChange(feature.value)}
                  />
                  {feature.label}
                </label>
              ))}
            </div>
          </div>
          
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Searching..." : "Find Accommodations"}
          </button>
        </form>
      </div>
      
      <div className="results-panel">
        {/* Error message moved above selected hospital for visibility */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Selected Hospital */}
        {selectedHospital && (
          <div className="selected-hospital-simple">
            <h3>Selected Medical Facility</h3>
            <div className="hospital-details">
              <strong>{selectedHospital.name}</strong>
              <p>{selectedHospital.formatted_address}</p>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading && <div className="loading-indicator">Searching for accommodations...</div>}
        
        {/* Hotel Results */}
        {!loading && hotels.length > 0 && (
          <div className="hotel-results-simple">
            <h3>Available Accommodations ({hotels.length})</h3>
            <ul className="hotel-list-simple">
              {hotels.map((hotel) => (
                <li key={hotel.hotelId} className="hotel-card">
                  <div className="hotel-name">{hotel.name}</div>
                  {selectedHospital && hotel.geoCode && (
                    <div className="hotel-distance">
                      <span className="distance-value">
                        {calculateDistance(
                          selectedHospital.location.lat,
                          selectedHospital.location.lng,
                          hotel.geoCode.latitude,
                          hotel.geoCode.longitude
                        ).toFixed(1)}
                      </span> 
                      km from hospital
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {!loading && !error && hotels.length === 0 && !selectedHospital && (
          <div className="no-results">
            Search for a hospital to find nearby accommodations
          </div>
        )}
        
        {!loading && !error && hotels.length === 0 && selectedHospital && (
          <div className="no-results">
            No accommodations found near {selectedHospital.name}. Try a different hospital.
          </div>
        )}
      </div>
    </div>
  )
}
