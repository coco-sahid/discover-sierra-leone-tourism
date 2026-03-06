"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, Loader2, MapPin, Compass, Car, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const getImageUrl = (image: string | undefined): string => {
  if (!image) return '/no2.jpg'; // fallback
  if (image.startsWith('http')) return image; // remote URL
  if (image.startsWith('/')) return image; // already has slash
  return `/${image}`; // add slash for local files
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    id: string;
    name: string;
    region: string;
    image: string;
  };
}

const TOUR_OPTIONS = [
  {
    id: "guided_tour",
    name: "Guided Tour",
    price: 50,
    icon: Compass,
    description: "Expert local guide for the day",
  },
  {
    id: "transport",
    name: "Transport",
    price: 30,
    icon: Car,
    description: "Round-trip transportation included",
  },
  {
    id: "accommodation",
    name: "Full Package",
    price: 100,
    icon: Home,
    description: "Guide + transport + accommodation",
  },
];

export function BookingModal({ isOpen, onClose, destination }: BookingModalProps) {
  const [tourType, setTourType] = useState("guided_tour");
  const [tourDate, setTourDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTour = TOUR_OPTIONS.find((t) => t.id === tourType)!;
  const totalPrice = selectedTour.price * numberOfGuests;

  const handleBooking = async () => {
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Please sign in to make a booking");
      return;
    }

    if (!tourDate) {
      setError("Please select a tour date");
      return;
    }

    const selectedDate = new Date(tourDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Please select a future date");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: destination.id,
          destinationName: destination.name,
          tourType,
          tourDate,
          numberOfGuests,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl z-50"
          >
            <div className="relative">
              <div className="h-32 overflow-hidden rounded-t-3xl">
                <img
                  src={getImageUrl(destination.image)}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-2xl font-bold text-white font-playfair">{destination.name}</h2>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {destination.region}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3">Select Tour Type</label>
                <div className="space-y-3">
                  {TOUR_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setTourType(option.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition ${
                          tourType === option.id
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          tourType === option.id ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800"
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold">{option.name}</div>
                          <div className="text-sm text-zinc-500">{option.description}</div>
                        </div>
                        <div className="font-bold text-emerald-600">${option.price}<span className="text-xs font-normal text-zinc-500">/person</span></div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-emerald-500" /> Tour Date
                  </label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    min={minDate}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-500" /> Guests
                  </label>
                  <select
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-500">Total</span>
                  <span className="text-3xl font-bold text-emerald-600">${totalPrice}</span>
                </div>
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-14 text-lg font-bold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </Button>
                <p className="text-xs text-center text-zinc-500 mt-3">
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BookingModal;
