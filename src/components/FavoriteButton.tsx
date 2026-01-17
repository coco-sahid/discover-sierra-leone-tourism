"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FavoriteButtonProps {
  destinationId: string;
  className?: string;
}

export function FavoriteButton({ destinationId, className }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, destinationId]);

  const checkIfFavorite = async () => {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user?.id)
      .eq("destination_id", destinationId)
      .single();

    if (data) setIsFavorite(true);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("destination_id", destinationId);
        
        if (error) throw error;
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: user.id, destination_id: destinationId });
        
        if (error) throw error;
        setIsFavorite(true);
        toast.success("Saved to favorites!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 transition-colors ${
        isFavorite ? "text-rose-500 bg-rose-50/20" : "text-white hover:text-rose-400"
      } ${className}`}
    >
      <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
    </motion.button>
  );
}
