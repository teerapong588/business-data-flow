"use client";

import { useState, useEffect } from "react";
import { nodes } from "@/data/nodes";
import type { FreshnessInfo, FreshnessStatus, SystemNodeData } from "@/types/flow";

function generateFreshness(nodeId: string, criticality: string, schedule: string): FreshnessInfo {
  const now = new Date();
  const isRealTime = schedule.toLowerCase().includes("real-time");
  const isHighCrit = criticality === "high";

  // Most systems are fresh; a few are stale or down for realism
  let status: FreshnessStatus = "fresh";
  let minutesAgo = Math.floor(Math.random() * 5) + 1;

  if (isRealTime && isHighCrit) {
    // Real-time critical systems: almost always fresh
    status = Math.random() > 0.95 ? "stale" : "fresh";
    minutesAgo = Math.floor(Math.random() * 3) + 1;
  } else if (isRealTime) {
    status = Math.random() > 0.9 ? "stale" : "fresh";
    minutesAgo = Math.floor(Math.random() * 10) + 1;
  } else {
    // Batch systems: might be stale
    const roll = Math.random();
    if (roll > 0.85) {
      status = "stale";
      minutesAgo = Math.floor(Math.random() * 120) + 60;
    } else if (roll > 0.97) {
      status = "down";
      minutesAgo = Math.floor(Math.random() * 300) + 120;
    } else {
      minutesAgo = Math.floor(Math.random() * 30) + 5;
    }
  }

  // Force one specific node to be "down" for demo realism
  if (nodeId === "corporate-actions") {
    status = "stale";
    minutesAgo = 95;
  }

  const lastUpdated = new Date(now.getTime() - minutesAgo * 60 * 1000);
  return { status, lastUpdated };
}

export function useDataFreshness() {
  const [freshnessMap, setFreshnessMap] = useState<Map<string, FreshnessInfo>>(() => {
    const map = new Map<string, FreshnessInfo>();
    nodes.forEach((node) => {
      const data = node.data as SystemNodeData;
      map.set(node.id, generateFreshness(node.id, data.criticality, data.schedule));
    });
    return map;
  });

  // Simulate live updates every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setFreshnessMap((prev) => {
        const next = new Map(prev);
        // Randomly update 1-2 nodes
        const nodeList = nodes;
        const idx = Math.floor(Math.random() * nodeList.length);
        const node = nodeList[idx];
        const data = node.data as SystemNodeData;
        next.set(node.id, generateFreshness(node.id, data.criticality, data.schedule));
        return next;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return freshnessMap;
}
