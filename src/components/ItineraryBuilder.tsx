"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  MapPin, 
  Calendar, 
  GripVertical, 
  Search, 
  Filter, 
  Save, 
  Loader2,
  TrendingUp,
  DollarSign,
  Compass,
  Map as MapIcon,
  Navigation,
  Sparkles,
  Zap,
  Waves,
  Trees,
  Mountain as MountainIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Destination {
  id: string;
  name: string;
  region: string;
  image: string;
  category: string;
  price: number;
  price_unit: string;
}

interface ItineraryItem {
  id: string;
  destinationId: string;
  destinationName: string;
  price: number;
  price_unit: string;
}

interface DayPlan {
  id: string;
  dayNumber: number;
  items: ItineraryItem[];
  note?: string;
}

export function ItineraryBuilder() {
  const { user } = useAuth();
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [days, setDays] = useState<DayPlan[]>([
    { id: "day-1", dayNumber: 1, items: [] }
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [title, setTitle] = useState("My Adventure in Sierra Leone");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiVibe, setAiVibe] = useState<string>("Adventurous");

  const vibes = [
    { name: "Adventurous", icon: MountainIcon, color: "text-orange-500", bg: "bg-orange-500/10", preferences: ["adventure", "nature", "wildlife"] },
    { name: "Relaxing", icon: Waves, iconName: "Waves", color: "text-blue-500", bg: "bg-blue-500/10", preferences: ["beach", "island"] },
    { name: "Cultural", icon: Trees, color: "text-emerald-500", bg: "bg-emerald-500/10", preferences: ["culture", "history"] }
  ];

  const generateAIItinerary = async () => {
    setIsGeneratingAI(true);
    setShowAIModal(false);
    try {
      const vibe = vibes.find(v => v.name === aiVibe);
      const response = await fetch("/api/ai/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          preferences: vibe?.preferences || [],
          days: 5 
        })
      });

      const data = await response.json();
      if (data.itinerary) {
        const newDays: DayPlan[] = data.itinerary.map((day: any) => ({
          id: `day-${day.day}`,
          dayNumber: day.day,
          note: day.note,
          items: day.destinations.map((dest: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            destinationId: dest.id,
            destinationName: dest.name,
            price: dest.price,
            price_unit: dest.price_unit
          }))
        }));
        setDays(newDays);
        toast.success(`Generated a ${aiVibe} itinerary for you!`);
      }
    } catch (error) {
      toast.error("Failed to generate AI itinerary");
    } finally {
      setIsGeneratingAI(false);
    }
  };


  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("id, name, region, image, category, price, price_unit");
    if (data) setDestinations(data);
    setLoading(false);
  };

  const categories = useMemo(() => {
    const cats = new Set(destinations.map(d => d.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           dest.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [destinations, searchQuery, selectedCategory]);

  const totalPrice = useMemo(() => {
    return days.reduce((total, day) => {
      return total + day.items.reduce((dayTotal, item) => {
        return dayTotal + (Number(item.price) || 0);
      }, 0);
    }, 0);
  }, [days]);

  const addDay = () => {
    setDays(prev => [
      ...prev,
      { id: `day-${prev.length + 1}`, dayNumber: prev.length + 1, items: [] }
    ]);
  };

  const removeDay = (dayId: string) => {
    if (days.length === 1) return;
    setDays(prev => prev.filter(d => d.id !== dayId).map((d, i) => ({ ...d, dayNumber: i + 1 })));
  };

  const addDestinationToDay = (dayId: string, dest: Destination) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          items: [
            ...day.items, 
            { 
              id: Math.random().toString(36).substr(2, 9), 
              destinationId: dest.id, 
              destinationName: dest.name,
              price: dest.price,
              price_unit: dest.price_unit
            }
          ]
        };
      }
      return day;
    }));
    toast.success(`Added ${dest.name} to Day ${days.find(d => d.id === dayId)?.dayNumber}`);
  };

  const removeItemFromDay = (dayId: string, itemId: string) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          items: day.items.filter(item => item.id !== itemId)
        };
      }
      return day;
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save your itinerary");
      router.push("/auth");
      return;
    }

    if (days.every(d => d.items.length === 0)) {
      toast.error("Add at least one destination to your itinerary");
      return;
    }

    setSaving(true);
    try {
      // 1. Create Itinerary
      const { data: itinerary, error: itineraryError } = await supabase
        .from("itineraries")
        .insert({
          user_id: user.id,
          title: title,
          total_days: days.length,
          status: 'draft'
        })
        .select()
        .single();

      if (itineraryError) throw itineraryError;

      // 2. Create Days and Items
      for (const day of days) {
        const { data: dayData, error: dayError } = await supabase
          .from("itinerary_days")
          .insert({
            itinerary_id: itinerary.id,
            day_number: day.dayNumber,
            note: day.note
          })
          .select()
          .single();

        if (dayError) throw dayError;

        if (day.items.length > 0) {
          const itemsToInsert = day.items.map((item, index) => ({
            day_id: dayData.id,
            destination_id: item.destinationId,
            sort_order: index
          }));

          const { error: itemsError } = await supabase
            .from("itinerary_items")
            .insert(itemsToInsert);

          if (itemsError) throw itemsError;
        }
      }

      toast.success("Itinerary saved successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save itinerary");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="space-y-4 flex-1">
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none px-4 py-1 rounded-full">
            Itinerary Planner
          </Badge>
          <div className="space-y-2">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl md:text-4xl font-bold font-playfair bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              placeholder="Give your trip a name..."
            />
            <p className="text-zinc-500">Craft your perfect journey through the Lion Mountain.</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Estimated Cost</div>
            <div className="text-3xl font-bold text-emerald-600 flex items-center gap-1">
              <DollarSign className="w-6 h-6" />
              {totalPrice}
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-8 h-12 text-md shadow-xl shadow-emerald-500/20 w-full md:w-auto"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Itinerary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itinerary (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold font-playfair flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-600" />
              Your Timeline
            </h2>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowAIModal(true)} 
                variant="outline" 
                className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                disabled={isGeneratingAI}
              >
                {isGeneratingAI ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                AI Magic Plan
              </Button>
              <Button onClick={addDay} variant="outline" className="rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50">
                <Plus className="w-4 h-4 mr-2" /> Add Day
              </Button>
            </div>
          </div>

          {/* AI Modal */}
          <AnimatePresence>
            {showAIModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAIModal(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative bg-white dark:bg-zinc-900 rounded-[40px] p-8 md:p-12 max-w-2xl w-full shadow-2xl border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-playfair mb-3">AI Itinerary Concierge</h2>
                    <p className="text-zinc-500">How do you want to experience Sierra Leone?</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    {vibes.map((v) => {
                      const Icon = v.icon;
                      return (
                        <button
                          key={v.name}
                          onClick={() => setAiVibe(v.name)}
                          className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 ${
                            aiVibe === v.name 
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10" 
                              : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                          }`}
                        >
                          <div className={`p-3 rounded-2xl ${v.bg} ${v.color}`}>
                            <Icon size={24} />
                          </div>
                          <span className="font-bold">{v.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAIModal(false)}
                      className="flex-1 h-14 rounded-2xl border border-zinc-200 dark:border-zinc-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={generateAIItinerary}
                      className="flex-1 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/20"
                    >
                      <Zap className="w-5 h-5 mr-2" /> Generate My Plan
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {days.map((day) => (
                <motion.div
                  key={day.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-500/20">
                        {day.dayNumber}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Day {day.dayNumber}</h3>
                        <p className="text-xs text-zinc-500">{day.items.length} destinations planned</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeDay(day.id)}
                      className="text-zinc-400 hover:text-red-500 rounded-xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="p-6">
                    {day.items.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[24px]">
                        <div className="flex justify-center mb-3">
                          <Navigation className="w-8 h-8 text-zinc-300" />
                        </div>
                        <p className="text-zinc-400 max-w-[200px] mx-auto">Drag or add destinations from the explorer</p>
                      </div>
                    ) : (
                      <Reorder.Group 
                        axis="y" 
                        values={day.items} 
                        onReorder={(newItems) => {
                          setDays(prev => prev.map(d => d.id === day.id ? { ...d, items: newItems } : d));
                        }}
                        className="space-y-4"
                      >
                        {day.items.map((item) => (
                          <Reorder.Item
                            key={item.id}
                            value={item}
                            className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-transparent hover:border-emerald-500/20 cursor-grab active:cursor-grabbing group transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
                                <GripVertical className="w-4 h-4 text-zinc-400" />
                              </div>
                              <div>
                                <div className="font-bold">{item.destinationName}</div>
                                {item.price > 0 && (
                                  <div className="text-xs text-emerald-600 font-semibold">
                                    ${item.price} {item.price_unit === 'per_day' ? '/ day' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeItemFromDay(day.id, item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Destination Explorer (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800 shadow-xl sticky top-24">
            <h2 className="text-2xl font-bold font-playfair mb-6 flex items-center gap-2">
              <Compass className="w-6 h-6 text-emerald-600" />
              Explorer
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                  placeholder="Search spots..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 rounded-2xl bg-zinc-50 border-none h-12 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === cat 
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[500px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <p className="text-sm text-zinc-500">Scanning the coast...</p>
                </div>
              ) : filteredDestinations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500">No spots found matching your criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDestinations.map((dest) => (
                    <motion.div 
                      key={dest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl flex items-center gap-4 shadow-sm group hover:bg-white dark:hover:bg-zinc-800 hover:shadow-md transition-all border border-transparent hover:border-emerald-500/10"
                    >
                      <div className="relative overflow-hidden rounded-xl w-20 h-20 shrink-0">
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {dest.price > 0 && (
                          <div className="absolute bottom-1 right-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                            ${dest.price}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate text-zinc-900 dark:text-zinc-100">{dest.name}</div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" /> {dest.region}
                        </div>
                        <div className="flex gap-2">
                          <DropdownMenuComponent 
                            days={days} 
                            onAdd={(dayId) => addDestinationToDay(dayId, dest)} 
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for the "Add to Day" menu to keep main component clean
function DropdownMenuComponent({ days, onAdd }: { days: DayPlan[], onAdd: (id: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[10px] h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-900/10"
      >
        <Plus className="w-3 h-3 mr-1" /> Add to Trip
      </Button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-50 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-100 dark:border-zinc-800 p-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-[10px] font-bold text-zinc-400 px-2 py-1 uppercase tracking-widest">Select Day</div>
            {days.map(day => (
              <button
                key={day.id}
                onClick={() => {
                  onAdd(day.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 transition-colors"
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
