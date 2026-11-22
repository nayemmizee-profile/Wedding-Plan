"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const gallery = [
  {
    image: "photo-1519741497674-611481863552",
    title: "Romantic Celebrations",
    className: "md:row-span-2 min-h-[400px]",
  },
  {
    image: "photo-1511285560929-80b456fea0bc",
    title: "Beautiful Moments",
    className: "min-h-[230px]",
  },
  {
    image: "photo-1519225421980-715cb0215aed",
    title: "Dream Decorations",
    className: "min-h-[230px]",
  },
  {
    image: "photo-1537633552985-df8429e8048b",
    title: "Forever Together",
    className: "md:col-span-2 min-h-[270px]",
  },
];

export default function WeddingGallery() {
  return (
    <section className="bg-white px-5 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[4px] text-[#B18B55]">
              A WORLD OF INSPIRATION
            </p>
            <h2 className="mt-4 font-serif text-4xl text-[#244F42] md:text-6xl">
              Moments Worth <span className="italic">Remembering.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-gray-500">
            Every celebration tells a story. Explore beautiful wedding moments
            and find inspiration for your own.
          </p>
        </div>

        <div className="grid auto-rows-fr gap-4 md:grid-cols-3">
          {gallery.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className={`group relative overflow-hidden rounded-2xl ${item.className}`}
            >
              <Image
                src={`https://images.unsplash.com/${item.image}?w=1000`}
                alt={item.title}
                width={100}
                height={100}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-0 flex w-full items-end justify-between p-6 text-white">
                <h3 className="font-serif text-2xl">{item.title}</h3>
                <ArrowUpRight className="transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
