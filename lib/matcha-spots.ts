export type MatchaSpot = {
  rank: number
  name: string
  location: string
  lat: number
  lng: number
  rating: number
  vibe: string
  description: string
}

// Top 10 matcha spots in the Bay Area
export const matchaSpots: MatchaSpot[] = [
  {
    rank: 1,
    name: "Matcha Cafe Maiko",
    location: "San Francisco, CA",
    lat: 37.7879,
    lng: -122.4084,
    rating: 4.8,
    vibe: "Japanese classic",
    description: "Hawaii-born chain with the creamiest matcha soft serve and lattes. The matcha float is a must.",
  },
  {
    rank: 2,
    name: "Sightglass Coffee",
    location: "San Francisco, CA",
    lat: 37.7765,
    lng: -122.4242,
    rating: 4.6,
    vibe: "Minimal & bright",
    description: "Ceremonial-grade matcha in a stunning, light-filled space. Perfect for a calm afternoon.",
  },
  {
    rank: 3,
    name: "Asha Tea House",
    location: "Berkeley, CA",
    lat: 37.8697,
    lng: -122.2594,
    rating: 4.7,
    vibe: "Tea purists",
    description: "Stone-ground matcha and a huge tea selection. The matcha latte is smooth and not too sweet.",
  },
  {
    rank: 4,
    name: "Boba Guys",
    location: "San Francisco, CA",
    lat: 37.7849,
    lng: -122.4094,
    rating: 4.5,
    vibe: "Trendy & fast",
    description: "Bay Area staple. Their matcha is vibrant and pairs perfectly with house-made oat milk.",
  },
  {
    rank: 5,
    name: "Stonemill Matcha",
    location: "San Francisco, CA",
    lat: 37.7605,
    lng: -122.4212,
    rating: 4.8,
    vibe: "Matcha destination",
    description: "Dedicated matcha cafe with traditional bowls, lattes, and matcha pastries. Feels like a trip to Kyoto.",
  },
  {
    rank: 6,
    name: "Somi Somi",
    location: "San Jose, CA",
    lat: 37.3230,
    lng: -121.8832,
    rating: 4.6,
    vibe: "Sweet & fun",
    description: "Korean-inspired soft serve and matcha taiyaki. Great for something a little different.",
  },
  {
    rank: 7,
    name: "Cafe Réveille",
    location: "San Francisco, CA",
    lat: 37.8024,
    lng: -122.4362,
    rating: 4.5,
    vibe: "Neighborhood cozy",
    description: "Strong matcha lattes and a relaxed vibe. Perfect study or work spot.",
  },
  {
    rank: 8,
    name: "Blue Bottle Coffee",
    location: "Oakland, CA",
    lat: 37.8044,
    lng: -122.2712,
    rating: 4.5,
    vibe: "Clean & precise",
    description: "Consistently good matcha latte. Grab one and stroll around Jack London Square.",
  },
  {
    rank: 9,
    name: "Tea Era",
    location: "Berkeley, CA",
    lat: 37.8686,
    lng: -122.2678,
    rating: 4.6,
    vibe: "Boba & matcha",
    description: "Solid matcha drinks and boba near campus. The matcha milk tea is a local favorite.",
  },
  {
    rank: 10,
    name: "Andytown Coffee",
    location: "San Francisco, CA",
    lat: 37.7213,
    lng: -122.4789,
    rating: 4.5,
    vibe: "Surf & sip",
    description: "Out in the Sunset. Their matcha is smooth and pairs well with their famous snow plow.",
  },
]
