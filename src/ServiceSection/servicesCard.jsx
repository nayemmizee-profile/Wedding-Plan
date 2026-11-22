"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Heart,
  Loader2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ServiceSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services/approved");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load services");
        }

        setServices(data.services || []);
      } catch (error) {
        console.error("Service Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Dynamic categories from database
  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(services.map((service) => service.category).filter(Boolean)),
    ];
  }, [services]);

  // Search and category filtering
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        activeCategory === "All" || service.category === activeCategory;

      const searchText = [
        service.serviceName,
        service.category,
        service.location,
        service.vendorName,
        service.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, search]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section id="services" className="bg-[#FAFAF8] px-5 py-20 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-[1440px]">
        {/* Section Heading */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[3px] text-[#57947C]">
              <Sparkles size={17} />
              Discover Our Collection
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#202B29] sm:text-5xl">
              Services Made for
              <span className="text-[#57947C]"> Your Moments.</span>
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-gray-500">
              Explore exceptional services from trusted professionals and bring
              your special occasions to life.
            </p>
          </div>

          <div className="rounded-2xl bg-white px-5 py-4 shadow-sm">
            <p className="text-xs text-gray-400">Available Services</p>
            <p className="mt-1 text-2xl font-bold text-[#244F42]">
              {services.length.toString().padStart(2, "0")}
              <span className="ml-2 text-sm font-medium text-gray-400">
                Services
              </span>
            </p>
          </div>
        </motion.div>

        {/* Search */}

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 px-3">
            <Search size={21} className="text-[#57947C]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search service, vendor or location..."
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-[#244F42] text-white shadow-md"
                    : "bg-[#F3F5F2] text-gray-600 hover:bg-[#E5EFE8]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <Loader2 size={38} className="animate-spin text-[#57947C]" />
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <BriefcaseBusiness
              size={45}
              className="mx-auto mb-4 text-gray-300"
            />

            <h3 className="text-xl font-bold text-gray-700">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              Try searching with another keyword.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-5 font-semibold text-[#57947C]"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Service Cards */}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => {
                  const image = service.images?.[0];

                  return (
                    <motion.article
                      key={service._id}
                      layout
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                      }}
                      whileHover={{ y: -8 }}
                      className="group overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
                    >
                      {/* Service Image */}

                      <div className="relative h-[250px] overflow-hidden bg-[#E8EFEA]">
                        {image ? (
                          <Image
                            src={image}
                            alt={service.serviceName}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BriefcaseBusiness
                              size={50}
                              className="text-gray-300"
                            />
                          </div>
                        )}

                        <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#438A72] shadow-sm">
                          {service.category}
                        </div>

                        <button
                          onClick={() => toggleFavorite(service._id)}
                          aria-label="Toggle favorite"
                          className="absolute right-4 top-4 rounded-full bg-white p-2.5 shadow-md transition hover:scale-110"
                        >
                          <Heart
                            size={18}
                            className={
                              favorites.includes(service._id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-500"
                            }
                          />
                        </button>

                        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-[#244F42]/90 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                          <Sparkles size={14} />
                          Approved Service
                        </div>
                      </div>

                      {/* Service Information */}

                      <div className="p-5">
                        <div className="mb-3 flex items-center gap-2 text-sm text-gray-400">
                          <MapPin size={15} />
                          <span className="line-clamp-1">
                            {service.location}
                          </span>
                        </div>

                        <h3 className="line-clamp-1 text-xl font-bold text-[#202B29] transition-colors group-hover:text-[#57947C]">
                          {service.serviceName}
                        </h3>

                        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-gray-500">
                          {service.description}
                        </p>

                        {/* Vendor */}

                        <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF3ED] font-bold text-[#438A72]">
                            {service.vendorName?.charAt(0)?.toUpperCase() ||
                              "V"}
                          </div>

                          <div>
                            <p className="text-[11px] text-gray-400">
                              Provided by
                            </p>

                            <p className="text-sm font-semibold text-gray-700">
                              {service.vendorName || "Professional Vendor"}
                            </p>
                          </div>
                        </div>

                        {/* Price */}

                        <div className="my-5 flex items-end justify-between">
                          <div>
                            <p className="text-xs text-gray-400">
                              Service Price
                            </p>

                            <p className="mt-1 text-2xl font-bold text-[#244F42]">
                              ৳
                              {Number(service.price || 0).toLocaleString(
                                "en-BD",
                              )}
                            </p>
                          </div>

                          <span className="rounded-full bg-[#EAF3ED] px-3 py-1.5 text-xs font-semibold text-[#438A72]">
                            Available
                          </span>
                        </div>

                        {/* Action Buttons */}

                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href={`/services/${service._id}`}
                            className="flex items-center justify-center gap-2 rounded-xl border border-[#244F42] py-3 text-sm font-semibold text-[#244F42] transition hover:bg-[#F0F6F2]"
                          >
                            Details
                            <ArrowUpRight size={16} />
                          </Link>

                          <Link
                            href={`/book-service/${service._id}`}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#244F42] py-3 text-sm font-semibold text-white transition hover:bg-[#57947C]"
                          >
                            Book Now
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
