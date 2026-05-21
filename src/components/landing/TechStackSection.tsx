"use client";

import { motion } from "framer-motion";

const techStack = [
  { category: "Frontend", items: [
    { name: "Next.js", color: "#fff" },
    { name: "React", color: "#61DAFB" },
    { name: "Tailwind CSS", color: "#06B6D4" },
    { name: "shadcn/ui", color: "#fff" },
    { name: "Framer Motion", color: "#FF0080" },
    { name: "React Flow", color: "#FF0072" },
  ]},
  { category: "Backend & AI", items: [
    { name: "Node.js", color: "#68A063" },
    { name: "Gemini API", color: "#8B5CF6" },
    { name: "GitHub API", color: "#fff" },
  ]},
  { category: "Infrastructure", items: [
    { name: "TypeScript", color: "#3178C6" },
    { name: "Vercel", color: "#fff" },
    { name: "Docker", color: "#2496ED" },
  ]},
];

export function TechStackSection() {
  return (
    <section id="tech-stack" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-medium text-purple-400 mb-3 tracking-wide uppercase">Tech Stack</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Built With <span className="gradient-text">Modern Tech</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techStack.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    {item.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
