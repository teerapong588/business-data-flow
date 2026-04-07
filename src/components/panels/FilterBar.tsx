"use client";

import React from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { Department, FlowType } from "@/types/flow";
import { RotateCcw, Play, Square } from "lucide-react";

interface FilterBarProps {
  activeDepartments: Set<Department>;
  activeFlowType: FlowType | null;
  onToggleDepartment: (dept: Department) => void;
  onSetFlowType: (ft: FlowType | null) => void;
  onReset: () => void;
  onPlayWalkthrough: () => void;
  isWalkthroughPlaying: boolean;
  onStopWalkthrough: () => void;
}

export function FilterBar({
  activeDepartments,
  activeFlowType,
  onToggleDepartment,
  onSetFlowType,
  onReset,
  onPlayWalkthrough,
  isWalkthroughPlaying,
  onStopWalkthrough,
}: FilterBarProps) {
  const departments = useFlowStore((s) => s.departments);
  const flowTypes = useFlowStore((s) => s.flowTypes);
  const hasFilters = activeDepartments.size > 0 || activeFlowType !== null;

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 bg-[#0c1225]/80 backdrop-blur-sm border-b border-white/[0.06]">
      {/* Department toggles */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-wider mr-1">
          Dept
        </span>
        {departments.map((dept) => {
          const isActive =
            activeDepartments.size === 0 || activeDepartments.has(dept.id);
          return (
            <button
              key={dept.id}
              onClick={() => onToggleDepartment(dept.id)}
              className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px]
                border transition-all duration-200
                ${
                  activeDepartments.has(dept.id)
                    ? "border-white/20 bg-white/[0.08]"
                    : "border-white/[0.06] bg-transparent hover:bg-white/[0.04]"
                }
              `}
              style={{
                opacity: isActive ? 1 : 0.4,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: dept.color,
                  boxShadow: isActive ? `0 0 6px ${dept.color}60` : "none",
                }}
              />
              <span className="text-white/70">{dept.label}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-white/[0.08]" />

      {/* Flow type toggles */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-white/30 uppercase tracking-wider mr-1">
          Flow
        </span>
        <button
          onClick={() => onSetFlowType(null)}
          className={`
            px-2.5 py-1 rounded-full text-[10px] border transition-all duration-200
            ${
              activeFlowType === null
                ? "border-white/20 bg-white/[0.08] text-white/80"
                : "border-white/[0.06] text-white/40 hover:bg-white/[0.04]"
            }
          `}
        >
          All
        </button>
        {flowTypes.map((ft) => (
          <button
            key={ft.id}
            onClick={() =>
              onSetFlowType(activeFlowType === ft.id ? null : ft.id)
            }
            className={`
              px-2.5 py-1 rounded-full text-[10px] border transition-all duration-200
              ${
                activeFlowType === ft.id
                  ? "border-white/20 bg-white/[0.08] text-white/80"
                  : "border-white/[0.06] text-white/40 hover:bg-white/[0.04]"
              }
            `}
          >
            {ft.label}
          </button>
        ))}

        {/* Walkthrough Play/Stop */}
        {activeFlowType && !isWalkthroughPlaying && (
          <button
            onClick={onPlayWalkthrough}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-200"
          >
            <Play size={9} />
            Walkthrough
          </button>
        )}
        {isWalkthroughPlaying && (
          <button
            onClick={onStopWalkthrough}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200"
          >
            <Square size={8} />
            Stop
          </button>
        )}
      </div>

      {/* Reset */}
      {hasFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] text-white/40 hover:text-white/60 transition-colors"
        >
          <RotateCcw size={10} />
          Reset
        </button>
      )}
    </div>
  );
}
