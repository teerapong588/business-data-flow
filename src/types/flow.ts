import { type Node, type Edge } from "@xyflow/react";

// Widened to string so users can define custom departments and functions
export type Department = string;
export type BusinessFunction = string;
export type FlowType = string;

export type EditMode = "view" | "edit";

export interface SystemNodeData {
  label: string;
  department: Department;
  function?: BusinessFunction;
  systemName: string;
  owner: string;
  description: string;
  dataTypes: string[];
  schedule: string;
  protocol: string;
  criticality: "high" | "medium" | "low";
  flowTypes: FlowType[];
  [key: string]: unknown;
}

export interface DataEdgeData {
  label: string;
  dataDescription: string;
  frequency: string;
  protocol: string;
  flowTypes: FlowType[];
  [key: string]: unknown;
}

export type SystemFlowNode = Node<SystemNodeData, "system">;
export type DataFlowEdge = Edge<DataEdgeData>;

export interface DepartmentConfig {
  id: Department;
  label: string;
  color: string;
  glowColor: string;
  glowIntense: string;
  icon: string;
}

export interface BusinessFunctionConfig {
  id: BusinessFunction;
  label: string;
  departmentId: Department;
  color: string;
}

export type FreshnessStatus = "fresh" | "stale" | "down";

export interface FreshnessInfo {
  status: FreshnessStatus;
  lastUpdated: Date;
}

export interface FlowTypeConfig {
  id: FlowType;
  label: string;
  description: string;
}

export interface FlowProject {
  id: string;
  name: string;
  description: string;
  nodes: SystemFlowNode[];
  edges: DataFlowEdge[];
  departments: DepartmentConfig[];
  functions: BusinessFunctionConfig[];
  flowTypes: FlowTypeConfig[];
  flowPaths: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}
