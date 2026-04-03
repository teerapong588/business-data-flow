import { type Node, type Edge } from "@xyflow/react";

export type Department =
  | "trading"
  | "operations"
  | "portfolio-management"
  | "risk"
  | "compliance"
  | "reporting"
  | "technology"
  | "external";

export type FlowType =
  | "trade-lifecycle"
  | "nav-calculation"
  | "risk-management"
  | "compliance-monitoring"
  | "client-reporting";

export interface SystemNodeData {
  label: string;
  department: Department;
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
