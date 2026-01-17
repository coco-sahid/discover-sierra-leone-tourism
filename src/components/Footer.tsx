"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  destinations: [
    { name: "River No. 2 Beach", href: "/destinations/river-no-2" },
    { name: "Tokeh Beach", href: "/destinations/tokeh" },
    { name: "Tacugama Sanctuary", href: "/destinations/tacugama" },
    { name: "Bureh Beach", href: "/destinations/bureh" },
  ],
  planning: [
    { name: "Visa Requirements", href: "/plan#visa" },
    { name: "Health & Safety", href: "/plan#health" },
    { name: "Getting Around", href: "/plan#transport" },
    { name: "Suggested Itineraries", href: "/plan#itineraries" },
  ],
  about: [
    { name: "Our Story", href: "/stories" },
    { name: "Cultural Calendar", href: "/calendar" },
    { name: "Contact Us", href: "/contact" },
    { name: "Partner With Us", href: "/contact#partners" },
  ],
};

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold tracking-tighter text-white">
                Visit <span className="text-emerald-500">Sierra Leone</span>
              </span>
            </Link>
            <p className="text-sm leading-6 mb-6">
              Discover the hidden gem of West Africa. From pristine white beaches to lush rainforests and rich cultural heritage, Sierra Leone awaits your soul.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-emerald-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">Destinations</h3>
            <ul className="space-y-4">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-emerald-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">Plan Your Trip</h3>
            <ul className="space-y-4">
              {footerLinks.planning.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-emerald-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm">Freetown, Sierra Leone</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm">+232 (0) XX XXX XXX</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="text-sm">hello@visitsierraleone.gov.sl</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} National Tourist Board of Sierra Leone. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
