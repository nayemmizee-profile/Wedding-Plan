"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Heart,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200";

export default function AllServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [favorites, setFavorites] = useState([]);

  // Fetch all approved services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      // No limit parameter: fetch ALL approved services
      const response = await fetch(`/api/services/all-approved?sort=${sort}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load services");
      }

      setServices(data.services || []);
    } catch (err) {
      console.error("Services Fetch Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [sort]);

  // Dynamic categories
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(services.map((service) => service.category).filter(Boolean)),
    ];

    return ["All", ...uniqueCategories];
  }, [services]);

  // Search and category filtering
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const serviceName =
        service.serviceName || service.name || service.title || "";

      const searchText = [
        serviceName,
        service.category,
        service.location,
        service.vendorName,
        service.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase().trim());

      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  // Favorite toggle
  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf8] text-[#30252b]">
      {/* ================= HERO SECTION ================= */}

      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#fce4ec] via-[#fff0e8] to-[#eee7ff]">
        {/* Background decoration */}

        <div className="absolute -right-32 -top-32 -z-10 h-[450px] w-[450px] rounded-full bg-pink-300/30 blur-[100px]" />

        <div className="absolute -bottom-40 -left-32 -z-10 h-[450px] w-[450px] rounded-full bg-purple-300/30 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:py-28">
          {/* Hero Text */}

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-5 py-2.5 text-sm font-semibold text-rose-600 shadow-sm backdrop-blur">
              <Sparkles size={17} />
              Discover Something Beautiful
            </div>

            <h1 className="text-5xl font-bold leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
              Find Your
              <span className="mt-2 block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Perfect Services.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-8 text-gray-600 md:text-lg">
              Every beautiful celebration starts with the right people. Explore
              our collection of professional wedding services and create
              memories that last forever.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#services"
                className="inline-flex items-center gap-3 rounded-full bg-[#30252b] px-8 py-4 font-semibold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-rose-600"
              >
                Explore Services
                <ArrowUpRight size={19} />
              </a>

              <div className="rounded-full border border-white/80 bg-white/60 px-6 py-4 backdrop-blur">
                <span className="text-2xl font-bold text-rose-600">
                  {services.length}+
                </span>

                <span className="ml-2 text-sm text-gray-600">Services</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Images */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto h-[390px] w-full max-w-[540px] md:h-[470px]"
          >
            <div className="absolute right-0 top-0 h-[78%] w-[75%] overflow-hidden rounded-[45%_45%_20px_20px] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1000"
                alt="Beautiful wedding ceremony"
                fill
                unoptimized
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="absolute bottom-0 left-0 h-[52%] w-[48%] overflow-hidden rounded-[25px] border-[8px] border-[#fff0e8] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=700"
                alt="Wedding table decoration"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>

            <div className="absolute bottom-12 right-0 rounded-2xl border border-white/50 bg-white/85 p-4 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <Heart size={22} />
                </div>

                <div>
                  <p className="font-bold text-gray-800">Your Day, Your Way</p>
                  <p className="text-xs text-gray-500">
                    Made for beautiful moments
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}

      <section id="services" className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        {/* Section Heading */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-rose-500">
              Our Collection
            </p>

            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Explore All
              <span className="ml-2 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                Services
              </span>
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-gray-500">
              From dreamy decorations to unforgettable photography, discover
              everything you need for your special celebration.
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
            <BriefcaseBusiness size={19} className="text-rose-500" />
            {filteredServices.length} Services Found
          </div>
        </motion.div>

        {/* ================= FILTER BAR ================= */}

        <div className="mb-12 rounded-[25px] border border-rose-100 bg-white p-4 shadow-[0_10px_40px_rgba(80,40,60,0.04)]">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
            {/* Search */}

            <div className="relative">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services, locations, categories..."
                className="w-full rounded-2xl bg-[#fff8f7] py-4 pl-14 pr-5 text-sm outline-none transition focus:ring-2 focus:ring-rose-200"
              />
            </div>

            {/* Category */}

            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-w-[170px] appearance-none rounded-2xl bg-[#fff8f7] py-4 pl-11 pr-5 text-sm outline-none focus:ring-2 focus:ring-rose-200"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-2xl bg-[#fff8f7] px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-rose-200"
            >
              <option value="newest">Newest First</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Category Quick Filters */}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-rose-50 pt-5">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold transition duration-300 ${
                  category === item
                    ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg shadow-rose-200"
                    : "bg-[#fff5f5] text-gray-600 hover:bg-rose-100 hover:text-rose-600"
                }`}
              >
                {item}
              </button>
            ))}

            {(search || category !== "All") && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-700"
              >
                <X size={15} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="flex min-h-[350px] flex-col items-center justify-center">
            <Loader2 size={45} className="animate-spin text-rose-500" />

            <p className="mt-5 font-medium text-gray-500">
              Discovering beautiful services...
            </p>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="rounded-[30px] bg-gradient-to-br from-rose-50 to-purple-50 px-5 py-20 text-center">
            <h3 className="text-2xl font-bold text-gray-800">
              Unable to Load Services
            </h3>

            <p className="mt-3 text-gray-500">{error}</p>

            <button
              onClick={fetchServices}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 px-8 py-3.5 font-semibold text-white shadow-lg transition hover:scale-105"
            >
              <RefreshCw size={17} />
              Try Again
            </button>
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="rounded-[30px] bg-gradient-to-br from-rose-50 to-purple-50 px-5 py-24 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg">
              <Search size={32} />
            </div>

            <h3 className="mt-6 text-2xl font-bold">No Services Found</h3>

            <p className="mt-3 text-gray-500">
              We couldn't find any matching services. Try a different search or
              category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-7 rounded-full bg-rose-500 px-8 py-3 font-semibold text-white transition hover:bg-purple-600"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ================= SERVICE CARDS ================= */}

        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            {filteredServices.map((service, index) => {
              const id = service._id;

              const serviceName =
                service.serviceName ||
                service.name ||
                service.title ||
                "Wedding Service";

              const serviceImage =
                service.images?.[0] || service.image || FALLBACK_IMAGE;

              const isFeatured = index % 5 === 0;

              const isFavorite = favorites.includes(id);

              return (
                <motion.article
                  key={id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 2) * 0.08,
                  }}
                  className={`group relative overflow-hidden rounded-[30px] border border-rose-100/70 bg-white shadow-[0_10px_40px_rgba(80,40,60,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(190,80,120,0.13)] ${
                    isFeatured ? "md:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`grid h-full ${
                      isFeatured ? "md:grid-cols-[1.15fr_1fr]" : "grid-cols-1"
                    }`}
                  >
                    {/* Image Section */}

                    <div
                      className={`relative overflow-hidden ${
                        isFeatured ? "h-[290px] md:h-[400px]" : "h-[260px]"
                      }`}
                    >
                      <Image
                        src={serviceImage}
                        alt={serviceName}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                      {/* Category Badge */}

                      <div className="absolute left-6 top-6 rounded-full border border-white/40 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-600 shadow-lg backdrop-blur">
                        {service.category || "Wedding Service"}
                      </div>

                      {/* Favorite */}

                      <button
                        type="button"
                        onClick={() => toggleFavorite(id)}
                        aria-label="Toggle favorite"
                        className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-lg backdrop-blur transition hover:scale-110"
                      >
                        <Heart
                          size={20}
                          fill={isFavorite ? "currentColor" : "none"}
                        />
                      </button>

                      {/* Vendor Name */}

                      <div className="absolute bottom-6 left-6 text-white">
                        <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                          Provided By
                        </p>

                        <p className="mt-1 text-lg font-bold">
                          {service.vendorName || "Our Professional Partner"}
                        </p>
                      </div>
                    </div>

                    {/* Content Section */}

                    <div
                      className={`flex flex-col justify-between ${
                        isFeatured ? "p-7 md:p-10" : "p-7"
                      }`}
                    >
                      <div>
                        {/* Location */}

                        <div className="mb-5 flex items-center gap-2 text-sm text-gray-400">
                          <MapPin size={17} className="text-rose-500" />

                          {service.location || "Location not specified"}
                        </div>

                        {/* Title */}

                        <h3
                          className={`font-bold leading-tight tracking-tight transition-colors group-hover:text-rose-600 ${
                            isFeatured ? "text-3xl md:text-4xl" : "text-2xl"
                          }`}
                        >
                          {serviceName}
                        </h3>

                        {/* Description */}

                        <p className="mt-5 line-clamp-3 text-sm leading-7 text-gray-500">
                          {service.description ||
                            "Explore this professional wedding service and make your special day truly memorable."}
                        </p>
                      </div>

                      {/* Footer */}

                      <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-rose-100 pt-6">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                            Starting From
                          </p>

                          <p className="mt-2 text-2xl font-bold text-rose-600">
                            ${Number(service.price || 0)}
                          </p>
                        </div>

                        <Link
                          href={`/book-service/${id}`}
                          className="group/btn inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-200 transition duration-300 hover:scale-105 hover:shadow-xl"
                        >
                          View Details
                          <ArrowUpRight
                            size={19}
                            className="transition duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Gradient Animation */}

                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 transition-all duration-700 group-hover:w-full" />
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= BOTTOM CTA ================= */}

      <section className="px-5 pb-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[35px] bg-gradient-to-r from-[#e87991] via-[#d78bb8] to-[#9483d8] px-6 py-16 text-center text-white md:py-24">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/20" />

          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full border border-white/20" />

          <div className="relative">
            <Sparkles size={38} className="mx-auto mb-6" />

            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              Make Your Dream Wedding Real
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/90 md:text-base">
              The perfect celebration deserves the perfect professionals.
              Discover amazing services and bring your dream wedding to life.
            </p>

            <a
              href="#services"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 font-bold text-rose-600 shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#30252b] hover:text-white"
            >
              Explore Services
              <ArrowUpRight size={20} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
