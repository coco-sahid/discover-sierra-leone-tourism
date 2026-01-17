"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Users, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking_id");
  
  const [booking, setBooking] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      const { data: bookingData, error } = await supabase
        .from("bookings")
        .select("*, destinations(*)")
        .eq("id", bookingId)
        .single();

      if (!error && bookingData) {
        setBooking(bookingData);
        setDestination(bookingData.destinations);
      }
      setLoading(false);
    }

    fetchBooking();
  }, [bookingId]);

  const tourTypeLabels: Record<string, string> = {
    guided_tour: "Guided Tour",
    transport: "Transport",
    accommodation: "Full Package",
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
        <p className="text-zinc-500">Loading booking details...</p>
      </div>
    );
  }

  if (!bookingId || !booking) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
        <p className="text-zinc-500 mb-8">We couldn&apos;t find your booking details.</p>
        <Button onClick={() => router.push("/destinations")} className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
          Browse Destinations
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold font-playfair mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Your adventure in Sierra Leone awaits
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 mb-8"
        >
          <h2 className="text-xl font-bold mb-6">Booking Details</h2>
          
          {destination && (
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-bold text-lg">{destination.name}</h3>
                <p className="text-sm text-zinc-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {destination.region}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Tour Type</span>
              <span className="font-medium">{tourTypeLabels[booking.tour_type] || booking.tour_type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Tour Date
              </span>
              <span className="font-medium">
                {new Date(booking.tour_date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 flex items-center gap-2">
                <Users className="h-4 w-4" /> Guests
              </span>
              <span className="font-medium">{booking.number_of_guests}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <span className="font-bold">Total Paid</span>
              <span className="font-bold text-emerald-600 text-xl">
                ${(booking.total_amount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 mb-8"
        >
          <h3 className="font-bold mb-2">What&apos;s Next?</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Our local team will reach out within 24 hours to confirm your tour details and
            provide you with meeting point information.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => router.push("/destinations")}
            variant="outline"
            className="flex-1 rounded-full h-12"
          >
            Explore More Destinations
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-full h-12"
          >
            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
