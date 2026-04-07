import type { SystemFlowNode, SystemNodeData, Department, BusinessFunction } from "@/types/flow";

export interface SwimLane {
  department: Department;
  label: string;
  color: string;
  bounds: { x: number; y: number; width: number; height: number };
}

export interface FunctionZone {
  functionId: BusinessFunction;
  departmentId: Department;
  label: string;
  color: string;
  bounds: { x: number; y: number; width: number; height: number };
}

const NODE_WIDTH = 200;
const NODE_HEIGHT = 100;
const DEPT_PADDING = 40;
const FN_PADDING = 20;

export function computeSwimLanes(
  nodes: SystemFlowNode[],
  departmentColors?: Record<string, string>,
  departmentLabels?: Record<string, string>
): SwimLane[] {
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

  const lanes: SwimLane[] = [];
  groups.forEach((bounds, dept) => {
    lanes.push({
      department: dept,
      label: departmentLabels?.[dept] ?? dept,
      color: departmentColors?.[dept] ?? "#64748b",
      bounds: {
        x: bounds.minX - DEPT_PADDING,
        y: bounds.minY - DEPT_PADDING - 16,
        width: bounds.maxX - bounds.minX + DEPT_PADDING * 2,
        height: bounds.maxY - bounds.minY + DEPT_PADDING * 2 + 16,
      },
    });
  });

  return lanes;
}

export function computeFunctionZones(
  nodes: SystemFlowNode[],
  functionColors?: Record<string, string>,
  functionLabels?: Record<string, string>,
  functionDepartments?: Record<string, string>
): FunctionZone[] {
  const groups = new Map<string, { deptId: string; minX: number; minY: number; maxX: number; maxY: number }>();

  nodes.forEach((node) => {
    const data = node.data as SystemNodeData;
    const fnId = data.function;
    if (!fnId) return;
    const pos = node.position;

    const existing = groups.get(fnId);
    if (existing) {
      existing.minX = Math.min(existing.minX, pos.x);
      existing.minY = Math.min(existing.minY, pos.y);
      existing.maxX = Math.max(existing.maxX, pos.x + NODE_WIDTH);
      existing.maxY = Math.max(existing.maxY, pos.y + NODE_HEIGHT);
    } else {
      groups.set(fnId, {
        deptId: data.department,
        minX: pos.x,
        minY: pos.y,
        maxX: pos.x + NODE_WIDTH,
        maxY: pos.y + NODE_HEIGHT,
      });
    }
  });

  const zones: FunctionZone[] = [];
  groups.forEach((bounds, fnId) => {
    zones.push({
      functionId: fnId,
      departmentId: bounds.deptId,
      label: functionLabels?.[fnId] ?? fnId,
      color: functionColors?.[fnId] ?? "#64748b",
      bounds: {
        x: bounds.minX - FN_PADDING,
        y: bounds.minY - FN_PADDING - 12,
        width: bounds.maxX - bounds.minX + FN_PADDING * 2,
        height: bounds.maxY - bounds.minY + FN_PADDING * 2 + 12,
      },
    });
  });

  return zones;
}
