"use client";

import React, { useState } from "react";
import { departments } from "@/data/departments";
import { ChevronDown, ChevronUp } from "lucide-react";

export function Legend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-[#0c1225]/90 backdrop-blur-md border border-white/[0.08] rounded-xl overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between w-full px-3 py-2 text-[10px] text-white/50 hover:text-white/70 transition-colors"
      >
        <span className="uppercase tracking-wider font-medium">Legend</span>
        {collapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-1.5">
          {departments.map((dept) => (
            <div key={dept.id} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: dept.color,
                  boxShadow: `0 0 6px ${dept.color}40`,
                }}
              />
              <span className="text-[9px] text-white/50">{dept.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1.5 border-t border-white/[0.06]">
            <div className="flex gap-0.5">
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse delay-100" />
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse delay-200" />
            </div>
            <span className="text-[9px] text-white/50">Data flow direction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] text-white/50">High criticality</span>
          </div>
        </div>
      )}
    </div>
  );
}
