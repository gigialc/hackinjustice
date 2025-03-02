import { useState, useEffect } from 'react'
// import PropertyCard from '../components/PropertyCard'
import PropertySearch from '../components/PropertySearch'
// import Footer from '../components/Footer'


export default function Home() {
  const [searchParams, setSearchParams] = useState(null)

  useEffect(() => {
    if (searchParams) {
      console.log("Search params updated:", searchParams);
    }
  }, [searchParams])

  const handleSearch = (params) => {
    setSearchParams(params)
  }

  return (
    <div>
      <header>
        <div className="container">
          <div className="header-content">
            <div className="logo">Med<span>BnB</span></div>
          </div>
        </div>
      </header>

      {/* <div className="hero">
        <div className="container">
          <h1>Find Medical-Friendly Accommodations</h1>
          <p>Comfortable stays near hospitals and medical facilities with accessibility features for patients and caregivers.</p>
        </div>
      </div> */}

      <main className="container">
          <PropertySearch onSearch={handleSearch} />
      </main>
    </div>
  )
} 