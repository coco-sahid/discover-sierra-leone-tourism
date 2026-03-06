import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SAMPLE_DESTINATIONS = [
  {
    name: "Freetown",
    slug: "freetown",
    description: "The vibrant capital of Sierra Leone, nestled on the picturesque Freetown Peninsula. Freetown is a bustling city filled with historic sites, cultural heritage, and stunning views. Explore the famous Cotton Tree, visit local markets, and experience the rich Creole culture.",
    image: "/freetown.jpg",
    region: "Western Area",
    category: "Culture",
    latitude: 8.4657,
    longitude: -13.2317,
    best_time: "November to April",
    getting_there: "Direct flights to Lungi International Airport or ferry from Kingtom",
    fees: "Free entry to the city",
    highlights: ["Cotton Tree", "Fourah Bay College", "Sierra Leone National Museum", "Bunce Island"],
    experience_types: ["cultural festivals", "historical tours"]
  },
  {
    name: "Tokeh Beach",
    slug: "tokeh-beach",
    description: "A pristine white sand beach located south of Freetown, known for its crystal-clear waters and dramatic rocky outcrops. Tokeh is perfect for swimming, sunbathing, and enjoying fresh seafood at beachside restaurants.",
    image: "/tokeh.jpg",
    region: "Western Area",
    category: "Beaches",
    latitude: 8.2989,
    longitude: -13.2495,
    best_time: "November to April",
    getting_there: "Approximately 40km south of Freetown, accessible by car",
    fees: "Free beach access",
    highlights: ["White sand beach", "Rocky outcrops", "Seafood restaurants", "Swimming"],
    experience_types: ["beach holidays"]
  },
  {
    name: "River No. 2 Beach",
    slug: "river-no-2",
    description: "A secluded and picturesque beach featuring a river mouth and calm waters. Perfect for beach lovers seeking a quieter, untouched setting away from the urban hustle. Ideal for swimming, picnicking, and nature photography.",
    image: "/no2.jpg",
    region: "Western Area",
    category: "Beaches",
    latitude: 8.5089,
    longitude: -13.2678,
    best_time: "November to April",
    getting_there: "About 30km north of Freetown by vehicle",
    fees: "Free access",
    highlights: ["River mouth", "Secluded setting", "Photography spots", "Picnic areas"],
    experience_types: ["beach holidays", "eco-tourism"]
  },
  {
    name: "Tiwai Island",
    slug: "tiwai-island",
    description: "A wildlife sanctuary and forest reserve in the Moa River. Home to rare species including pygmy hippopotamuses, chimpanzees, and over 260 bird species. An ecological paradise for nature lovers and wildlife enthusiasts.",
    image: "/adventure + beach 2.jpg",
    region: "Eastern Province",
    category: "Wildlife",
    latitude: 8.1833,
    longitude: -11.2833,
    best_time: "November to April",
    getting_there: "Eastern Sierra Leone, accessible by boat",
    fees: "Park entrance fee applies",
    highlights: ["Pygmy hippos", "Chimpanzees", "Bird watching", "Forest trails"],
    experience_types: ["eco-tourism", "wildlife"]
  },
  {
    name: "Bonthe Island",
    slug: "bonthe",
    description: "A historic island town in the Southern Province with colonial architecture and rich maritime heritage. Bonthe offers beautiful beaches, historical buildings, and authentic island culture. A peaceful retreat with strong community ties.",
    image: "/cult.jpg",
    region: "Southern Province",
    category: "Culture",
    latitude: 7.5175,
    longitude: -12.5047,
    best_time: "November to April",
    getting_there: "Ferry or boat from Freetown to Bonthe",
    fees: "Free access",
    highlights: ["Colonial buildings", "Historic sites", "Island beaches", "Local culture"],
    experience_types: ["historical tours", "cultural festivals"]
  },
  {
    name: "Kabala",
    slug: "kabala",
    description: "A charming town in the Northern Province surrounded by lush mountains and waterfalls. Known for its cool climate, friendly locals, and adventure activities. Perfect for hiking, meeting local communities, and experiencing authentic Sierra Leone.",
    image: "/adv.jpg",
    region: "Northern Province",
    category: "Adventure",
    latitude: 9.6167,
    longitude: -10.3333,
    best_time: "November to April",
    getting_there: "Northern Sierra Leone, accessible by road",
    fees: "Free entry",
    highlights: ["Mountain views", "Waterfalls", "Hiking trails", "Local communities"],
    experience_types: ["adventure", "eco-tourism", "volunteer tourism"]
  },
  {
    name: "Bureh Beach",
    slug: "bureh-beach",
    description: "A stunning and expansive beach in the Northern Province, stretching for miles with dramatic coastal cliffs. Known for its powerful waves, golden sand, and vibrant coastal atmosphere. Great for beach activities and sunset viewing.",
    image: "/bureh.jpg",
    region: "Northern Province",
    category: "Beaches",
    latitude: 9.5667,
    longitude: -13.1167,
    best_time: "November to April",
    getting_there: "Northwest of Freetown in the Northern Province",
    fees: "Free beach access",
    highlights: ["Expansive beach", "Coastal cliffs", "Dramatic scenery", "Waves"],
    experience_types: ["beach holidays"]
  },
  {
    name: "Outamba-Kilimi National Park",
    slug: "outamba-kilimi",
    description: "Sierra Leone's largest national park featuring diverse wildlife, river systems, and pristine nature. Home to elephants, hippos, and various primate species. Offers guided tours, river cruises, and immersive nature experiences.",
    image: "/adventure + beach 2.jpg",
    region: "Northern Province",
    category: "Wildlife",
    latitude: 9.4667,
    longitude: -11.9667,
    best_time: "November to April",
    getting_there: "Northern Sierra Leone, accessible by vehicle",
    fees: "Park entrance and guide fees apply",
    highlights: ["Elephants", "Hippos", "River cruises", "Guided trails"],
    experience_types: ["eco-tourism", "wildlife"]
  },
  {
    name: "Tacugama Chimpanzee Sanctuary",
    slug: "tacugama",
    description: "A rescue and rehabilitation center for chimpanzees on the outskirts of Freetown. Visit orphaned and rescued chimps in a natural forest setting. Educational and conservation-focused facility supporting chimpanzee welfare.",
    image: "/chimp.jpg",
    region: "Western Area",
    category: "Wildlife",
    latitude: 8.4833,
    longitude: -13.2333,
    best_time: "Year-round",
    getting_there: "Near Freetown, accessible by vehicle",
    fees: "Guided tour fees apply",
    highlights: ["Rescued chimpanzees", "Forest habitat", "Conservation education", "Wildlife viewing"],
    experience_types: ["eco-tourism", "volunteer tourism", "wildlife"]
  },
  {
    name: "Banana Islands",
    slug: "banana-islands",
    description: "A small group of islands off the coast of Western Area, known for their untouched beaches, snorkeling opportunities, and peaceful island atmosphere. Perfect for day trips and island exploration with minimal development.",
    image: "/bureh.jpg",
    region: "Western Area",
    category: "Beaches",
    latitude: 8.1667,
    longitude: -13.4167,
    best_time: "November to April",
    getting_there: "Boat from Freetown or Tokeh Beach",
    fees: "Boat transportation fees apply",
    highlights: ["Island beaches", "Snorkeling", "Clear waters", "Island resorts"],
    experience_types: ["beach holidays", "eco-tourism"]
  }
];

export async function GET() {
  try {
    // Insert destinations
    const { data, error } = await supabase
      .from('destinations')
      .insert(SAMPLE_DESTINATIONS)
      .select();

    if (error) {
      console.error('Error seeding destinations:', error);
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      message: 'Successfully seeded destinations',
      count: data?.length || 0,
      destinations: data
    });
  } catch (err: any) {
    console.error('Seeding error:', err);
    return Response.json(
      { error: err.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}
