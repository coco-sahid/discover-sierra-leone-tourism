"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

const events = [
  {
    month: "April",
    day: "27",
    title: "Independence Day",
    location: "National Stadium, Freetown",
    description: "A nationwide celebration of Sierra Leone's independence with parades, music, and cultural displays.",
  },
  {
    month: "December",
    day: "26",
    title: "Boxing Day Beach Parties",
    location: "Freetown Coastal Beaches",
    description: "The biggest beach parties of the year, especially at River No. 2 and Tokeh Beach.",
  },
  {
    month: "March",
    day: "15-20",
    title: "Freetown Music Festival",
    location: "Lumina Park, Freetown",
    description: "A showcase of the best local talent and international acts, celebrating the diverse sounds of West Africa.",
  },
  {
    month: "November",
    day: "Various",
    title: "Traditional Chiefdom Festivals",
    location: "Various Provinces",
    description: "Deeply rooted cultural celebrations featuring traditional masks, dance, and storytelling.",
  },
];

export default function CalendarPage() {
  return (
    <div className="pt-24 pb-24">
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">Cultural Calendar</h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Plan your visit around our vibrant festivals and national holidays to experience the true spirit of Sierra Leone.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {events.map((event, idx) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row gap-8 p-8 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center justify-center bg-emerald-600 text-white rounded-2xl w-full md:w-32 h-32 shrink-0">
                 <span className="text-xs font-bold uppercase tracking-widest">{event.month}</span>
                 <span className="text-4xl font-bold font-playfair">{event.day}</span>
              </div>
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold font-playfair">{event.title}</h2>
                 <p className="text-zinc-500 leading-relaxed">{event.description}</p>
                 <div className="flex flex-wrap gap-6 text-sm font-medium text-zinc-400">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-500" /> {event.location}</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-500" /> All day event</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 bg-zinc-900 rounded-[40px] p-12 text-center text-white">
           <CalendarIcon className="h-12 w-12 text-emerald-500 mx-auto mb-6" />
           <h3 className="text-2xl font-bold mb-4 font-playfair">Want to list an event?</h3>
           <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Are you organizing a cultural event or festival in Sierra Leone? Get in touch with the National Tourist Board to be featured on our official calendar.</p>
           <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 py-4 font-bold transition-colors">Submit Event</button>
        </div>
      </section>
    </div>
  );
}
