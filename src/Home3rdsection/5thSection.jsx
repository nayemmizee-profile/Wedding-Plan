"use client";

import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import Image from "next/image";

export default function LoveStories() {
  return (
    <section className="bg-[#EDEFE7] px-6 py-24 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Image
            src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1000"
            alt="Wedding couple"
            height={100}
            width={100}
            className="h-[480px] w-full rounded-[180px_180px_20px_20px] object-cover"
          />

          <motion.div
            animate={{ rotate: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-6 -right-3 flex h-24 w-24 items-center justify-center rounded-full bg-[#C6A56B] text-[#244F42] shadow-xl sm:-right-6"
          >
            <Heart size={34} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:pl-8"
        >
          <p className="text-xs font-bold tracking-[4px] text-[#B18B55]">
            REAL STORIES, REAL LOVE
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight text-[#244F42] md:text-6xl">
            Love That
            <span className="block italic">Inspires Us.</span>
          </h2>

          <div className="mt-9 flex gap-1 text-[#C6A56B]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={18} fill="currentColor" />
            ))}
          </div>

          <p className="mt-6 font-serif text-2xl italic leading-relaxed text-[#244F42] md:text-3xl">
            "Everything felt effortless. We found the perfect people who
            understood our dream and made our special day truly magical."
          </p>

          <div className="mt-9 border-t border-[#244F42]/15 pt-6">
            <h3 className="font-serif text-2xl text-[#244F42]">
              Sarah & James
            </h3>
            <p className="mt-2 text-xs font-semibold tracking-widest text-gray-500">
              HAPPY COUPLE · DHAKA
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
