# MedBnB

A specialized accommodation booking platform that helps patients and caregivers find medical-friendly accommodations near hospitals and medical facilities.

## 🏥 Overview

MedBnB is designed to address the unique needs of patients and caregivers seeking temporary accommodations during medical treatments. The platform allows users to:

- Search for hospitals and medical facilities
- Find nearby accommodations with suitable accessibility features
- Filter properties based on specific medical needs
- Book medical-friendly accommodations

## 🛠️ Tech Stack

- **Frontend**: Next.js, React
- **API Integration**: Amadeus Hotel API for accommodation data
- **Database**: Supabase
- **Maps/Location**: Google Places API for hospital search
- **Styling**: TailwindCSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Amadeus API credentials
- Google Places API key

### Environment Setup

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_AMADEUS_API_KEY=your_amadeus_api_key
NEXT_PUBLIC_AMADEUS_API_SECRET=your_amadeus_api_secret
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Key Features

- **Hospital Search**: Find hospitals and medical facilities near your desired location
- **Accommodation Search**: Discover nearby hotels and rentals sorted by proximity to the selected medical facility
- **Accessibility Filtering**: Filter accommodations based on accessibility features needed for medical stays
- **User Authentication**: Create an account to save preferred hospitals and accommodation preferences
- **Booking Management**: Track and manage your medical stay bookings

## 🧩 Project Structure

- `pages/`: Application routes and API endpoints
- `components/`: Reusable UI components
- `lib/`: Utility functions and API clients
- `styles/`: CSS and styling files

## 🔄 API Integration

The application integrates with:

1. **Amadeus API**: For hotel search and booking capabilities
2. **Google Places API**: For hospital and medical facility search
3. **Supabase**: For user authentication and data storage

## 👥 Contributing

Contributions to improve MedBnB are welcome. Please feel free to submit a pull request or open an issue to discuss proposed changes.

## 📝 License

This project is licensed under the MIT License.
