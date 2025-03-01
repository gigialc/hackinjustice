import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'

export default function PropertyDetail() {
  const router = useRouter()
  const { id } = router.query
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  
  // Booking state
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [medicalFacility, setMedicalFacility] = useState('')
  const [specialRequirements, setSpecialRequirements] = useState('')
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    
    if (id) {
      fetchProperty()
    }
  }, [id])
  
  async function fetchProperty() {
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          hospital_proximity (*),
          profiles:owner_id (name)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      setProperty(data)
    } catch (error) {
      console.error('Error fetching property:', error)
      alert('Error fetching property details')
    } finally {
      setLoading(false)
    }
  }
  
  async function handleBooking(e) {
    e.preventDefault()
    
    if (!session) {
      alert('Please sign in to book this property')
      return
    }
    
    try {
      // Calculate total price
      const checkInDate = new Date(checkIn)
      const checkOutDate = new Date(checkOut)
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      const totalPrice = nights * property.price_per_night
      
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            property_id: id,
            guest_id: session.user.id,
            check_in: checkIn,
            check_out: checkOut,
            number_of_guests: guests,
            total_price: totalPrice,
            status: 'pending',
            medical_facility: medicalFacility,
            special_requirements: specialRequirements
          }
        ])
      
      if (error) throw error
      
      alert('Booking request submitted successfully!')
      router.push('/bookings')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Error creating booking')
    }
  }
  
  if (loading) return <div>Loading property details...</div>
  if (!property) return <div>Property not found</div>
  
  return (
    <div className="property-detail-container">
      <Link href="/">
        <a className="back-link">← Back to search</a>
      </Link>
      
      <h1>{property.title}</h1>
      <p className="property-location">{property.city}, {property.state}, {property.country}</p>
      
      <div className="property-images">
        {property.image_url ? (
          <Image 
            src={property.image_url} 
            alt={property.title}
            width={800}
            height={500}
            objectFit="cover"
          />
        ) : (
          <div className="placeholder-image">No Image Available</div>
        )}
      </div>
      
      <div className="property-details-grid">
        <div className="property-main-info">
          <h2>Hosted by {property.profiles?.name || 'Host'}</h2>
          <p>{property.bedrooms} bedrooms • {property.beds} beds • Max {property.max_guests} guests</p>
          <p className="property-price">${property.price_per_night} per night</p>
          
          <div className="property-description">
            <h3>About this place</h3>
            <p>{property.description}</p>
          </div>
          
          <div className="hospital-proximity">
            <h3>Nearby Medical Facilities</h3>
            {property.hospital_proximity && property.hospital_proximity.length > 0 ? (
              <ul>
                {property.hospital_proximity.map(hospital => (
                  <li key={hospital.id}>
                    <strong>{hospital.hospital_name}</strong> - {hospital.distance_in_miles} miles away
                    <p>{hospital.travel_time_minutes} min by {hospital.transport_options.join(', ')}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No nearby hospitals listed</p>
            )}
          </div>
        </div>
        
        <div className="property-features">
          <div className="accessibility-features">
            <h3>Accessibility Features</h3>
            <ul>
              {property.wheelchair_accessible && <li>Wheelchair Accessible</li>}
              {property.step_free_access && <li>Step-Free Access</li>}
              {property.wide_hallways && <li>Wide Hallways</li>}
              {property.adapted_bathroom && <li>Adapted Bathroom</li>}
              {property.hospital_bed && <li>Hospital Bed</li>}
              {property.ground_floor && <li>Ground Floor Unit</li>}
              {property.elevator && <li>Elevator Access</li>}
              {property.medical_equipment && property.medical_equipment.length > 0 && (
                <li>Medical Equipment: {property.medical_equipment.join(', ')}</li>
              )}
            </ul>
          </div>
          
          <div className="amenities">
            <h3>Amenities</h3>
            <ul>
              {property.wifi && <li>WiFi</li>}
              {property.kitchen && <li>Kitchen</li>}
              {property.washer && <li>Washer</li>}
              {property.dryer && <li>Dryer</li>}
              {property.parking && <li>Parking</li>}
              {property.air_conditioning && <li>Air Conditioning</li>}
              {property.heating && <li>Heating</li>}
              {property.medical_refrigerator && <li>Medical Refrigerator</li>}
              {property.quiet_environment && <li>Quiet Environment</li>}
            </ul>
          </div>
        </div>
        
        <div className="booking-form">
          <h3>Book This Property</h3>
          <form onSubmit={handleBooking}>
            <div className="form-group">
              <label htmlFor="checkIn">Check In</label>
              <input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="checkOut">Check Out</label>
              <input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="guests">Guests</label>
              <input
                id="guests"
                type="number"
                min="1"
                max={property.max_guests}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="medicalFacility">Medical Facility (Optional)</label>
              <input
                id="medicalFacility"
                type="text"
                value={medicalFacility}
                onChange={(e) => setMedicalFacility(e.target.value)}
                placeholder="Hospital or clinic you're visiting"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="specialRequirements">Special Requirements (Optional)</label>
              <textarea
                id="specialRequirements"
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Any special needs or requirements"
              />
            </div>
            
            <button type="submit" className="booking-button" disabled={!session}>
              {session ? 'Request to Book' : 'Sign in to Book'}
            </button>
            
            {!session && (
              <p className="sign-in-notice">Please sign in to book this property</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
} 