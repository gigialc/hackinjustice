export default async function handler(req, res) {
  const { cityCode } = req.query;
  
  console.log("API route called with cityCode:", cityCode);
  
  try {
    // Get token
    const tokenResponse = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.NEXT_PUBLIC_AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      return res.status(tokenResponse.status).json({
        error: tokenData.error_description || "Failed to get token"
      });
    }
    
    // Use token to fetch hotels
    const hotelsResponse = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=5&radiusUnit=KM`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    );
    
    const hotelsData = await hotelsResponse.json();
    
    if (!hotelsResponse.ok) {
      return res.status(hotelsResponse.status).json({
        error: hotelsData.errors?.[0]?.detail || "Failed to fetch hotels"
      });
    }
    
    return res.status(200).json(hotelsData);
  } catch (error) {
    console.error("API route error:", error);
    return res.status(500).json({ error: error.message });
  }
} 