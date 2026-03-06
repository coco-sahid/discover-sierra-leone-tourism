"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";

const getImageUrl = (image: string | undefined): string => {
  if (!image) return '/no2.jpg'; // fallback
  if (image.startsWith('http')) return image; // remote URL
  if (image.startsWith('/')) return image; // already has slash
  return `/${image}`; // add slash for local files
};

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchFavorites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        destination:destinations (*)
      `)
      .eq("user_id", user?.id);

    if (data) {
      setFavorites(data.map(f => f.destination));
    }
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 text-center">
        <Heart className="h-16 w-16 text-rose-200 mx-auto mb-6" />
        <h1 className="text-3xl font-bold font-playfair mb-4">Your Favorites</h1>
        <p className="text-zinc-500 mb-8">Please sign in to view and manage your saved destinations.</p>
        <Link href="/auth">
          <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8 h-12">
            Sign In / Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4">My Saved Places</h1>
            <p className="text-zinc-500">Your personalized collection of Sierra Leonean gems.</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800">
            <Heart className="h-12 w-12 text-rose-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
            <p className="text-zinc-500 mb-8">Start exploring and save the places that catch your eye!</p>
            <Link href="/destinations">
              <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8">
                Explore Destinations
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {favorites.map((dest) => (
                <motion.div
                  key={dest.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  <div className="absolute top-6 right-6 z-10">
                    <FavoriteButton destinationId={dest.id} />
                  </div>
                  
                  <Link href={`/destinations/${dest.slug}`}>
                    <div className="relative h-[400px] overflow-hidden rounded-[32px] mb-6 shadow-lg">
                      <img
                        src={getImageUrl(dest.image)}
                        alt={dest.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <Badge className="bg-emerald-500 mb-3 border-none">{dest.category}</Badge>
                        <h3 className="text-2xl font-bold font-playfair mb-2">{dest.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-300 mb-4">
                          <MapPin className="h-3 w-3 text-emerald-400" />
                          {dest.region}
                        </div>
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform">
                          View details <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
