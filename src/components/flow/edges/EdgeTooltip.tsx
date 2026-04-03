"use client";

import React from "react";
import type { DataEdgeData } from "@/types/flow";

interface EdgeTooltipProps {
  data: DataEdgeData;
  x: number;
  y: number;
}

export function EdgeTooltip({ data, x, y }: EdgeTooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: x + 12, top: y - 8 }}
    >
      <div className="bg-[#0f1629]/95 backdrop-blur-md border border-white/[0.1] rounded-lg shadow-xl px-3 py-2.5 max-w-[240px]">
        <p className="text-[11px] font-medium text-white/90 mb-1.5">
          {data.label}
        </p>
        <p className="text-[9px] text-white/50 leading-relaxed mb-2">
          {data.dataDescription}
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span className="text-[8px] text-white/30 uppercase tracking-wider">
            Frequency
          </span>
          <span className="text-[9px] text-white/60">{data.frequency}</span>
          <span className="text-[8px] text-white/30 uppercase tracking-wider">
            Protocol
          </span>
          <span className="text-[9px] text-white/60">{data.protocol}</span>
        </div>
      </div>
    </div>
  );
}
