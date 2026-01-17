"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  MessageSquare, 
  Mail, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch inquiries");
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("inquiries")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Inquiry marked as ${status}`);
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status } : inq));
    }
  }

  const filteredInquiries = inquiries.filter(inq => 
    filter === "all" || inq.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "responded": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "cancelled": return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-playfair">Travel Inquiries</h1>
        <p className="text-zinc-500 mt-2">Manage incoming trip requests from travelers.</p>
      </div>

      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl w-fit">
        {["all", "pending", "responded", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f 
                ? "bg-white dark:bg-zinc-800 shadow-sm text-emerald-600" 
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading inquiries...</div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">No inquiries found.</div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredInquiries.map((inq) => (
              <motion.div
                key={inq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{inq.full_name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {inq.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(new Date(inq.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusColor(inq.status)}`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-zinc-100 dark:border-zinc-800">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400 uppercase font-bold tracking-tighter">Travel Dates</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          {inq.start_date ? format(new Date(inq.start_date), "MMM d") : "N/A"} - {inq.end_date ? format(new Date(inq.end_date), "MMM d") : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-400 uppercase font-bold tracking-tighter">Travelers</p>
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          {inq.travelers_count} People
                        </p>
                      </div>
                      <div className="lg:col-span-2 space-y-1">
                        <p className="text-xs text-zinc-400 uppercase font-bold tracking-tighter">Interests</p>
                        <div className="flex flex-wrap gap-1">
                          {inq.interests?.map((interest: string) => (
                            <span key={interest} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        Message
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                        "{inq.message}"
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col justify-end gap-2 lg:border-l border-zinc-100 dark:border-zinc-800 lg:pl-6">
                    <Button 
                      onClick={() => updateStatus(inq.id, "responded")}
                      disabled={inq.status === "responded"}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex-1 lg:flex-none"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Responded
                    </Button>
                    <Button 
                      onClick={() => updateStatus(inq.id, "completed")}
                      disabled={inq.status === "completed"}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex-1 lg:flex-none"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </Button>
                    <Button 
                      onClick={() => updateStatus(inq.id, "cancelled")}
                      variant="outline"
                      className="rounded-xl flex-1 lg:flex-none border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
