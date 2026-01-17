"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { DestinationForm } from "@/components/DestinationForm";
import { Loader2 } from "lucide-react";

export default function EditDestination() {
  const { id } = useParams();
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestination() {
      const { data, error } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!error) {
        setDestination(data);
      }
      setLoading(false);
    }

    if (id) fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Destination not found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-playfair">Edit Destination</h1>
        <p className="text-zinc-500 mt-2">Update the information for {destination.name}.</p>
      </div>
      
      <DestinationForm id={id as string} initialData={destination} />
    </div>
  );
}
