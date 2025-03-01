import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import PropertySearch from '../components/PropertySearch'
import PropertyCard from '../components/PropertyCard'
import Auth from '../components/Auth'

export default function Home() {
  const [session, setSession] = useState(null)
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState(null)

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    // Fetch initial properties
    fetchProperties()

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (searchParams) {
      fetchProperties(searchParams)
    }
  }, [searchParams])

  async function fetchProperties(params = {}) {
    setLoading(true)
    
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          hospital_proximity (*)
        `)
      
      // Apply filters based on search params
      if (params.location) {
        query = query.or(`city.ilike.%${params.location}%,state.ilike.%${params.location}%`)
      }
      
      if (params.hospital) {
        query = query.filter('hospital_proximity.hospital_name', 'ilike', `%${params.hospital}%`)
      }
      
      if (params.guests) {
        query = query.gte('max_guests', params.guests)
      }
      
      // Apply accessibility filters
      if (params.accessibilityFeatures && params.accessibilityFeatures.length > 0) {
        params.accessibilityFeatures.forEach(feature => {
          query = query.eq(feature, true)
        })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      setProperties(data || [])
    } catch (error) {
      console.error('Error fetching properties:', error)
      alert('Error fetching properties')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (params) => {
    setSearchParams(params)
  }

  return (
    <div className="container">
      <header>
        <h1>MedBnB - Medical Travel Accommodations</h1>
        {!session ? (
          <Auth />
        ) : (
          <div className="user-welcome">
            <p>Welcome, {session.user.email}</p>
            <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        )}
      </header>

      <main>
        <section className="search-section">
          <h2>Find Medical-Friendly Accommodations</h2>
          <PropertySearch onSearch={handleSearch} />
        </section>

        <section className="properties-section">
          <h2>Available Properties</h2>
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length > 0 ? (
            <div className="properties-grid">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p>No properties found. Try adjusting your search criteria.</p>
          )}
        </section>
      </main>
    </div>
  )
} 