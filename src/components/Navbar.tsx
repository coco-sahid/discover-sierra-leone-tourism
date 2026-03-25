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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else toast.success("Signed out successfully");
    setMobileMenuOpen(false);
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
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

              {/* Desktop nav links */}
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

              <div className="flex items-center gap-3">
                {/* Desktop Explore dropdown */}
                <div className="hidden lg:block">
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
                        <span className="font-semibold">Explore</span>
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
                </div>

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

              {/* Mobile hamburger button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl transition-colors ${
                  scrolled
                    ? "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-zinc-950 z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-lg font-bold tracking-tighter">
                  Visit <span className="text-emerald-500">Sierra Leone</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Navigation</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      pathname === link.href
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${
                      pathname === link.href
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    }`}>
                      <link.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">{link.name}</span>
                  </Link>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                {user ? (
                  <>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Account</p>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                        <LayoutDashboard className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Dashboard</span>
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
                    >
                      <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600">
                        <Heart className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Favorites</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all w-full text-left"
                    >
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-rose-600">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="pt-2">
                    <Link href="/auth" className="block">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 text-lg font-semibold shadow-lg shadow-emerald-900/20">
                        <UserIcon className="mr-2 h-5 w-5" /> Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
