"use client";

import React from "react";
import type { TracedFieldPath } from "@/lib/schema-utils";
import { X, Route, ArrowRight } from "lucide-react";

interface FieldTraceOverlayProps {
  tracedPath: TracedFieldPath[];
  onStop: () => void;
}

export function FieldTraceOverlay({ tracedPath, onStop }: FieldTraceOverlayProps) {
  const origin = tracedPath.find((p) => p.direction === "origin");
  if (!origin) return null;

  const upstream = tracedPath.filter((p) => p.direction === "upstream");
  const downstream = tracedPath.filter((p) => p.direction === "downstream");

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#0c1225]/95 backdrop-blur-xl border border-blue-500/30 rounded-xl px-5 py-3 shadow-xl max-w-xl">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <Route size={14} className="text-blue-400" />
          <span className="text-[12px] text-white/90 font-semibold">
            Tracing: {origin.schemaName}.{origin.fieldName}
          </span>
        </div>
        <button
          onClick={onStop}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
        >
          <X size={10} />
          Stop
        </button>
      </div>

      <div className="flex items-center gap-1 flex-wrap text-[10px]">
        {upstream.reverse().map((p) => (
          <React.Fragment key={`up-${p.nodeId}`}>
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/50">
              {p.nodeLabel}
            </span>
            <ArrowRight size={8} className="text-white/20" />
          </React.Fragment>
        ))}

        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium border border-blue-500/30">
          {origin.nodeLabel}
        </span>

        {downstream.map((p) => (
          <React.Fragment key={`down-${p.nodeId}`}>
            <ArrowRight size={8} className="text-white/20" />
            <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/50">
              {p.nodeLabel}
            </span>
          </React.Fragment>
        ))}
      </div>

      <p className="text-[9px] text-white/25 mt-1.5">
        {tracedPath.length} systems in trace path
      </p>
    </div>
  );
}
