"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowRight, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";

const regions = ["All", "Western Area", "Northern Province", "Southern Province", "Eastern Province"];
const categories = ["All", "Beaches", "Wildlife", "Culture", "Adventure"];
const experienceTypes = [
  "All",
  "eco-tourism", 
  "cultural festivals", 
  "beach holidays", 
  "historical tours", 
  "volunteer tourism"
];

export default function DestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");

  useEffect(() => {
    fetchDestinations();
  }, [selectedRegion, selectedCategory, selectedExperience]);

  const fetchDestinations = async () => {
    setLoading(true);
    let query = supabase.from("destinations").select("*");

    if (selectedRegion !== "All") {
      query = query.eq("region", selectedRegion);
    }

    if (selectedCategory !== "All") {
      query = query.eq("category", selectedCategory);
    }

    if (selectedExperience !== "All") {
      query = query.contains("experience_types", [selectedExperience]);
    }

    const { data, error } = await query;
    if (data) {
      setDestinations(data);
    }
    setLoading(false);
  };

  const hasFilters = selectedRegion !== "All" || selectedCategory !== "All" || selectedExperience !== "All";

  const clearFilters = () => {
    setSelectedRegion("All");
    setSelectedCategory("All");
    setSelectedExperience("All");
  };

  return (
    <div className="pt-24 pb-24 min-h-screen">
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

      {/* Filters & Search */}
      <section className="mb-12 sticky top-20 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md py-6 border-y border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <LocationAutocomplete 
                onSelect={(loc) => router.push(`/destinations/${loc.slug}`)}
                placeholder="Find a town or spot (e.g. Bonthe)..."
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
              <div className="flex flex-wrap gap-2">
                {experienceTypes.map((type) => (
                  <Badge
                    key={type}
                    onClick={() => setSelectedExperience(type)}
                    variant={selectedExperience === type ? "default" : "outline"}
                    className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 transition-all ${
                      selectedExperience === type ? "bg-emerald-600" : "hover:border-emerald-500 hover:text-emerald-500"
                    }`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Regions</option>
              {regions.filter(r => r !== "All").map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== "All").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {hasFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-xs text-rose-500 hover:text-rose-600"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[400px] rounded-[32px] bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {destinations.map((dest) => (
                <motion.div
                  key={dest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative"
                >
                  <div className="absolute top-6 right-6 z-10">
                    <FavoriteButton destinationId={dest.id} />
                  </div>
                  
                  <Link href={`/destinations/${dest.slug}`}>
                    <div className="relative h-[400px] overflow-hidden rounded-[32px] mb-6 shadow-lg">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-3 py-1">
                            {dest.category}
                          </Badge>
                          {dest.experience_types?.map((type: string) => (
                            <Badge key={type} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md text-[10px] uppercase tracking-wider">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-2xl font-bold font-playfair mb-2">{dest.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 mb-3">
                          <MapPin className="h-3 w-3 text-emerald-400" />
                          {dest.region}
                        </div>
                        <p className="text-sm text-zinc-300 line-clamp-2 mb-4">
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
            </AnimatePresence>

            {destinations.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-zinc-500">No destinations found matching your criteria.</p>
                <Button 
                  variant="link" 
                  onClick={clearFilters}
                  className="mt-4 text-emerald-600"
                >
                  Reset all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
