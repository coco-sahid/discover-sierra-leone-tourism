"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Calendar, 
  Heart, 
  Star, 
  MapPin, 
  Clock, 
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  LogOut,
  Map as MapIcon,
  Trash2,
  ExternalLink,
  Navigation
} from "lucide-center";
import { 
  Plus, 
  Search, 
  Filter, 
  Save, 
  TrendingUp,
  DollarSign,
  Compass
} from "lucide-react"; // I'll use lucide-react for consistency

// Wait, I should stick to the icons already imported or use lucide-react consistently
import { 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  Heart as HeartIcon, 
  Star as StarIcon, 
  MapPin as MapPinIcon, 
  Clock as ClockIcon, 
  CheckCircle2 as CheckCircle2Icon,
  XCircle as XCircleIcon,
  Loader2 as Loader2Icon,
  ArrowRight as ArrowRightIcon,
  LogOut as LogOutIcon,
  Map as MapIconReact,
  Trash2 as Trash2Icon,
  ExternalLink as ExternalLinkIcon,
  Navigation as NavigationIcon,
  FileText
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

interface Booking {
  id: string;
  tour_type: string;
  tour_date: string;
  number_of_guests: number;
  status: string;
  total_amount: number;
  created_at: string;
  destinations: {
    name: string;
    slug: string;
    image: string;
    region: string;
  };
}

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  destinations: {
    name: string;
    slug: string;
    image: string;
  };
}

interface Favorite {
  id: string;
  destinations: {
    id: string;
    name: string;
    slug: string;
    image: string;
    region: string;
    category: string;
  };
}

interface Itinerary {
  id: string;
  title: string;
  total_days: number;
  status: string;
  created_at: string;
}

const tourTypeLabels: Record<string, string> = {
  guided_tour: "Guided Tour",
  transport: "Transport",
  accommodation: "Full Package",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  draft: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/dashboard");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, reviewsRes, favoritesRes, itinerariesRes, profileRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, destinations(name, slug, image, region)")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("*, destinations(name, slug, image)")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("favorites")
          .select("*, destinations(id, name, slug, image, region, category)")
          .eq("user_id", user!.id),
        supabase
          .from("itineraries")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user!.id)
          .single(),
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);
      if (favoritesRes.data) setFavorites(favoritesRes.data);
      if (itinerariesRes.data) setItineraries(itinerariesRes.data);
      if (profileRes.data) setProfile(profileRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else {
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase.from("favorites").delete().eq("id", favoriteId);
    if (!error) {
      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast.success("Removed from favorites");
    }
  };

  const deleteItinerary = async (id: string) => {
    if (!confirm("Are you sure you want to delete this itinerary?")) return;
    
    const { error } = await supabase.from("itineraries").delete().eq("id", id);
    if (!error) {
      setItineraries(itineraries.filter(i => i.id !== id));
      toast.success("Itinerary deleted");
    } else {
      toast.error("Failed to delete itinerary");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
        <p className="text-zinc-500">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-playfair">
                  Welcome, {profile?.full_name || "Traveler"}!
                </h1>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full">
                <Link href="/plan">
                  <Plus className="w-4 h-4 mr-2" /> New Trip
                </Link>
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 rounded-full"
              >
                <LogOutIcon className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Bookings", val: bookings.length, icon: CalendarIcon, color: "blue" },
            { label: "Itineraries", val: itineraries.length, icon: NavigationIcon, color: "emerald" },
            { label: "Reviews", val: reviews.length, icon: StarIcon, color: "amber" },
            { label: "Favorites", val: favorites.length, icon: HeartIcon, color: "rose" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.val}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="itineraries" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-8 overflow-x-auto">
            <TabsTrigger value="itineraries" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">
              <NavigationIcon className="w-4 h-4 mr-2" /> My Itineraries
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">
              <CalendarIcon className="w-4 h-4 mr-2" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">
              <StarIcon className="w-4 h-4 mr-2" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent px-6 py-4 font-bold">
              <HeartIcon className="w-4 h-4 mr-2" /> Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itineraries">
            {itineraries.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
                <NavigationIcon className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No itineraries yet</h3>
                <p className="text-zinc-500 mb-6">Plan your custom trip using our builder!</p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
                  <Link href="/plan">Start Planning</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itineraries.map((itinerary) => (
                  <motion.div
                    key={itinerary.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                        <MapIconReact className="w-6 h-6" />
                      </div>
                      <Badge className={statusColors[itinerary.status]}>
                        {itinerary.status.charAt(0).toUpperCase() + itinerary.status.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">{itinerary.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-zinc-500 mb-6">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" /> {itinerary.total_days} Days
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" /> {format(new Date(itinerary.created_at), "MMM d")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" className="flex-1 rounded-xl">
                        <Link href={`/plan?id=${itinerary.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteItinerary(itinerary.id)}
                        className="rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            {bookings.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
                <CalendarIcon className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
                <p className="text-zinc-500 mb-6">Start planning your Sierra Leone adventure!</p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
                  <Link href="/destinations">Browse Destinations</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-32 md:h-auto">
                        <img
                          src={booking.destinations?.image}
                          alt={booking.destinations?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={statusColors[booking.status]}>
                                {booking.status === "confirmed" && <CheckCircle2Icon className="w-3 h-3 mr-1" />}
                                {booking.status === "cancelled" && <XCircleIcon className="w-3 h-3 mr-1" />}
                                {booking.status === "pending" && <ClockIcon className="w-3 h-3 mr-1" />}
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <Badge variant="secondary">{tourTypeLabels[booking.tour_type]}</Badge>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{booking.destinations?.name}</h3>
                            <p className="text-sm text-zinc-500 flex items-center gap-1 mb-2">
                              <MapPinIcon className="w-3 h-3" /> {booking.destinations?.region}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {format(new Date(booking.tour_date), "MMMM d, yyyy")}
                              </span>
                              <span>{booking.number_of_guests} guest{booking.number_of_guests > 1 ? "s" : ""}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">
                              ${(booking.total_amount / 100).toFixed(2)}
                            </p>
                            <Link href={`/destinations/${booking.destinations?.slug}`}>
                              <Button variant="link" className="text-emerald-600 p-0">
                                View Destination <ArrowRightIcon className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
                <StarIcon className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No reviews yet</h3>
                <p className="text-zinc-500 mb-6">Share your experiences with other travelers!</p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
                  <Link href="/destinations">Explore Destinations</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={review.destinations?.image}
                        alt={review.destinations?.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link href={`/destinations/${review.destinations?.slug}`} className="font-bold hover:text-emerald-600">
                            {review.destinations?.name}
                          </Link>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.title && <h4 className="font-semibold mb-1">{review.title}</h4>}
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{review.content}</p>
                        <p className="text-xs text-zinc-400 mt-2">
                          {format(new Date(review.created_at), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favorites.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 rounded-3xl">
                <HeartIcon className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
                <p className="text-zinc-500 mb-6">Save destinations you want to visit!</p>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 rounded-full">
                  <Link href="/destinations">Discover Places</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group"
                  >
                    <div className="relative h-40">
                      <img
                        src={favorite.destinations?.image}
                        alt={favorite.destinations?.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => removeFavorite(favorite.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-red-50 transition"
                      >
                        <HeartIcon className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                      <Badge className="absolute bottom-3 left-3 bg-emerald-500">
                        {favorite.destinations?.category}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{favorite.destinations?.name}</h3>
                      <p className="text-sm text-zinc-500 flex items-center gap-1 mb-3">
                        <MapPinIcon className="w-3 h-3" /> {favorite.destinations?.region}
                      </p>
                      <Link href={`/destinations/${favorite.destinations?.slug}`}>
                        <Button variant="outline" className="w-full rounded-full">
                          View Details <ArrowRightIcon className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
