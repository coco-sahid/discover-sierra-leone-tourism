"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, ArrowLeft, Clock, Info, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BookingModal } from "@/components/BookingModal";

export default function DestinationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [dest, setDest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDestination() {
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setDest(data);
      } catch (err) {
        console.error("Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchDestination();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-32 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
        <p className="text-zinc-500">Discovering Sierra Leone...</p>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="pt-32 pb-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
        <p className="text-zinc-500 mb-8">We couldn't find the destination you're looking for.</p>
        <Button onClick={() => router.push("/destinations")} variant="outline" className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to destinations
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24">
      {/* Hero Gallery */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          priority
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

            {dest.highlights && dest.highlights.length > 0 && (
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
            )}

            <Tabs defaultValue="practical" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8">
                <TabsTrigger value="practical" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">Practical Info</TabsTrigger>
                <TabsTrigger value="packing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">What to pack</TabsTrigger>
              </TabsList>
              <TabsContent value="practical">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-2">
                         <Clock className="h-4 w-4 text-emerald-500" />
                         Best time to visit
                      </div>
                      <p className="text-sm text-zinc-500">{dest.best_time || "Dry season (November to April) is generally recommended."}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-2">
                         <MapPin className="h-4 w-4 text-emerald-500" />
                         Getting there
                      </div>
                      <p className="text-sm text-zinc-500">{dest.getting_there || "Accessible by road or boat depending on the location."}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold mb-2">
                         <Info className="h-4 w-4 text-emerald-500" />
                         Entry fees
                      </div>
                      <p className="text-sm text-zinc-500">{dest.fees || "Local fees may apply."}</p>
                   </div>
                </div>
              </TabsContent>
              <TabsContent value="packing">
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
                        <Button onClick={() => setBookingModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-12">Book a Local Guide</Button>
                        <Button variant="outline" className="w-full rounded-full h-12" onClick={() => setBookingModalOpen(true)}>Inquire about transport</Button>
                     </div>
                </div>

<div className="grid grid-cols-2 gap-4">
                     <img src={dest.image} alt="Gallery" className="rounded-2xl h-32 w-full object-cover" />
                   </div>

                  {dest.latitude && dest.longitude && (
                    <WeatherWidget 
                      latitude={Number(dest.latitude)} 
                      longitude={Number(dest.longitude)} 
                      locationName={dest.name}
                    />
                  )}
                 </div>
              </div>
            </div>

<ReviewsSection destinationId={dest.id} destinationName={dest.name} />
          </section>

          {dest && (
            <BookingModal
              isOpen={bookingModalOpen}
              onClose={() => setBookingModalOpen(false)}
              destination={{
                id: dest.id,
                name: dest.name,
                region: dest.region,
                image: dest.image,
              }}
            />
          )}
        </div>
    );
  }
