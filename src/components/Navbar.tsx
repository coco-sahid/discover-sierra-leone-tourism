"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, User as UserIcon, LogOut, Heart, LayoutDashboard, MapPin, Compass, Calendar, Send, ChevronDown, Sparkles, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Destinations", href: "/destinations", icon: MapPin },
  { name: "Explore Map", href: "/explore", icon: Globe },
  { name: "Experiences", href: "/experiences", icon: Compass },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Plan Your Trip", href: "/plan", icon: Send },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Signed out successfully");
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? "bg-white/70 backdrop-blur-xl dark:bg-zinc-950/70 shadow-lg border-b border-zinc-200/50 dark:border-zinc-800/50" 
          : "bg-black/10 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <span className={`text-2xl font-bold tracking-tighter transition-colors duration-300 ${scrolled ? "text-black dark:text-white" : "text-white"}`}>
                  Visit <span className="text-emerald-500">Sierra Leone</span>
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-1 mx-4">
              {navLinks.slice(0, 2).map((link) => (
                <Link key={link.name} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`rounded-full px-5 font-semibold transition-all duration-300 ${
                      scrolled 
                        ? "text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30" 
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    } ${pathname === link.href ? (scrolled ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" : "text-white bg-white/20") : ""}`}
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <DropdownMenu>

              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`flex items-center gap-2 rounded-full px-4 transition-all duration-300 ${
                    scrolled 
                      ? "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900" 
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Menu className="h-5 w-5" />
                  <span className="hidden sm:inline font-semibold">Explore</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-zinc-200 dark:border-zinc-800">
                <DropdownMenuLabel className="text-xs font-bold text-zinc-400 px-3 py-2 uppercase tracking-wider">
                  Main Navigation
                </DropdownMenuLabel>
                {navLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild className="rounded-xl cursor-pointer">
                    <Link href={link.href} className="flex items-center gap-3 p-3 w-full">
                      <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        <link.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator className="my-2" />

                {user ? (
                  <>
                    <DropdownMenuLabel className="text-xs font-bold text-zinc-400 px-3 py-2 uppercase tracking-wider">
                      Personal Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-3 p-3 w-full">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <LayoutDashboard className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href="/dashboard?tab=itineraries" className="flex items-center gap-3 p-3 w-full">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                          <Navigation className="h-4 w-4" />
                        </div>
                        <span className="font-medium">My Itineraries</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                      <Link href="/favorites" className="flex items-center gap-3 p-3 w-full">
                        <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                          <Heart className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Favorites</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="rounded-xl cursor-pointer text-rose-600 dark:text-rose-400 focus:text-rose-600 flex items-center gap-3 p-3"
                    >
                      <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild className="rounded-xl cursor-pointer p-1">
                    <Link href="/auth" className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-900/20">
                        <UserIcon className="mr-2 h-4 w-4" /> Sign In
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {!user && (
              <Link href="/auth" className="hidden sm:block">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 shadow-lg shadow-emerald-900/20 border-none">
                  Get Started
                </Button>
              </Link>
            )}
            
            {user && (
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-xs font-bold ${scrolled ? "text-emerald-700" : "text-emerald-400"}`}>
                  My Profile
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
