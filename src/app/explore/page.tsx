"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Compass, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const MapView = dynamic(() => import("@/components/MapView").then(mod => mod.MapView), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center rounded-2xl">
      <MapPin className="w-12 h-12 text-zinc-400 animate-bounce" />
    </div>
  ),
});

const regions = [
  { name: "All", description: "View all destinations across Sierra Leone" },
  { name: "Western Area", description: "Capital city & pristine beaches" },
  { name: "Northern Province", description: "Mountains & national parks" },
  { name: "Southern Province", description: "Historic islands & culture" },
  { name: "Eastern Province", description: "Wildlife & river adventures" },
];

const categories = [
  { name: "All", color: "bg-zinc-500" },
  { name: "Beaches", color: "bg-sky-500" },
  { name: "Wildlife", color: "bg-green-500" },
  { name: "Culture", color: "bg-amber-500" },
  { name: "Adventure", color: "bg-red-500" },
];

export default function ExplorePage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("destinations")
      .select("*");
    if (data) {
      setDestinations(data);
    }
    setLoading(false);
  };

  const filteredDestinations = destinations.filter(d => {
    const regionMatch = selectedRegion === "All" || d.region === selectedRegion;
    const categoryMatch = selectedCategory === "All" || d.category === selectedCategory;
    return regionMatch && categoryMatch;
  });

  const regionStats = regions.map(r => ({
    ...r,
    count: r.name === "All" 
      ? destinations.length 
      : destinations.filter(d => d.region === r.name).length
  }));

  return (
    <div className="min-h-screen pt-20">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        <aside className="w-full lg:w-80 bg-white dark:bg-zinc-950 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto shadow-xl z-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold">Explore by Region</h2>
              </div>
              <div className="space-y-2">
                {regionStats.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => setSelectedRegion(region.name)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedRegion === region.name
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500"
                        : "bg-zinc-50 dark:bg-zinc-900 border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-semibold ${selectedRegion === region.name ? "text-emerald-600" : ""}`}>
                        {region.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {region.count}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500">{region.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold">Categories</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    variant={selectedCategory === cat.name ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 transition-all flex items-center gap-2 ${
                      selectedCategory === cat.name 
                        ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600" 
                        : "hover:border-emerald-500 hover:text-emerald-500"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 mb-4">
                Showing <span className="font-bold text-emerald-600">{filteredDestinations.length}</span> destinations
              </p>
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl py-6">
                <Link href="/destinations">View All Destinations</Link>
              </Button>
            </div>
          </motion.div>
        </aside>

        <main className="flex-1 relative bg-zinc-100">
          {loading ? (
            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
              <MapPin className="w-12 h-12 text-zinc-400 animate-bounce" />
            </div>
          ) : (
            <MapView 
              destinations={filteredDestinations} 
              selectedRegion={selectedRegion}
            />
          )}
        </main>
      </div>
    </div>
  );
}
