"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

interface Location {
  id: string;
  name: string;
  region: string;
  slug: string;
}

interface LocationAutocompleteProps {
  onSelect: (location: Location) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocomplete({ onSelect, placeholder, className }: LocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Location[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("destinations")
        .select("id, name, region, slug")
        .ilike("name", `%${query}%`)
        .limit(5);

      if (data) {
        setResults(data);
        setIsOpen(data.length > 0);
      }
      setLoading(false);
    };

    const debounce = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (location: Location) => {
    setQuery(location.name);
    setIsOpen(false);
    onSelect(location);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Search Sierra Leonean locations..."}
          className="pl-12 pr-10 rounded-xl h-12 border-zinc-200 dark:border-zinc-800 focus:ring-emerald-500/20"
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-zinc-400" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <ul className="py-2">
              {results.map((location) => (
                <li key={location.id}>
                  <button
                    onClick={() => handleSelect(location)}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left"
                  >
                    <div className="mt-1 p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{location.name}</div>
                      <div className="text-sm text-zinc-500">{location.region}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
