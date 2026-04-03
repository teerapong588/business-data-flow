import { FlowTypeConfig } from "@/types/flow";

export const flowTypes: FlowTypeConfig[] = [
  {
    id: "trade-lifecycle",
    label: "Trade Lifecycle",
    description: "End-to-end trade flow from order to settlement",
  },
  {
    id: "nav-calculation",
    label: "NAV Calculation",
    description: "Daily Net Asset Value computation pipeline",
  },
  {
    id: "risk-management",
    label: "Risk Management",
    description: "Real-time risk monitoring and reporting",
  },
  {
    id: "compliance-monitoring",
    label: "Compliance",
    description: "Regulatory compliance and surveillance",
  },
  {
    id: "client-reporting",
    label: "Client Reporting",
    description: "Performance reports and client communications",
  },
];
