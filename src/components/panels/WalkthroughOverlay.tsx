"use client";

import React from "react";
import { Square, ArrowRight } from "lucide-react";
import { flowTypes } from "@/data/flow-types";
import type { FlowType } from "@/types/flow";

interface WalkthroughOverlayProps {
  flowType: FlowType;
  currentStep: number;
  totalSteps: number;
  currentNodeLabel: string;
  onStop: () => void;
}

export function WalkthroughOverlay({
  flowType,
  currentStep,
  totalSteps,
  currentNodeLabel,
  onStop,
}: WalkthroughOverlayProps) {
  const ftConfig = flowTypes.find((f) => f.id === flowType);
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-3 bg-[#0c1225]/90 backdrop-blur-md border border-white/[0.1] rounded-full px-4 py-2 shadow-xl">
        {/* Flow type label */}
        <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">
          {ftConfig?.label ?? flowType}
        </span>

        <div className="w-px h-4 bg-white/[0.1]" />

        {/* Current step */}
        <div className="flex items-center gap-1.5">
          <ArrowRight size={10} className="text-blue-400" />
          <span className="text-[11px] text-white/80 font-medium">
            {currentNodeLabel}
          </span>
        </div>

        <div className="w-px h-4 bg-white/[0.1]" />

        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[9px] text-white/40">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>

        {/* Stop button */}
        <button
          onClick={onStop}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] transition-colors text-[10px] text-white/50 hover:text-white/70"
        >
          <Square size={8} />
          Stop
        </button>
      </div>
    </div>
  );
}
