"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Camera, Palmtree, Mountain, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Beaches", icon: Palmtree, image: "https://images.unsplash.com/photo-1544469537-c790382046bc?q=80&w=800", color: "bg-blue-500" },
  { name: "Wildlife", icon: Camera, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800", color: "bg-emerald-500" },
  { name: "Culture", icon: Calendar, image: "https://images.unsplash.com/photo-1523805081730-614449339e7a?q=80&w=800", color: "bg-amber-500" },
  { name: "Adventure", icon: Mountain, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800", color: "bg-orange-500" },
];

const featuredDestinations = [
  {
    name: "River No. 2 Beach",
    description: "Voted one of the most beautiful beaches in the world, where the river meets the Atlantic.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
    link: "/destinations/river-no-2",
  },
  {
    name: "Tacugama Sanctuary",
    description: "A haven for rescued chimpanzees and a leader in conservation education.",
    image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=1200",
    link: "/destinations/tacugama",
  },
  {
    name: "Tiway Island",
    description: "An incredible biodiversity hotspot in the Moa River, home to rare pygmy hippos.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200",
    link: "/destinations/tiwai",
  },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-tropical-beach-with-palm-trees-and-white-sand-4567-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative flex h-full items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="mb-6 font-playfair text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
              Sierra Leone:<br />
              <span className="text-emerald-400 italic">Where Nature Meets Soul</span>
            </h1>
            <p className="mb-10 text-lg text-zinc-200 md:text-xl max-w-2xl mx-auto font-light">
              Discover pristine white beaches, lush rainforests, and the warm hospitality of the Lions Mountain. Your authentic African adventure begins here.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14 text-lg">
                Explore Destinations
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full px-8 h-14 text-lg backdrop-blur-sm">
                Plan Your Trip
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/60 text-sm animate-bounce">
          <span>Scroll to explore</span>
          <ArrowRight className="h-4 w-4 rotate-90" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold md:text-5xl mb-4 font-playfair">What are you looking for?</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">From peaceful beach retreats to thrilling jungle safaris, find your perfect experience in Sierra Leone.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-80 overflow-hidden rounded-3xl cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
                  <div className={`p-4 rounded-full ${cat.color} mb-4 transition-transform group-hover:scale-110`}>
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold font-playfair">{cat.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-3xl font-bold md:text-5xl font-playfair mb-4">The Must-Visits</h2>
              <p className="text-zinc-500 max-w-xl">Curated locations that define the Sierra Leonean experience.</p>
            </div>
            <Link href="/destinations" className="text-emerald-600 font-semibold flex items-center gap-2 hover:underline">
              View all destinations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredDestinations.map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-shadow rounded-3xl">
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-black flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-emerald-600" />
                      Popular
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4 font-playfair">{dest.name}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2">
                      {dest.description}
                    </p>
                    <Button variant="ghost" className="p-0 text-emerald-600 hover:text-emerald-700 hover:bg-transparent group">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-24 bg-emerald-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold font-playfair mb-8">Safe, Welcoming, and Ready for You</h2>
              <p className="text-xl text-emerald-100/70 mb-10 font-light leading-relaxed">
                Sierra Leone is recognized as one of the safest and most hospitable countries in West Africa. Our community-led tourism ensures that your visit directly supports local conservation and livelihoods.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/20 p-3 rounded-2xl">
                    <ShieldCheck className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Secure Travel</h4>
                    <p className="text-sm text-emerald-100/50">Official safety protocols for international visitors.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-500/20 p-3 rounded-2xl">
                    <Globe className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Local Impact</h4>
                    <p className="text-sm text-emerald-100/50">Sustainable tourism that benefits our communities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1200"
                alt="Local community"
                className="rounded-[40px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-6">Stay in the loop</h2>
          <p className="text-zinc-500 mb-10">Sign up for our monthly newsletter to get travel tips, new stories, and exclusive offers from Sierra Leone.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 h-14 rounded-full border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14">
              Subscribe
            </Button>
          </div>
          <p className="mt-4 text-xs text-zinc-400">By subscribing, you agree to our Privacy Policy.</p>
        </div>
      </section>
    </div>
  );
}
