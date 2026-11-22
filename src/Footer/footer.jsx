"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const footerLinks = {
  Explore: [
    { name: "Home", href: "/" },
    { name: "Our Services", href: "/services" },
    { name: "Find Vendors", href: "/vendors" },
    { name: "Wedding Inspiration", href: "/blog" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Become a Vendor", href: "/vendor/register" },
    { name: "FAQs", href: "/faq" },
  ],
  Support: [
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
    { name: "My Account", href: "/dashboard" },
  ],
};

const socials = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="relative overflow-hidden bg-[#172D24] text-white">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#B18B55]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#57947C]/10 blur-[100px]" />

      {/* Top CTA */}
      <div className="relative border-b border-white/10 px-6 py-16 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left"
        >
          <div>
            <div className="mb-4 flex items-center justify-center gap-2 text-[#D5B77C] md:justify-start">
              <Sparkles size={17} />
              <span className="text-xs font-semibold uppercase tracking-[3px]">
                Your Forever Starts Here
              </span>
            </div>

            <h2 className="font-serif text-3xl leading-tight sm:text-5xl">
              Ready to Create Your
              <span className="block italic text-[#D5B77C]">
                Perfect Wedding?
              </span>
            </h2>
          </div>

          <Link
            href="/register"
            className="group flex shrink-0 items-center gap-3 rounded-full bg-[#D5B77C] px-8 py-4 text-sm font-bold text-[#172D24] transition duration-300 hover:-translate-y-1 hover:bg-white"
          >
            Start Your Journey
            <ArrowUpRight
              size={18}
              className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 sm:grid-cols-2 lg:grid-cols-12 lg:px-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D5B77C]/50">
              <Heart className="h-6 w-6 fill-[#D5B77C] text-[#D5B77C]" />
            </div>

            <span className="font-serif text-3xl font-bold">
              Ever<span className="text-[#D5B77C]">After.</span>
            </span>
          </Link>

          <p className="mt-7 max-w-sm text-sm leading-8 text-white/55">
            Every love story deserves a beautiful beginning. We bring couples
            and trusted wedding professionals together to create celebrations
            worth remembering forever.
          </p>

          {/* Social links */}
          <div className="mt-8 flex gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -5, scale: 1.08 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#D5B77C] hover:bg-[#D5B77C] hover:text-[#172D24]"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="lg:col-span-2">
            <h3 className="font-serif text-xl text-[#D5B77C]">{title}</h3>

            <ul className="mt-7 space-y-5">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-[#D5B77C]"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div className="lg:col-span-2">
          <h3 className="font-serif text-xl text-[#D5B77C]">Get In Touch</h3>

          <div className="mt-7 space-y-6 text-sm text-white/55">
            <div className="flex items-start gap-3">
              <Mail size={18} className="shrink-0 text-[#D5B77C]" />
              <a href="mailto:hello@example.com" className="hover:text-white">
                hello@example.com
              </a>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="shrink-0 text-[#D5B77C]" />
              <a href="tel:+8801000000000" className="hover:text-white">
                +880 1000-000000
              </a>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-[#D5B77C]" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="relative mx-6 rounded-3xl border border-[#D5B77C]/25 bg-white/[0.04] px-6 py-10 lg:mx-auto lg:max-w-7xl lg:px-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[3px] text-[#D5B77C]">
              A Little Wedding Inspiration
            </p>
            <h3 className="mt-3 font-serif text-3xl">
              Love Letters in Your Inbox.
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/50">
              Get wedding inspiration, planning tips and beautiful ideas
              delivered to your inbox.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Connect your newsletter API here.
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#D5B77C]"
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-full bg-[#D5B77C] px-7 py-4 text-sm font-bold text-[#172D24] transition hover:bg-white"
            >
              Subscribe <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-white/10 px-6 py-8 text-center sm:flex-row sm:text-left lg:px-12">
        <p className="text-xs text-white/40">
          © {year || "2026"} EverAfter. All rights reserved.
        </p>

        <p className="flex items-center gap-2 text-xs text-white/50">
          Crafted with
          <Heart size={13} className="fill-[#D5B77C] text-[#D5B77C]" />
          for every love story.
        </p>

        <Link
          href="/"
          className="text-xs text-white/50 transition hover:text-[#D5B77C]"
        >
          Back to Top ↑
        </Link>
      </div>
    </footer>
  );
}
