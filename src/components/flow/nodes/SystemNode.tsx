"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { departmentMap } from "@/data/departments";
import { SystemNodeData } from "@/types/flow";
import { FreshnessDot } from "./FreshnessDot";
import type { FreshnessInfo } from "@/types/flow";
import {
  TrendingUp,
  Settings,
  PieChart,
  AlertTriangle,
  Shield,
  BarChart3,
  Server,
  Globe,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Settings,
  PieChart,
  AlertTriangle,
  Shield,
  BarChart3,
  Server,
  Globe,
};

function SystemNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as unknown as SystemNodeData;
  const freshness = (data as unknown as { freshness?: FreshnessInfo }).freshness;
  const dept = departmentMap[nodeData.department];
  const Icon = iconMap[dept?.icon ?? "Server"] ?? Server;
  const color = dept?.color ?? "#64748b";
  const isHighCriticality = nodeData.criticality === "high";

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !border-0 !rounded-full"
        style={{ backgroundColor: color }}
      />
      <div
        className={`
          relative min-w-[180px] max-w-[200px] px-4 py-3 rounded-xl
          bg-white/[0.04] backdrop-blur-md
          border border-white/[0.08]
          cursor-pointer
          transition-all duration-300
          ${selected ? "ring-1" : ""}
          ${isHighCriticality ? "node-pulse" : ""}
        `}
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: color,
          boxShadow: dept?.glowColor ?? "none",
          ["--node-glow" as string]: dept?.glowColor ?? "none",
          ["--node-glow-intense" as string]: dept?.glowIntense ?? "none",
          ...(selected ? { ringColor: color } : {}),
        }}
      >
        {/* Freshness indicator */}
        <FreshnessDot freshness={freshness} />

        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="flex items-center justify-center w-6 h-6 rounded-md"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={14} style={{ color }} />
          </div>
          <span className="text-[11px] font-semibold text-white/90 leading-tight truncate">
            {nodeData.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-[9px] text-white/40 leading-snug mb-2 line-clamp-2">
          {nodeData.systemName}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="text-[8px] px-1.5 py-0 h-4 border-0"
            style={{
              backgroundColor: `${color}18`,
              color: color,
            }}
          >
            {dept?.label ?? nodeData.department}
          </Badge>
          {/* Criticality dot */}
          <div
            className="w-1.5 h-1.5 rounded-full ml-auto"
            style={{
              backgroundColor:
                nodeData.criticality === "high"
                  ? "#ef4444"
                  : nodeData.criticality === "medium"
                    ? "#f59e0b"
                    : "#22c55e",
            }}
          />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !border-0 !rounded-full"
        style={{ backgroundColor: color }}
      />
    </>
  );
}

export const SystemNode = memo(SystemNodeComponent);
