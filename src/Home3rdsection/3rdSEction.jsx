"use client";

import { motion } from "framer-motion";
import { CalendarDays, Heart, PartyPopper, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Dream It",
    description:
      "Imagine your perfect wedding and discover endless inspiration.",
    icon: Heart,
  },
  {
    number: "02",
    title: "Plan It",
    description: "Find your favorite venues and connect with trusted vendors.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Create It",
    description: "Bring every little detail together with your dream team.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Celebrate It",
    description: "Enjoy every moment of your beautiful beginning.",
    icon: PartyPopper,
  },
];

export default function WeddingJourney() {
  return (
    <section className="bg-[#F7F5EF] px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[4px] text-[#B18B55]">
            YOUR JOURNEY STARTS HERE
          </p>
          <h2 className="mt-5 font-serif text-4xl text-[#244F42] md:text-6xl">
            From Yes to <span className="italic">I Do.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500">
            Four beautiful steps to make your dream wedding a reality.
          </p>
        </motion.div>

        <div className="relative grid gap-12 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-10 hidden h-px bg-[#C6A56B]/50 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.18 }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.12 }}
                  className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C6A56B] bg-[#F7F5EF] text-[#244F42]"
                >
                  <Icon size={28} strokeWidth={1.4} />
                </motion.div>

                <p className="mt-7 text-xs font-bold tracking-widest text-[#B18B55]">
                  STEP {step.number}
                </p>

                <h3 className="mt-3 font-serif text-3xl text-[#244F42]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-4 max-w-[230px] text-sm leading-7 text-gray-500">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
