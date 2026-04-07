"use client";

import React, { useMemo } from "react";
import { useNodes, useViewport } from "@xyflow/react";
import { computeSwimLanes, computeFunctionZones } from "@/lib/swim-lanes";
import { useFlowStore } from "@/store/useFlowStore";
import type { SystemFlowNode } from "@/types/flow";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

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
      style={{ zIndex: 0 }}
    >
      <div
        style={{
          transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Department lanes (outer) */}
        {lanes.map((lane) => {
          const rgb = hexToRgb(lane.color);
          return (
            <div
              key={`dept-${lane.department}`}
              className="absolute rounded-2xl"
              style={{
                left: lane.bounds.x,
                top: lane.bounds.y,
                width: lane.bounds.width,
                height: lane.bounds.height,
                backgroundColor: `rgba(${rgb},0.07)`,
                border: `2px solid rgba(${rgb},0.3)`,
              }}
            >
              <span
                className="absolute top-3 left-4 text-[13px] uppercase tracking-widest font-bold select-none"
                style={{ color: `rgba(${rgb},0.65)` }}
              >
                {lane.label}
              </span>
            </div>
          );
        })}

        {/* Function zones (inner) */}
        {zones.map((zone) => {
          const rgb = hexToRgb(zone.color);
          return (
            <div
              key={`fn-${zone.functionId}`}
              className="absolute rounded-lg"
              style={{
                left: zone.bounds.x,
                top: zone.bounds.y,
                width: zone.bounds.width,
                height: zone.bounds.height,
                backgroundColor: `rgba(${rgb},0.05)`,
                border: `1px solid rgba(${rgb},0.2)`,
              }}
            >
              <span
                className="absolute top-2 left-3 text-[10px] uppercase tracking-wider font-semibold select-none"
                style={{ color: `rgba(${rgb},0.5)` }}
              >
                {zone.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
