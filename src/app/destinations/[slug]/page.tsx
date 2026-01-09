"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, Clock, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const destinationData: Record<string, any> = {
  "river-no-2": {
    name: "River No. 2 Beach",
    region: "Western Area",
    category: "Beaches",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800",
      "https://images.unsplash.com/photo-1544469537-c790382046bc?q=80&w=800",
    ],
    description: "Voted one of the most beautiful beaches in the world, River No. 2 Beach is a community-run project that offers a pristine stretch of white sand where the river meets the Atlantic ocean. It is the perfect place for swimming, sunbathing, and enjoying fresh lobster and fish caught by local fishermen.",
    practical: {
      gettingThere: "Located 45 minutes south of Freetown by road. Taxis and private cars are readily available.",
      bestTime: "Dry season (November to April) is best for sun and clear waters.",
      fees: "Small entry fee (approx. $2) which goes directly to the community fund.",
    },
    highlights: ["Crystal clear river water", "White powdery sand", "Fresh seafood beach bars", "Boat trips up the river"],
  },
  "tacugama": {
    name: "Tacugama Chimpanzee Sanctuary",
    region: "Western Area",
    category: "Wildlife",
    images: [
      "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=1200",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800",
    ],
    description: "Established in 1995, Tacugama Chimpanzee Sanctuary is home to rescued chimpanzees and is a vital hub for conservation in Sierra Leone. Located within the Western Area Peninsula National Park, the sanctuary offers forest walks and educational tours that provide deep insights into the lives of our closest relatives.",
    practical: {
      gettingThere: "30 minutes from central Freetown. Accessible via Regent Road.",
      bestTime: "Year-round, but tours are best in the morning or late afternoon.",
      fees: "Tour fees apply. Pre-booking is recommended.",
    },
    highlights: ["Guided sanctuary tours", "Bird watching", "Eco-lodges for overnight stays", "Conservation education center"],
  },
};

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const dest = destinationData[slug];

  if (!dest) {
    return (
      <div className="pt-32 pb-32 text-center">
        <h1 className="text-2xl font-bold">Destination not found</h1>
        <Button onClick={() => router.push("/destinations")} variant="link">Back to destinations</Button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24">
      {/* Hero Gallery */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={dest.images[0]}
          alt={dest.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 w-fit mb-8 px-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-2 mb-4">
             <Badge className="bg-emerald-500 text-white border-none">{dest.category}</Badge>
             <span className="text-zinc-300 text-sm flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {dest.region}
             </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-playfair">{dest.name}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold font-playfair mb-6">About this destination</h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
              {dest.description}
            </p>

            <div className="mb-12">
               <h3 className="text-xl font-bold mb-6">Highlights</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dest.highlights.map((h: string) => (
                    <div key={h} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900">
                       <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                       <span className="font-medium">{h}</span>
                    </div>
                  ))}
               </div>
            </div>

            <Tabs defaultValue="practical" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
                <TabsTrigger value="practical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">Practical Info</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">What to pack</TabsTrigger>
              </TabsList>
              <TabsContent value="practical">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-2">
                         <Clock className="h-4 w-4 text-emerald-500" />
                         Best time to visit
                      </div>
                      <p className="text-sm text-zinc-500">{dest.practical.bestTime}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-2">
                         <MapPin className="h-4 w-4 text-emerald-500" />
                         Getting there
                      </div>
                      <p className="text-sm text-zinc-500">{dest.practical.gettingThere}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-2">
                         <Info className="h-4 w-4 text-emerald-500" />
                         Entry fees
                      </div>
                      <p className="text-sm text-zinc-500">{dest.practical.fees}</p>
                   </div>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <p className="text-zinc-500">Sunscreen, insect repellent, comfortable walking shoes, and a light rain jacket are recommended for most destinations in Sierra Leone.</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-8">
                <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
                   <h3 className="text-xl font-bold mb-6">Plan your visit</h3>
                   <p className="text-sm text-zinc-500 mb-8">Ready to explore {dest.name}? Let us help you connect with local guides and transport.</p>
                   <div className="space-y-4">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-12">Book a Local Guide</Button>
                      <Button variant="outline" className="w-full rounded-full h-12">Inquire about transport</Button>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {dest.images.slice(1).map((img: string, i: number) => (
                      <img key={i} src={img} alt="Gallery" className="rounded-2xl h-32 w-full object-cover" />
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
