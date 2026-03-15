# Discover Sierra Leone - Tourism Platform

A modern, full-stack tourism platform designed to showcase the beauty of Sierra Leone. Built with Next.js 15, Supabase, and Stripe.

## Features

- **Interactive Map Explorer**: Discover tourist destinations geographically with Leaflet maps
- **AI Itinerary Architect**: Generate personalized travel plans using AI
- **Booking System**: Secure checkout integration with Stripe payments
- **Admin Dashboard**: Manage destinations, bookings, and inquiries
- **User Authentication**: Secure login/signup with Supabase Auth
- **Favorites System**: Save and organize favorite destinations
- **Responsive Design**: Optimized for all devices using Tailwind CSS and Framer Motion

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Styling**: Tailwind CSS, Shadcn UI
- **Animations**: Framer Motion
- **Maps**: Leaflet / React-Leaflet
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes (bookings, webhooks, AI)
│   ├── auth/               # Authentication pages
│   ├── booking/            # Booking flow pages
│   ├── destinations/       # Destination listing and detail pages
│   ├── explore/            # Interactive map explorer
│   ├── plan/               # Trip planning / itinerary builder
│   └── ...
├── components/             # Reusable React components
│   └── ui/                 # Shadcn UI components
├── hooks/                  # Custom React hooks
└── lib/                    # Utility functions and configurations
```

## Installation & Setup

1. **Clone the repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_url

   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables in Supabase:
- `destinations` - Tourist destinations with location, images, and metadata
- `bookings` - User booking records
- `trip_inquiries` - Custom trip inquiry submissions
- `favorites` - User saved destinations
- `impact_stats` - Community impact statistics

## Key Features Explained

### Interactive Map (Explore Page)
Users can explore all destinations on an interactive map, filter by region and category, and click markers to view destination details.

### AI Itinerary Builder (Plan Page)
An intelligent trip planner that helps users create custom itineraries based on their preferences, duration, and interests.

### Booking System
Full e-commerce flow with Stripe integration for secure payments, including success/cancel handling and webhook processing.

### Admin Dashboard
Protected admin routes for managing destinations (CRUD operations) and viewing trip inquiries.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Author

Created by Chernor Sidu Jalloh aT Limkokwing University of creative Technology.

## License

This project is for educational purposes.
