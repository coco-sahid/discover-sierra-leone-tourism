import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { preferences, days = 5 } = await req.json();

    // Fetch all destinations to pick from
    const { data: destinations, error } = await supabase
      .from("destinations")
      .select("*");

    if (error) throw error;

    // Smart heuristic: Filter by category if specified, or just pick diverse ones
    let filtered = destinations;
    if (preferences && preferences.length > 0) {
      filtered = destinations.filter(dest => 
        preferences.some((p: string) => dest.category?.toLowerCase().includes(p.toLowerCase()))
      );
    }

    // If filtered is too small, add back some popular ones
    if (filtered.length < 3) {
      filtered = destinations;
    }

    // Shuffle
    const shuffled = filtered.sort(() => 0.5 - Math.random());

    // Build itinerary days
    const itinerary = [];
    for (let i = 1; i <= days; i++) {
      const dayDestinations = [];
      // Pick 1-2 destinations per day
      const count = Math.random() > 0.5 ? 2 : 1;
      for (let j = 0; j < count; j++) {
        if (shuffled.length > 0) {
          dayDestinations.push(shuffled.pop());
        }
      }

      itinerary.push({
        day: i,
        destinations: dayDestinations,
        note: i === 1 ? "Welcome to the Lion Mountain! Your journey begins in Freetown." : 
               i === days ? "Concluding your Sierra Leone adventure with unforgettable memories." : 
               `Exploring the heart of ${dayDestinations[0]?.region || 'the region'}.`
      });
    }

    return NextResponse.json({ itinerary });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
