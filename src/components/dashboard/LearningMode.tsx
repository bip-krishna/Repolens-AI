"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, CheckCircle2, Circle, ChevronRight, FileText, Lightbulb } from "lucide-react";

interface LearningStep {
  order: number;
  title: string;
  description: string;
  keyFiles?: string[];
  concepts?: string[];
  tips?: string[];
}

export function LearningMode({ steps }: { steps: LearningStep[] }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  if (!steps || steps.length === 0) {
    return <div className="text-center py-12 text-white/40">No learning content available</div>;
  }

  const toggleComplete = (index: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const currentStep = steps[activeStep];

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="font-semibold mb-6 text-white flex items-center gap-2">
        <Compass className="h-4 w-4 text-cyan-400" />
        Learning Mode
        <span className="text-xs text-white/40 ml-auto">{completed.size}/{steps.length} completed</span>
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Step list */}
        <div className="lg:w-64 shrink-0 space-y-1">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                i === activeStep ? "bg-white/10 text-white" : "text-white/50 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {completed.has(i) ? (
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-white/20 shrink-0" />
              )}
              <span className="truncate">{step.title}</span>
              {i === activeStep && <ChevronRight className="h-3 w-3 ml-auto shrink-0" />}
            </button>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 liquid-glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-white">
                Step {currentStep.order || activeStep + 1}: {currentStep.title}
              </h4>
              <button
                onClick={() => toggleComplete(activeStep)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  completed.has(activeStep)
                    ? "bg-green-500/20 text-green-400"
                    : "bg-white/5 text-white/40 hover:bg-white/10"
                }`}
              >
                {completed.has(activeStep) ? "✓ Complete" : "Mark Complete"}
              </button>
            </div>

            <p className="text-sm text-white/60 leading-relaxed mb-4">{currentStep.description}</p>

            {currentStep.keyFiles && currentStep.keyFiles.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Key Files</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {currentStep.keyFiles.map((f, j) => (
                    <span key={j} className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentStep.concepts && currentStep.concepts.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Key Concepts</span>
                </div>
                <div className="space-y-1">
                  {currentStep.concepts.map((c, j) => (
                    <div key={j} className="text-sm text-white/50 flex items-center gap-2">
                      <span className="text-yellow-400/60">▸</span> {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep.tips && currentStep.tips.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                <div className="text-xs font-medium text-cyan-400 mb-1">💡 Tips</div>
                {currentStep.tips.map((t, j) => (
                  <div key={j} className="text-xs text-white/40 mt-1">• {t}</div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="text-xs text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  toggleComplete(activeStep);
                  setActiveStep(Math.min(steps.length - 1, activeStep + 1));
                }}
                disabled={activeStep === steps.length - 1}
                className="text-xs text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Next →
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
