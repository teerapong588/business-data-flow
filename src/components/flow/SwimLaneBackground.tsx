"use client";

import React, { useMemo } from "react";
import { useNodes, useViewport } from "@xyflow/react";
import { computeSwimLanes, computeFunctionZones } from "@/lib/swim-lanes";
import { useFlowStore } from "@/store/useFlowStore";
import type { SystemFlowNode } from "@/types/flow";

export function SwimLaneBackground() {
  const nodes = useNodes();
  const { x, y, zoom } = useViewport();
  const departments = useFlowStore((s) => s.departments);
  const functions = useFlowStore((s) => s.functions);

  const departmentColors = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.color])),
    [departments]
  );
  const departmentLabels = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.label])),
    [departments]
  );
  const functionColors = useMemo(
    () => Object.fromEntries(functions.map((f) => [f.id, f.color])),
    [functions]
  );
  const functionLabels = useMemo(
    () => Object.fromEntries(functions.map((f) => [f.id, f.label])),
    [functions]
  );

  const lanes = useMemo(
    () =>
      computeSwimLanes(
        nodes as SystemFlowNode[],
        departmentColors,
        departmentLabels
      ),
    [nodes, departmentColors, departmentLabels]
  );

  const zones = useMemo(
    () =>
      computeFunctionZones(
        nodes as SystemFlowNode[],
        functionColors,
        functionLabels
      ),
    [nodes, functionColors, functionLabels]
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
        {/* Department lanes (outer) */}
        {lanes.map((lane) => (
          <div
            key={`dept-${lane.department}`}
            className="absolute rounded-2xl"
            style={{
              left: lane.bounds.x,
              top: lane.bounds.y,
              width: lane.bounds.width,
              height: lane.bounds.height,
              backgroundColor: `${lane.color}20`,
              border: `2px solid ${lane.color}50`,
              boxShadow: `0 0 20px ${lane.color}10`,
            }}
          >
            <span
              className="absolute top-3 left-4 text-[12px] uppercase tracking-widest font-bold"
              style={{ color: `${lane.color}aa` }}
            >
              {lane.label}
            </span>
          </div>
        ))}

        {/* Function zones (inner) */}
        {zones.map((zone) => (
          <div
            key={`fn-${zone.functionId}`}
            className="absolute rounded-lg"
            style={{
              left: zone.bounds.x,
              top: zone.bounds.y,
              width: zone.bounds.width,
              height: zone.bounds.height,
              backgroundColor: `${zone.color}15`,
              border: `1px solid ${zone.color}40`,
            }}
          >
            <span
              className="absolute top-2 left-3 text-[9px] uppercase tracking-wider font-semibold"
              style={{ color: `${zone.color}80` }}
            >
              {zone.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
