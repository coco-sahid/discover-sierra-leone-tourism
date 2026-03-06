"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, ShieldCheck, Globe as GlobeIcon, Star, Quote, Users, Shield, GraduationCap, Heart, Zap, TreePalm as Tree, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Globe } from "@/components/Globe";



const iconMap: Record<string, any> = {
  Users,
  Shield,
  GraduationCap,
  Heart,
  Zap,
  Tree,
  Home: HomeIcon
};

const getImageUrl = (image: string | undefined): string => {
  if (!image) return '/no2.jpg'; // fallback
  if (image.startsWith('http')) return image; // remote URL
  if (image.startsWith('/')) return image; // already has slash
  return `/${image}`; // add slash for local files
};

function StatSkeleton() {
  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
      <Skeleton className="h-10 w-10 rounded-xl mb-4" />
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

function DestinationSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-xl rounded-3xl h-full flex flex-col">
      <Skeleton className="h-72 w-full" />
      <CardContent className="p-8 flex flex-col flex-1">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </CardContent>
    </Card>
  );
}

export function HomeClient() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [featuredDestinations, setFeaturedDestinations] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [impactStats, setImpactStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [destRes, testRes, impactRes] = await Promise.all([
            supabase.from("destinations").select("*").eq("is_featured", true).limit(6),
          supabase.from("testimonials").select("*").eq("is_featured", true).limit(3),
          supabase.from("impact_stats").select("*").limit(4)
        ]);

        if (destRes.data) setFeaturedDestinations(destRes.data);
        if (testRes.data) setTestimonials(testRes.data);
        if (impactRes.data) setImpactStats(impactRes.data);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);
      
      if (error && error.code !== "23505") throw error; // Ignore duplicate key error
      
      setSubscribed(true);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] lg:h-screen w-full overflow-hidden flex items-center bg-white dark:bg-zinc-950 pt-20 lg:pt-0">
          <div className="mx-auto max-w-7xl px-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="z-10 text-center lg:text-left order-2 lg:order-1"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <h1 className="mb-6 font-playfair text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-6xl lg:text-7xl leading-[1.1]">
                    Sierra Leone:<br />
                    <span className="text-emerald-600 dark:text-emerald-400 italic">Where Nature Meets Soul</span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mb-10 text-lg text-zinc-600 dark:text-zinc-400 md:text-xl max-w-xl lg:mx-0 mx-auto font-light leading-relaxed"
                >
                  Discover pristine white beaches, lush rainforests, and the warm hospitality of the Lions Mountain. Your authentic African adventure begins here.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start"
                >
                  <Link href="/destinations">
                    <Button 
                      size="lg" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14 text-lg w-full sm:w-auto shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                    >
                      Explore Destinations
                    </Button>
                  </Link>
                  <Link href="/plan">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full px-8 h-14 text-lg w-full sm:w-auto transition-all duration-300 active:scale-95"
                    >
                      Plan Your Trip
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>


            {/* Image/Globe Side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative order-1 lg:order-2 flex justify-center"
            >
              <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
                <Globe />
                
                {/* Floating Discovery Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute top-1/4 right-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-emerald-500/20 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-sm font-medium">8.4606° N, 11.7799° W</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">Discover the Lion Mountain</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-400 dark:text-zinc-600 text-sm"
        >
          <span className="uppercase tracking-widest text-[10px] font-bold">Discover More</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowRight className="h-4 w-4 rotate-90" />
          </motion.div>
        </motion.div>
      </section>



      {/* Our Commitment Section (Merged Local Impact & Trust/Safety) */}
      <section className="py-24 bg-white dark:bg-zinc-950 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Text & Stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-emerald-600" />
                <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Our Commitment</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair mb-8 leading-[1.1]">
                Safe, Sustainable, <br />
                <span className="text-emerald-600 italic">and Sincere</span>
              </h2>
              
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-12 leading-relaxed font-light">
                Sierra Leone is one of the safest and most hospitable countries in West Africa. Your journey directly supports local conservation and the empowerment of our people.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-12">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
                ) : (
                  impactStats.map((stat, idx) => {
                    const Icon = iconMap[stat.icon] || Heart;
                    return (
                      <div key={stat.id} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                        <Icon className="h-5 w-5 text-emerald-600 mb-3" />
                        <p className="text-2xl font-bold font-playfair">{stat.value}</p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{stat.label}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">Certified Safe Travel</span>
                </div>
                <div className="flex items-center gap-3">
                  <GlobeIcon className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium">100% Community Led</span>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Visuals */}
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl"
              >
                <Image
                  src="/freetown.jpg"
                  alt="Scenic Sierra Leone"
                  width={800}
                  height={600}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-emerald-500/20 flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Heart className="h-5 w-5 text-emerald-600 fill-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">100% Ready</p>
                    <p className="text-[10px] text-zinc-500 font-medium">Safety Certified</p>
                  </div>
                </div>
              </motion.div>
              
              <div className="absolute -bottom-10 -right-10 w-2/3 z-20 hidden lg:block">
                <div className="p-2 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800">
                  <Image
                    src="/tokeh.jpg"
                    alt="Tokeh Beach"
                    width={400}
                    height={300}
                    className="rounded-2xl object-cover aspect-[4/3]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Featured Destinations - Bento Grid */}
        <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-emerald-600" />
                  <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Featured</span>
                </div>
                <h2 className="text-3xl font-bold md:text-5xl font-playfair mb-4">The Must-Visits</h2>
                <p className="text-zinc-500 max-w-xl">Curated locations that define the Sierra Leonean experience.</p>
              </div>
              <Link href="/destinations" className="text-emerald-600 font-semibold flex items-center gap-2 group">
                View all destinations <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={idx === 0 ? "md:col-span-2 md:row-span-2" : ""}>
                    <Skeleton className={`w-full rounded-3xl ${idx === 0 ? "h-[500px]" : "h-[240px]"}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDestinations.slice(0, 5).map((dest, idx) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={idx === 0 ? "md:col-span-2 md:row-span-2" : ""}
                  >
                    <Link href={`/destinations/${dest.slug}`} className="block h-full group">
                      <div className={`relative overflow-hidden rounded-3xl ${idx === 0 ? "h-full min-h-[500px]" : "h-[240px]"}`}>
                        <Image
                          src={getImageUrl(dest.image)}
                          alt={dest.name}
                          fill
                          sizes={idx === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-emerald-400" />
                            <span className="text-white/80 text-sm">{dest.region || "Sierra Leone"}</span>
                          </div>
                          <h3 className={`text-white font-bold font-playfair ${idx === 0 ? "text-3xl md:text-4xl" : "text-xl"}`}>
                            {dest.name}
                          </h3>
                          {idx === 0 && (
                            <p className="text-white/70 mt-3 line-clamp-2 max-w-lg">
                              {dest.description}
                            </p>
                          )}
                          <div className="mt-4 flex items-center gap-2 text-emerald-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-5xl mb-4 font-playfair">What Travelers Say</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Stories from those who have discovered the magic of Sierra Leone.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-lg relative"
              >
                <Quote className="absolute top-6 right-6 h-8 w-8 text-emerald-100 dark:text-emerald-900/20" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image src={t.avatar_url || "https://i.pravatar.cc/150"} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 italic leading-relaxed">"{t.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-6">Stay in the loop</h2>
          <p className="text-zinc-500 mb-10">Sign up for our monthly newsletter to get travel tips, new stories, and exclusive offers from Sierra Leone.</p>
          
          {subscribed ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-100 dark:bg-emerald-900/30 p-8 rounded-3xl max-w-md mx-auto"
            >
              <h4 className="text-emerald-800 dark:text-emerald-400 font-bold text-xl mb-2">Welcome to the journey!</h4>
              <p className="text-emerald-700 dark:text-emerald-500">Check your inbox for your first Sierra Leone adventure guide.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 h-14 rounded-full border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:bg-zinc-800 dark:border-zinc-700"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
          
          <p className="mt-4 text-xs text-zinc-400">By subscribing, you agree to our Privacy Policy.</p>
        </div>
      </section>
    </div>
  );
}
