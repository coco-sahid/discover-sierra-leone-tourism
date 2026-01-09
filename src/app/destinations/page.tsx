"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const destinations = [
  {
    slug: "river-no-2",
    name: "River No. 2 Beach",
    region: "Western Area",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    description: "A pristine stretch of white sand where the river meets the Atlantic ocean. perfect for a relaxing day trip from Freetown.",
  },
  {
    slug: "tacugama",
    name: "Tacugama Chimpanzee Sanctuary",
    region: "Western Area",
    category: "Wildlife",
    image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=800",
    description: "Founded in 1995 to rescue and rehabilitate orphaned and abandoned chimpanzees.",
  },
  {
    slug: "tiwai",
    name: "Tiwai Island",
    region: "Eastern Province",
    category: "Wildlife",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800",
    description: "One of the most important biodiversity hotspots in West Africa, home to rare primates and pygmy hippos.",
  },
  {
    slug: "banana-islands",
    name: "Banana Islands",
    region: "Western Area",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800",
    description: "A group of islands off the coast offering diving, fishing, and a glimpse into colonial history.",
  },
  {
    slug: "mount-bintumani",
    name: "Mount Bintumani",
    region: "Northern Province",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    description: "The highest peak in Sierra Leone and West Africa, offering challenging treks and breathtaking views.",
  },
  {
    slug: "tokeh-beach",
    name: "Tokeh Beach",
    region: "Western Area",
    category: "Beaches",
    image: "https://images.unsplash.com/photo-1544469537-c790382046bc?q=80&w=800",
    description: "Famous for its stunning mountain backdrop and luxury resorts, Tokeh is the epitome of coastal relaxation.",
  },
];

const regions = ["All", "Western Area", "Northern Province", "Southern Province", "Eastern Province"];
const categories = ["All", "Beaches", "Wildlife", "Culture", "Adventure"];

export default function DestinationsPage() {
  return (
    <div className="pt-24 pb-24">
      {/* Header */}
      <section className="bg-zinc-50 dark:bg-zinc-900 py-20 mb-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-playfair mb-6"
          >
            Explore Our Destinations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 max-w-2xl mx-auto text-lg"
          >
            From the bustling streets of Freetown to the serene peaks of the Loma Mountains, discover the diverse beauty of Sierra Leone.
          </motion.p>
        </div>
      </section>

      {/* Filters (Mock) */}
      <section className="mb-12 sticky top-20 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md py-4 border-y border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
            <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
            <div className="flex gap-2">
              {regions.map((region) => (
                <Badge
                  key={region}
                  variant={region === "All" ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5"
                >
                  {region}
                </Badge>
              ))}
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={cat === "All" ? "secondary" : "outline"}
                className="cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div
              key={dest.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link href={`/destinations/${dest.slug}`}>
                <div className="relative h-[400px] overflow-hidden rounded-[32px] mb-6">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">
                        {dest.category}
                      </Badge>
                      <span className="text-xs font-medium text-zinc-300 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {dest.region}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold font-playfair mb-2">{dest.name}</h3>
                    <p className="text-sm text-zinc-300 line-clamp-2 mb-4 group-hover:line-clamp-none transition-all">
                      {dest.description}
                    </p>
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform">
                      Explore destination <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map CTA */}
      <section className="mt-24 mx-auto max-w-7xl px-4">
        <div className="bg-zinc-900 rounded-[40px] p-8 md:p-16 text-white flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-6">Explore the Interactive Map</h2>
            <p className="text-zinc-400 text-lg mb-8">
              Plan your journey geographically. See where all our destinations are located relative to Lungi International Airport and Freetown.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full px-8">
              Open Map
            </Button>
          </div>
          <div className="flex-1 w-full h-[300px] md:h-[400px] bg-zinc-800 rounded-3xl overflow-hidden relative">
             <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-12 w-12 text-emerald-500 animate-bounce" />
             </div>
             <img 
               src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200" 
               alt="Map placeholder" 
               className="w-full h-full object-cover opacity-30"
             />
          </div>
        </div>
      </section>
    </div>
  );
}
