import { useState } from 'react'

export default function PropertySearch({ onSearch }) {
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [hospital, setHospital] = useState('')
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([])
  const [hotels, setHotels] = useState([]) // Store hotel results
  const [loading, setLoading] = useState(false) // Loading state
  const [error, setError] = useState(null) // Error state

  // Function to fetch access token from Amadeus
  const fetchAccessToken = async () => {
    const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "API KEY",
        client_secret: "API KEY SECRET"
      })
    })
    const data = await response.json()
    return data.access_token
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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

      if (!response.ok) {
        throw new Error('Failed to fetch hotels')
      }

      const data = await response.json()
      setHotels(data.data)
    } catch (error) {
      console.error('Error fetching hotels:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }

    onSearch({
      location,
      checkIn,
      checkOut,
      guests,
      hospital,
      accessibilityFeatures
    })
  }

  const handleAccessibilityChange = (feature) => {
    setAccessibilityFeatures((prevFeatures) =>
      prevFeatures.includes(feature)
        ? prevFeatures.filter((f) => f !== feature)
        : [...prevFeatures, feature]
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-row">
          <div className="search-field">
            <label htmlFor="location">City Code (IATA)</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="E.g., PAR (Paris)"
              required
            />
          </div>

          <div className="search-field">
            <label htmlFor="hospital">Hospital/Medical Facility</label>
            <input
              id="hospital"
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="Enter hospital name"
            />
          </div>
        </div>

        <div className="search-row">
          <div className="search-field">
            <label htmlFor="checkIn">Check In</label>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label htmlFor="checkOut">Check Out</label>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <div className="search-field">
            <label htmlFor="guests">Guests</label>
            <input
              id="guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="accessibility-filters">
          <h4>Accessibility Features</h4>
          <div className="checkbox-group">
            {[
              { label: "Wheelchair Accessible", value: "wheelchair_accessible" },
              { label: "Step-Free Access", value: "step_free_access" },
              { label: "Hospital Bed", value: "hospital_bed" },
              { label: "Adapted Bathroom", value: "adapted_bathroom" }
            ].map((feature) => (
              <label key={feature.value}>
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

        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Display results */}
      {loading && <p>Loading hotels...</p>}
      {error && <p className="error">{error}</p>}
      {hotels.length > 0 && (
        <div className="hotel-results">
          <h3>Hotels Found</h3>
          <ul>
            {hotels.map((hotel) => (
              <li key={hotel.hotelId}>
                <strong>{hotel.name}</strong> - {hotel.distance.value} {hotel.distance.unit} away
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
