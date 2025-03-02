import { useState, useEffect } from 'react';

export default function HospitalSearch({ onHospitalSelect }) {
  const [query, setQuery] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search for hospitals as user types
  useEffect(() => {
    if (!query || query.length < 3) return;
    
    const searchHospitals = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/hospital-search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to search hospitals');
        }
        
        setHospitals(data.results || []);
      } catch (error) {
        console.error('Error searching hospitals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(searchHospitals, 500);
    return () => clearTimeout(timer);
  }, [query]);
  
  const handleSelect = (hospital) => {
    onHospitalSelect(hospital);
    setQuery(hospital.name);
    setHospitals([]);
  };
  
  return (
    <div className="hospital-search">
      <div className="search-field">
        <label htmlFor="hospital">Hospital/Medical Facility</label>
        <input
          id="hospital"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter hospital name"
          autoComplete="off"
        />
      </div>
      
      {loading && <p className="loading-text">Searching hospitals...</p>}
      
      {hospitals.length > 0 && (
        <ul className="hospital-results-list">
          {hospitals.map((hospital) => (
            <li 
              key={hospital.place_id} 
              onClick={() => handleSelect(hospital)}
              className="hospital-result-item"
            >
              <strong>{hospital.name}</strong>
              <p>{hospital.formatted_address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 