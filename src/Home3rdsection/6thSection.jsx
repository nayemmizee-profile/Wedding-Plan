"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const ideas = [
  {
    category: "PLANNING GUIDE",
    title: "10 Things to Do Before Your Wedding Day",
    image: "photo-1519225421980-715cb0215aed",
  },
  {
    category: "DECORATION",
    title: "Elegant Wedding Decoration Ideas for 2026",
    image: "photo-1519741497674-611481863552",
  },
  {
    category: "BRIDAL INSPIRATION",
    title: "Creating Your Perfect Wedding Look",
    image: "photo-1599643478518-a784e5dc4c8f",
  },
];

export default function WeddingInspiration() {
  return (
    <section className="bg-[#FAF7F0] px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[4px] text-[#B18B55]">
              THE WEDDING JOURNAL
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#244F42] md:text-6xl">
              A Little <span className="italic">Inspiration.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm font-bold text-[#244F42]"
          >
            Explore All Articles <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {ideas.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={`https://images.unsplash.com/${item.image}?w=900`}
                  alt={item.title}
                  className="h-72 w-full object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <p className="mt-6 text-xs font-bold tracking-[2px] text-[#B18B55]">
                {item.category}
              </p>

              <h3 className="mt-3 font-serif text-2xl leading-snug text-[#244F42]">
                {item.title}
              </h3>

              <Link
                href="/blog"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#244F42] transition-all group-hover:gap-4"
              >
                Read More <ArrowUpRight size={17} />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
