import { DepartmentConfig } from "@/types/flow";

export const departments: DepartmentConfig[] = [
  {
    id: "trading",
    label: "Trading",
    color: "#3b82f6",
    glowColor: "0 0 20px rgba(59,130,246,0.3)",
    glowIntense: "0 0 30px rgba(59,130,246,0.5), 0 0 60px rgba(59,130,246,0.2)",
    icon: "TrendingUp",
  },
  {
    id: "operations",
    label: "Operations",
    color: "#14b8a6",
    glowColor: "0 0 20px rgba(20,184,166,0.3)",
    glowIntense: "0 0 30px rgba(20,184,166,0.5), 0 0 60px rgba(20,184,166,0.2)",
    icon: "Settings",
  },
  {
    id: "portfolio-management",
    label: "Portfolio Mgmt",
    color: "#6366f1",
    glowColor: "0 0 20px rgba(99,102,241,0.3)",
    glowIntense: "0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2)",
    icon: "PieChart",
  },
  {
    id: "risk",
    label: "Risk",
    color: "#f59e0b",
    glowColor: "0 0 20px rgba(245,158,11,0.3)",
    glowIntense: "0 0 30px rgba(245,158,11,0.5), 0 0 60px rgba(245,158,11,0.2)",
    icon: "AlertTriangle",
  },
  {
    id: "compliance",
    label: "Compliance",
    color: "#a855f7",
    glowColor: "0 0 20px rgba(168,85,247,0.3)",
    glowIntense: "0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(168,85,247,0.2)",
    icon: "Shield",
  },
  {
    id: "reporting",
    label: "Reporting",
    color: "#10b981",
    glowColor: "0 0 20px rgba(16,185,129,0.3)",
    glowIntense: "0 0 30px rgba(16,185,129,0.5), 0 0 60px rgba(16,185,129,0.2)",
    icon: "BarChart3",
  },
  {
    id: "technology",
    label: "Technology",
    color: "#64748b",
    glowColor: "0 0 20px rgba(100,116,139,0.3)",
    glowIntense: "0 0 30px rgba(100,116,139,0.5), 0 0 60px rgba(100,116,139,0.2)",
    icon: "Server",
  },
  {
    id: "external",
    label: "External",
    color: "#f43f5e",
    glowColor: "0 0 20px rgba(244,63,94,0.3)",
    glowIntense: "0 0 30px rgba(244,63,94,0.5), 0 0 60px rgba(244,63,94,0.2)",
    icon: "Globe",
  },
];

export const departmentMap = Object.fromEntries(
  departments.map((d) => [d.id, d])
) as Record<string, DepartmentConfig>;
