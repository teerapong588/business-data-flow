"use client";

import React, { useMemo } from "react";
import { useNodes, useViewport } from "@xyflow/react";
import { computeSwimLanes } from "@/lib/swim-lanes";
import type { SystemFlowNode } from "@/types/flow";

export function SwimLaneBackground() {
  const nodes = useNodes();
  const { x, y, zoom } = useViewport();

  const lanes = useMemo(
    () => computeSwimLanes(nodes as SystemFlowNode[]),
    [nodes]
  );

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    >
      <div
        style={{
          transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {lanes.map((lane) => (
          <div
            key={lane.department}
            className="absolute rounded-2xl"
            style={{
              left: lane.bounds.x,
              top: lane.bounds.y,
              width: lane.bounds.width,
              height: lane.bounds.height,
              backgroundColor: `${lane.color}05`,
              border: `1px solid ${lane.color}0a`,
            }}
          >
            <span
              className="absolute top-2 left-3 text-[9px] uppercase tracking-wider font-medium"
              style={{ color: `${lane.color}30` }}
            >
              {lane.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
