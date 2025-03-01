import Link from 'next/link'
import Image from 'next/image'

export default function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <div className="property-image">
        {property.image_url ? (
          <Image 
            src={property.image_url} 
            alt={property.title}
            width={300}
            height={200}
            objectFit="cover"
          />
        ) : (
          <div className="placeholder-image">No Image</div>
        )}
      </div>
      <div className="property-info">
        <h3>{property.title}</h3>
        <p className="property-location">{property.city}, {property.state}</p>
        <p className="property-price">${property.price_per_night} per night</p>
        
        <div className="property-features">
          <span>{property.bedrooms} BR</span> • 
          <span>{property.beds} beds</span> • 
          <span>Max {property.max_guests} guests</span>
        </div>
        
        <div className="medical-features">
          {property.wheelchair_accessible && <span className="tag">Wheelchair Accessible</span>}
          {property.hospital_bed && <span className="tag">Hospital Bed</span>}
          {property.medical_refrigerator && <span className="tag">Medical Refrigerator</span>}
        </div>
        
        {property.hospital_proximity && property.hospital_proximity.length > 0 && (
          <div className="hospital-proximity">
            <p>Near: {property.hospital_proximity[0].hospital_name} ({property.hospital_proximity[0].distance_in_miles} miles)</p>
          </div>
        )}
        
        <Link href={`/properties/${property.id}`}>
          <a className="view-details">View Details</a>
        </Link>
      </div>
    </div>
  )
} 