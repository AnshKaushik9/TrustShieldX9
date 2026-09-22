"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, Settings2, RotateCcw } from "lucide-react";

interface AnalysisSettingsProps {
  onAnalyze: (config: { mode: string; threshold: number }) => void;
  onReset: () => void;
}

export function AnalysisSettings({ onAnalyze, onReset }: AnalysisSettingsProps) {
  const [mode, setMode] = useState("Deep");
  const [threshold, setThreshold] = useState(85);

  return (
    <div className="bg-surface/30 border border-border rounded-xl p-6">
      <div className="flex items-center mb-6">
        <Settings2 className="w-5 h-5 text-indigo-400 mr-2" />
        <h3 className="text-lg font-semibold text-text-primary">Analysis Configuration</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Mode Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-muted">Analysis Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {["Quick", "Deep", "Maximum Accuracy"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-2 px-3 text-xs font-semibold rounded-md border transition-all ${
                  mode === m 
                    ? "bg-indigo-600/20 border-indigo-500 text-indigo-300" 
                    : "bg-base border-border-muted text-text-muted hover:border-slate-500 hover:text-text-primary"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Threshold Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-text-muted">Confidence Threshold</label>
            <span className="text-sm font-bold text-indigo-400">{threshold}%</span>
          </div>
          <input 
            type="range" 
            min="50" 
            max="99" 
            value={threshold} 
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-xs text-text-muted">
            Higher thresholds reduce false positives but may miss subtle manipulations.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
        <Button variant="outline" onClick={onReset} className="text-text-muted hover:text-text-primary">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button 
          onClick={() => onAnalyze({ mode, threshold })} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          Start Analysis
        </Button>
      </div>
    </div>
  );
}
