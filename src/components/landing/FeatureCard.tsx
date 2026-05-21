"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  glowColor: string;
  index: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  glowColor,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div
        className={cn(
          "relative h-full rounded-2xl glass p-6 sm:p-8",
          "transition-all duration-500",
          "hover:border-white/15 hover:shadow-xl"
        )}
        style={{
          // @ts-ignore
          "--glow-color": glowColor,
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
          style={{ background: glowColor, opacity: 0 }}
        />
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10">
          <div
            className="absolute inset-0 rounded-2xl blur-2xl opacity-20"
            style={{ background: glowColor }}
          />
        </div>

        {/* Icon */}
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-xl p-3 mb-5",
            "transition-transform duration-300 group-hover:scale-110"
          )}
          style={{ background: gradient }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Bottom border gradient on hover */}
        <div
          className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}
