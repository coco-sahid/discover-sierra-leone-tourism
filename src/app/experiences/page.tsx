"use client";

import { motion } from "framer-motion";
import { ArrowRight, Waves, Trees, Music, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const experiences = [
  {
    title: "Surfing in Bureh Beach",
    description: "Catch the perfect wave at Bureh Beach, home to Sierra Leone's first surf club. Whether you're a pro or a beginner, the warm Atlantic waters and consistent swells provide an unforgettable experience.",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800",
    icon: Waves,
    color: "bg-blue-500",
  },
  {
    title: "Chimpanzee Trekking",
    description: "Venture into the lush rainforests of Tacugama or Tiwai Island to spot our closest relatives in their natural habitat. A truly humbling and educational encounter with nature.",
    image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=800",
    icon: Trees,
    color: "bg-emerald-500",
  },
  {
    title: "Cultural Festivals",
    description: "Immerse yourself in the vibrant sounds and colors of Sierra Leone. From the Freetown Music Festival to traditional chiefdom celebrations, experience the soul of our nation.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
    icon: Music,
    color: "bg-purple-500",
  },
  {
    title: "Authentic Gastronomy",
    description: "Savor the flavors of West Africa. From spicy cassava leaf stew to fresh lobster on the beach, our cuisine is a reflection of our rich cultural tapestry.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    icon: Utensils,
    color: "bg-orange-500",
  },
];

export default function ExperiencesPage() {
  return (
    <div className="pt-24 pb-24">
      <section className="bg-zinc-950 text-white py-24 mb-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
           <img src="https://images.unsplash.com/photo-1523805081730-614449339e7a?q=80&w=1600" className="w-full h-full object-cover" />
        </div>
        <div className="mx-auto max-w-7xl px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-7xl font-bold font-playfair mb-6"
          >
            Authentic Experiences
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg"
          >
            Sierra Leone is not just a place to see, but a place to feel. Dive into activities that connect you with the land and its people.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="space-y-24">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
            >
              <div className="flex-1 w-full">
                <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-[40px] shadow-2xl">
                  <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                  <div className={`absolute top-8 ${idx % 2 === 0 ? 'right-8' : 'left-8'} p-4 rounded-3xl ${exp.color} text-white shadow-lg`}>
                     <exp.icon className="h-8 w-8" />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold font-playfair">{exp.title}</h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                   <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
                     How to experience it
                   </Button>
                   <Button size="lg" variant="outline" className="rounded-full px-8">
                     View gallery
                   </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="mt-32 py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
         <div className="mx-auto max-w-4xl px-4 text-center">
            <span className="text-emerald-500 font-bold uppercase tracking-widest text-sm mb-6 block">Traveler Stories</span>
            <h2 className="text-2xl md:text-4xl font-playfair italic leading-relaxed mb-10">
              "The warmth of the people in Bureh Beach and the pure joy of catching my first wave there is something I'll carry with me forever. Sierra Leone is truly a soul-stirring destination."
            </h2>
            <div className="flex items-center justify-center gap-4">
               <div className="h-12 w-12 rounded-full bg-zinc-300" />
               <div className="text-left">
                  <p className="font-bold">Sarah Jenkins</p>
                  <p className="text-sm text-zinc-500">Solo Traveler, UK</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
