

export default async function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  
  try {
    // Use OpenStreetMap's Nominatim API to search for hospitals
    // This is free, open, and doesn't require an API key
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}+hospital&format=json&addressdetails=1&limit=10`
    );
    
    if (!response.ok) {
      throw new Error(`Nominatim API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to our required format
    const hospitals = data.map(hospital => {
      // Extract city and country from address
      const city = hospital.address?.city || 
                  hospital.address?.town || 
                  hospital.address?.village || 
                  hospital.address?.county || 
                  '';
      
      // Determine city code based on common city names
      let city_code = null;
      
      // US cities
      if (city.toLowerCase().includes('new york')) city_code = 'NYC';
      else if (city.toLowerCase().includes('boston')) city_code = 'BOS';
      else if (city.toLowerCase().includes('los angeles')) city_code = 'LAX';
      else if (city.toLowerCase().includes('chicago')) city_code = 'CHI';
      else if (city.toLowerCase().includes('san francisco')) city_code = 'SFO';
      else if (city.toLowerCase().includes('miami')) city_code = 'MIA';
      else if (city.toLowerCase().includes('dallas')) city_code = 'DFW';
      else if (city.toLowerCase().includes('houston')) city_code = 'IAH';
      
      // International cities
      else if (city.toLowerCase().includes('london')) city_code = 'LON';
      else if (city.toLowerCase().includes('paris')) city_code = 'PAR';
      else if (city.toLowerCase().includes('tokyo')) city_code = 'TYO';
      
      // If we can't determine city code, use first 3 letters of city name
      if (!city_code && city) {
        city_code = city.substring(0, 3).toUpperCase();
      }
      
      // Create a formatted address from the components
      const addressComponents = [];
      if (hospital.address?.road) addressComponents.push(hospital.address.road);
      if (hospital.address?.house_number) addressComponents.push(hospital.address.house_number);
      if (city) addressComponents.push(city);
      if (hospital.address?.state) addressComponents.push(hospital.address.state);
      if (hospital.address?.postcode) addressComponents.push(hospital.address.postcode);
      if (hospital.address?.country) addressComponents.push(hospital.address.country);
      
      const formatted_address = addressComponents.join(', ');
      
      return {
        place_id: hospital.place_id || `hospital_${Math.random().toString(36).substring(2, 10)}`,
        name: hospital.display_name.split(',')[0] || 'Hospital',
        formatted_address: formatted_address,
        location: { 
          lat: parseFloat(hospital.lat) || 0, 
          lng: parseFloat(hospital.lon) || 0 
        },
        city_code
      };
    });
    
    return res.status(200).json({ results: hospitals });
    
  } catch (error) {
    console.error('Hospital search error:', error);
    
    // Respond with an empty result set rather than an error
    return res.status(200).json({ 
      results: [],
      error: error.message
    });
  }
} 