"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const stories = [
  {
    title: "A Day in Sherbro Island: Where Time Stands Still",
    excerpt: "Discover the hidden history and untouched beauty of one of Sierra Leone's most remote and enchanting islands.",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=800",
    author: "Aminata Kamara",
    date: "May 12, 2024",
    category: "Destinations",
  },
  {
    title: "From Lungi to Freetown: My First Water Taxi Experience",
    excerpt: "The wind in your hair and the Freetown skyline in the distance—why the water taxi is more than just transport.",
    image: "https://images.unsplash.com/photo-1544469537-c790382046bc?q=80&w=800",
    author: "James Wilson",
    date: "April 28, 2024",
    category: "Travel Tips",
  },
  {
    title: "The Flavors of Freetown: A Street Food Guide",
    excerpt: "From spicy ginger beer to the best fry-fry in the city, here is what you must eat when visiting our capital.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800",
    author: "Chef Bintu",
    date: "April 15, 2024",
    category: "Gastronomy",
  },
];

export default function StoriesPage() {
  return (
    <div className="pt-24 pb-24">
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
           <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">Travel Stories & Media</h1>
              <p className="text-zinc-500 text-lg">
                Dive deeper into the heart of Sierra Leone through the eyes of locals and travelers alike. Discover stories of conservation, culture, and adventure.
              </p>
           </div>
           <div className="flex gap-2">
              {["All", "Destinations", "Travel Tips", "Gastronomy", "Culture"].map((cat) => (
                <button key={cat} className="px-4 py-2 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors">
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Featured Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-[500px] md:h-[600px] overflow-hidden rounded-[40px] mb-24 group cursor-pointer"
        >
          <img src={stories[0].image} alt={stories[0].title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-12 left-8 md:left-16 right-8 md:right-16 text-white max-w-3xl">
             <div className="flex items-center gap-4 mb-6">
                <span className="bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">Featured Story</span>
                <span className="text-zinc-300 text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> {stories[0].date}</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-6 group-hover:underline">{stories[0].title}</h2>
             <p className="text-zinc-300 text-lg mb-8 line-clamp-2">{stories[0].excerpt}</p>
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500" />
                <span className="font-bold">By {stories[0].author}</span>
             </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {stories.slice(1).map((story, idx) => (
             <motion.article
               key={story.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className="group"
             >
               <div className="relative h-80 overflow-hidden rounded-3xl mb-8">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur-md text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2">
                        <Tag className="h-3 w-3 text-emerald-600" /> {story.category}
                     </span>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                     <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {story.date}</span>
                     <span className="flex items-center gap-1"><User className="h-3 w-3" /> {story.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold font-playfair group-hover:text-emerald-600 transition-colors">{story.title}</h3>
                  <p className="text-zinc-500 leading-relaxed line-clamp-3">{story.excerpt}</p>
                  <Button variant="ghost" className="p-0 text-emerald-600 font-bold hover:bg-transparent hover:text-emerald-700 flex items-center gap-2">
                     Read full story <ArrowRight className="h-4 w-4" />
                  </Button>
               </div>
             </motion.article>
           ))}
        </div>

        {/* Video CTA */}
        <section className="mt-32">
           <div className="relative h-[500px] overflow-hidden rounded-[40px] flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1544469537-c790382046bc?q=80&w=1600" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 text-center text-white px-4">
                 <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-8">Experience Sierra Leone in Motion</h2>
                 <Button size="lg" className="bg-white text-black hover:bg-zinc-200 rounded-full h-16 px-10 gap-3">
                    Watch our latest film <ArrowRight className="h-5 w-5" />
                 </Button>
              </div>
           </div>
        </section>
      </section>
    </div>
  );
}
