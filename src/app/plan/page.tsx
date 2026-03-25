"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Plane, CreditCard, HeartPulse, Bus, Info, Send, Map as MapIcon, Compass, Sparkles, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TripInquiryForm } from "@/components/trip-inquiry-form";
import { ItineraryBuilder } from "@/components/ItineraryBuilder";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

// Dynamically import MapView to avoid SSR issues with Leaflet
const DynamicMapView = dynamic(() => import("@/components/MapView").then(mod => mod.MapView), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-3xl animate-pulse flex items-center justify-center">
      <MapIcon className="w-12 h-12 text-zinc-300" />
    </div>
  )
});

const practicalInfo = [
  {
    id: "visa",
    title: "Visa & Entry",
    icon: ShieldCheck,
    content: "Most international visitors require a visa. E-visas are available for many nationalities. Yellow fever vaccination certificate is mandatory.",
  },
  {
    id: "health",
    title: "Health & Safety",
    icon: HeartPulse,
    content: "Malaria prophylaxis is strongly recommended. Consult your doctor for up-to-date health advice before traveling.",
  },
  {
    id: "arrival",
    title: "Arrival (Lungi)",
    icon: Plane,
    content: "Lungi Airport is across the bay from Freetown. Reach the city via water taxi (30 mins) or road (3+ hours).",
  },
  {
    id: "currency",
    title: "Currency",
    icon: CreditCard,
    content: "The local currency is the Leone. Cash is essential; cards are accepted at major hotels and restaurants.",
  },
];

const curatedRoutes = [
  {
    title: "Coastal Escape",
    days: "5 Days",
    path: "Freetown • Tokeh • Bureh",
    color: "bg-emerald-600",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80"
  },
  {
    title: "Wildlife & Heritage",
    days: "10 Days",
    path: "Bunce • Tiwai • Gola",
    color: "bg-zinc-900",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80"
  }
];

export default function PlanPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function fetchDestinations() {
      const { data } = await supabase.from("destinations").select("*");
      if (data) setDestinations(data);
    }
    fetchDestinations();
  }, []);

  return (
    <div className="pt-24 pb-24 bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <section className="relative px-4 mx-auto max-w-7xl mb-16">
        <div className="bg-zinc-900 rounded-3xl sm:rounded-[48px] overflow-hidden p-6 sm:p-12 md:p-20 relative min-h-[500px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/a29adf43-7e98-417c-aefd-75668f7c760a/barnabas-lartey-odoi-tetteh-5YdLNHzwux4-unsplash-resized-1768190173443.jpg" 
              alt="Sierra Leone" 
              className="w-full h-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <Badge className="bg-emerald-500 text-white border-none px-4 py-1.5 rounded-full mb-6">
              Itinerary Architect
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold font-playfair text-white mb-6 leading-tight">
              Craft Your Perfect <br />
              <span className="text-emerald-400 italic">Sierra Leonean</span> Story
            </h1>
            <p className="text-zinc-300 text-lg mb-8 leading-relaxed max-w-xl">
              Use our interactive tools to design a personalized journey, or start from our expert-curated templates.
            </p>
          </div>
        </div>
      </section>
    
      {/* Interactive Itinerary Builder */}
      <section className="mx-auto max-w-7xl px-4 mt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold font-playfair mb-2">Build Your Path</h2>
            <p className="text-zinc-500">Add destinations and visualize your route.</p>
          </div>
          <Button 
            onClick={() => setShowMap(!showMap)}
            variant="outline" 
            className={`rounded-xl h-12 px-6 ${showMap ? "bg-emerald-50 text-emerald-600 border-emerald-200" : ""}`}
          >
            <MapIcon className="w-5 h-5 mr-2" /> 
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 400, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800"
              >
                <DynamicMapView destinations={destinations} />
              </motion.div>
            )}
          </AnimatePresence>
          <ItineraryBuilder />
        </div>
      </section>
    
      {/* Condensed Expert Curation */}
      <section className="mx-auto max-w-7xl px-4 mt-24 border-t border-zinc-100 dark:border-zinc-900 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold font-playfair mb-4">Expert Templates</h2>
            <p className="text-zinc-500 mb-8">Not sure where to start? Try these proven routes designed by our local guides.</p>
            <div className="space-y-4">
              {curatedRoutes.map((route) => (
                <div key={route.title} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer group border border-zinc-100 dark:border-zinc-800">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={route.image} alt={route.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{route.title}</h4>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider">{route.days} • {route.path}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Practical Info Integrated as a Sidebar/Grid */}
          <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] p-8 md:p-12 border border-zinc-100 dark:border-zinc-800">
            <h3 className="text-2xl font-bold font-playfair mb-8 flex items-center gap-3">
              <Info className="w-6 h-6 text-emerald-500" />
              Essential Intelligence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {practicalInfo.map((info) => (
                <div key={info.id} className="bg-white dark:bg-zinc-950 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                      <info.icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm">{info.title}</h4>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{info.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="mt-24 pb-12 mx-auto max-w-4xl px-4">
        <div className="bg-zinc-900 rounded-[40px] p-8 md:p-16 text-white text-center">
          <h2 className="text-3xl font-bold font-playfair mb-6">Need a custom plan?</h2>
          <p className="text-zinc-400 mb-10 max-w-xl mx-auto">Our local experts can help you refine your itinerary and handle all the logistics.</p>
          <div className="bg-white dark:bg-zinc-950 rounded-[32px] p-8 text-left text-zinc-900 dark:text-white">
            <TripInquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
