export default function handler(req, res) {
  res.status(200).json({
    apiKeyExists: !!process.env.NEXT_PUBLIC_AMADEUS_API_KEY,
    apiKeyFirstChars: process.env.NEXT_PUBLIC_AMADEUS_API_KEY?.substring(0, 3),
    apiSecretExists: !!process.env.AMADEUS_API_SECRET
  });
} 