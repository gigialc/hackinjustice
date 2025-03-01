import { useState } from 'react'

export default function PropertySearch({ onSearch }) {
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [hospital, setHospital] = useState('')
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
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
    if (accessibilityFeatures.includes(feature)) {
      setAccessibilityFeatures(accessibilityFeatures.filter(f => f !== feature))
    } else {
      setAccessibilityFeatures([...accessibilityFeatures, feature])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-row">
        <div className="search-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State, or Zip"
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
          <label>
            <input
              type="checkbox"
              checked={accessibilityFeatures.includes('wheelchair_accessible')}
              onChange={() => handleAccessibilityChange('wheelchair_accessible')}
            />
            Wheelchair Accessible
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={accessibilityFeatures.includes('step_free_access')}
              onChange={() => handleAccessibilityChange('step_free_access')}
            />
            Step-Free Access
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={accessibilityFeatures.includes('hospital_bed')}
              onChange={() => handleAccessibilityChange('hospital_bed')}
            />
            Hospital Bed
          </label>
          
          <label>
            <input
              type="checkbox"
              checked={accessibilityFeatures.includes('adapted_bathroom')}
              onChange={() => handleAccessibilityChange('adapted_bathroom')}
            />
            Adapted Bathroom
          </label>
        </div>
      </div>
      
      <button type="submit" className="search-button">Search</button>
    </form>
  )
} 