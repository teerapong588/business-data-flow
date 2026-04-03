"use client";

import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { FreshnessInfo } from "@/types/flow";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

const statusColors: Record<string, string> = {
  fresh: "#22c55e",
  stale: "#f59e0b",
  down: "#ef4444",
};

const statusLabels: Record<string, string> = {
  fresh: "Operational",
  stale: "Stale",
  down: "Down",
};

export function FreshnessDot({ freshness }: { freshness?: FreshnessInfo }) {
  if (!freshness) return null;

  const color = statusColors[freshness.status];
  const isDown = freshness.status === "down";

  return (
    <Tooltip>
      <TooltipTrigger
        className={`absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full border border-[#0a0e1a] z-10 cursor-default ${isDown ? "animate-pulse" : ""}`}
        style={{ backgroundColor: color }}
      />
      <TooltipContent
        side="top"
        className="bg-[#0f1629]/95 backdrop-blur-md border-white/[0.08] text-white/80 text-[10px] px-2 py-1"
      >
        <span style={{ color }}>{statusLabels[freshness.status]}</span>
        {" · "}
        {formatTimeAgo(freshness.lastUpdated)}
      </TooltipContent>
    </Tooltip>
  );
}
