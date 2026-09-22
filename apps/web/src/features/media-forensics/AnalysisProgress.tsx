"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, ServerCog, Fingerprint, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

interface AnalysisProgressProps {
  onComplete: () => void;
}

const steps = [
  { id: 1, label: "Upload Complete", icon: CheckCircle2, duration: 800 },
  { id: 2, label: "Preparing Analysis Workflow", icon: ServerCog, duration: 1200 },
  { id: 3, label: "Running Detection Model", icon: Fingerprint, duration: 2500 },
  { id: 4, label: "Generating Forensic Results", icon: FileSearch, duration: 1000 },
];

export function AnalysisProgress({ onComplete }: AnalysisProgressProps) {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    let currentStep = 1;
    let timeoutId: NodeJS.Timeout;

    const runStep = () => {
      if (currentStep > steps.length) {
        onComplete();
        return;
      }

      const stepDuration = steps[currentStep - 1].duration;
      timeoutId = setTimeout(() => {
        currentStep++;
        setActiveStep(currentStep);
        runStep();
      }, stepDuration);
    };

    runStep();

    return () => clearTimeout(timeoutId);
  }, [onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-text-primary mb-2">Analyzing Media</h3>
        <p className="text-text-muted">Our neural engine is processing the file for deepfake artifacts...</p>
      </div>

      <div className="space-y-8">
        {steps.map((step) => {
          const isCompleted = activeStep > step.id;
          const isActive = activeStep === step.id;

          return (
            <div key={step.id} className="relative flex items-center">
              {/* Connecting line */}
              {step.id !== steps.length && (
                <div className={`absolute left-[19px] top-10 w-[2px] h-10 ${isCompleted ? 'bg-indigo-500' : 'bg-muted'}`} />
              )}

              {/* Icon Container */}
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                isCompleted ? 'bg-indigo-500 border-indigo-500' : 
                isActive ? 'bg-base border-indigo-500' : 
                'bg-base border-border'
              }`}>
                {isActive ? (
                  <CircleDashed className="w-5 h-5 text-indigo-400 animate-spin" />
                ) : (
                  <step.icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-slate-600'}`} />
                )}
              </div>

              {/* Label */}
              <div className="ml-6 flex-1">
                <p className={`text-sm font-semibold transition-colors duration-500 ${
                  isCompleted ? 'text-text-primary' : 
                  isActive ? 'text-indigo-400' : 
                  'text-slate-600'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: step.duration / 1000, ease: "linear" }}
                    className="h-1 bg-indigo-500/20 rounded-full mt-2 overflow-hidden"
                  >
                    <div className="h-full bg-indigo-500 rounded-full" />
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
