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
              backgroundColor: `${zone.color}06`,
              border: `1px dashed ${zone.color}12`,
            }}
          >
            <span
              className="absolute top-1 left-2 text-[7px] uppercase tracking-wider font-medium"
              style={{ color: `${zone.color}25` }}
            >
              {zone.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
