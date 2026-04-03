import type { SystemFlowNode, SystemNodeData, Department } from "@/types/flow";
import { DEPARTMENT_COLORS } from "./constants";

export interface SwimLane {
  department: Department;
  label: string;
  color: string;
  bounds: { x: number; y: number; width: number; height: number };
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const PADDING = 30;

export function computeSwimLanes(nodes: SystemFlowNode[]): SwimLane[] {
  const groups = new Map<Department, { minX: number; minY: number; maxX: number; maxY: number }>();

  nodes.forEach((node) => {
    const data = node.data as SystemNodeData;
    const dept = data.department;
    const pos = node.position;

    const existing = groups.get(dept);
    if (existing) {
      existing.minX = Math.min(existing.minX, pos.x);
      existing.minY = Math.min(existing.minY, pos.y);
      existing.maxX = Math.max(existing.maxX, pos.x + NODE_WIDTH);
      existing.maxY = Math.max(existing.maxY, pos.y + NODE_HEIGHT);
    } else {
      groups.set(dept, {
        minX: pos.x,
        minY: pos.y,
        maxX: pos.x + NODE_WIDTH,
        maxY: pos.y + NODE_HEIGHT,
      });
    }
  });

  const labels: Record<string, string> = {
    trading: "Trading",
    operations: "Operations",
    "portfolio-management": "Portfolio Mgmt",
    risk: "Risk",
    compliance: "Compliance",
    reporting: "Reporting",
    technology: "Technology",
    external: "External",
  };

  const lanes: SwimLane[] = [];
  groups.forEach((bounds, dept) => {
    lanes.push({
      department: dept,
      label: labels[dept] ?? dept,
      color: DEPARTMENT_COLORS[dept] ?? "#64748b",
      bounds: {
        x: bounds.minX - PADDING,
        y: bounds.minY - PADDING - 16,
        width: bounds.maxX - bounds.minX + PADDING * 2,
        height: bounds.maxY - bounds.minY + PADDING * 2 + 16,
      },
    });
  });

  return lanes;
}
