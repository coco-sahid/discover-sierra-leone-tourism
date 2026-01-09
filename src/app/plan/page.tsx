"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Plane, CreditCard, HeartPulse, Bus, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const practicalInfo = [
  {
    id: "visa",
    title: "Visa & Entry Requirements",
    icon: ShieldCheck,
    content: "Most international visitors require a visa to enter Sierra Leone. E-visas are available for many nationalities. Ensure your passport is valid for at least six months beyond your stay.",
  },
  {
    id: "health",
    title: "Health & Vaccinations",
    icon: HeartPulse,
    content: "A yellow fever vaccination certificate is mandatory for entry. Malaria prophylaxis is strongly recommended. Consult your doctor for up-to-date health advice before traveling.",
  },
  {
    id: "arrival",
    title: "Arriving at Lungi Airport",
    icon: Plane,
    content: "Lungi International Airport is located across the bay from Freetown. You can reach the city via water taxi (approx. 30 mins) or by road (approx. 2.5-4 hours).",
  },
  {
    id: "currency",
    title: "Currency & Payments",
    icon: CreditCard,
    content: "The local currency is the Sierra Leonean Leone (SLL). While some hotels and upscale restaurants accept cards, cash is essential for most daily transactions and local markets.",
  },
  {
    id: "transport",
    title: "Getting Around",
    icon: Bus,
    content: "Local transportation includes poda-podas (minibuses), okadas (motorcycle taxis), and kekes (tricycles). For longer trips, private car hires with drivers are recommended.",
  },
];

export default function PlanPage() {
  return (
    <div className="pt-24 pb-24">
      <section className="bg-emerald-50 dark:bg-emerald-950/20 py-24 mb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold font-playfair mb-6">Plan Your Perfect Journey</h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
                Everything you need to know before you touch down in the Land of Iron and Diamonds. We've compiled the most essential practical information to ensure your trip is smooth and enjoyable.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
               <img src="https://images.unsplash.com/photo-1454165833467-1359a33a7f74?q=80&w=800" alt="Planning" className="rounded-[40px] shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4">
        <div className="mb-16">
           <h2 className="text-3xl font-bold font-playfair mb-8 flex items-center gap-3">
              <Info className="h-8 w-8 text-emerald-500" /> Essential Information
           </h2>
           <Accordion type="single" collapsible className="w-full space-y-4">
             {practicalInfo.map((item) => (
               <AccordionItem key={item.id} value={item.id} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 bg-white dark:bg-zinc-900 overflow-hidden">
                 <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex items-center gap-4 text-left">
                       <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                          <item.icon className="h-6 w-6" />
                       </div>
                       <span className="text-xl font-bold">{item.title}</span>
                    </div>
                 </AccordionTrigger>
                 <AccordionContent className="pb-6 text-zinc-500 leading-relaxed">
                   {item.content}
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
        </div>

        {/* Suggested Itineraries */}
        <div className="mt-24">
           <h2 className="text-3xl font-bold font-playfair mb-8">Suggested Itineraries</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[32px] bg-zinc-900 text-white space-y-6">
                 <span className="bg-emerald-500 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">5 Days</span>
                 <h3 className="text-2xl font-bold font-playfair italic">"The Coastal Escape"</h3>
                 <p className="text-zinc-400 text-sm">Freetown &gt; Tacugama &gt; River No. 2 Beach &gt; Tokeh &gt; Bureh Beach</p>
                 <button className="text-emerald-400 font-bold hover:underline">View details</button>
              </div>
              <div className="p-8 rounded-[32px] bg-emerald-900 text-white space-y-6">
                 <span className="bg-zinc-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">10 Days</span>
                 <h3 className="text-2xl font-bold font-playfair italic">"Wildlife & Heritage"</h3>
                 <p className="text-emerald-100/60 text-sm">Freetown &gt; Bunce Island &gt; Tiwai Island &gt; Gola Rainforest &gt; Turtle Islands</p>
                 <button className="text-emerald-300 font-bold hover:underline">View details</button>
              </div>
           </div>
        </div>
      </section>

      {/* Safety Banner */}
      <section className="mt-24 mx-auto max-w-7xl px-4">
         <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-8 md:p-12 rounded-[40px] flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            <div className="p-6 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600">
               <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
               <h3 className="text-2xl font-bold mb-2">Travel with Confidence</h3>
               <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
                 Sierra Leone is peaceful and welcoming. For the latest travel advisories and official updates, we recommend checking your local government's travel portal before departure.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
}
