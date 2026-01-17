"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  MapPin, 
  MessageSquare, 
  TrendingUp, 
  Users 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    destinations: 0,
    inquiries: 0,
    pendingInquiries: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const { data: destinations } = await supabase.from("destinations").select("id");
        const { data: inquiries } = await supabase.from("inquiries").select("id, status");
        const { data: profiles } = await supabase.from("profiles").select("id");

        setStats({
          destinations: destinations?.length || 0,
          inquiries: inquiries?.length || 0,
          pendingInquiries: inquiries?.filter(i => i.status === "pending").length || 0,
          totalUsers: profiles?.length || 0,
        });
      } catch (err) {
        console.error("Error in fetchStats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    { 
      label: "Total Destinations", 
      value: stats.destinations, 
      icon: MapPin, 
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/20"
    },
    { 
      label: "Total Inquiries", 
      value: stats.inquiries, 
      icon: MessageSquare, 
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20"
    },
    { 
      label: "Pending Inquiries", 
      value: stats.pendingInquiries, 
      icon: TrendingUp, 
      color: "text-amber-600",
      bg: "bg-amber-100 dark:bg-amber-900/20"
    },
    { 
      label: "Total Users", 
      value: stats.totalUsers, 
      icon: Users, 
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-playfair">Dashboard Overview</h1>
        <p className="text-zinc-500 mt-2">Welcome back to the Sierra Leone Tourism Admin Panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-zinc-500 font-medium leading-tight mb-1">{card.label}</p>
                <p className="text-2xl font-bold leading-tight">{loading ? "..." : card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-xl font-bold mb-6 font-playfair">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm font-medium">
              Add Destination
            </button>
            <button className="p-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-600 transition-all text-sm font-medium">
              View Inquiries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
