"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Map as MapIcon } from "lucide-react"

const footerLinks = {
  platform: [
    { title: "Search Map", href: "/" },
    { title: "Land Listings", href: "/lands" },
    { title: "Gurgaon Districts", href: "/lands?district=gurgaon" },
    { title: "Featured Lands", href: "/featured" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Press", href: "/press" },
    { title: "Contact", href: "/contact" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Cookie Policy", href: "/cookies" },
  ],
}

export function Footer() {
  return (
    <footer className="w-full bg-muted/30 border-t border-border/50 py-16 md:py-24">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <MapIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <span>Xacres</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Simplifying land discovery across Haryana. Built with precision and a map-first approach.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-foreground uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-foreground uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-foreground uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Xacres. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <span className="text-sm font-medium">Built for</span>
            <span className="text-sm font-bold text-primary">Haryana</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
