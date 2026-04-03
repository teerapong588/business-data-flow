export const DEPARTMENT_COLORS: Record<string, string> = {
  trading: "#3b82f6",
  operations: "#14b8a6",
  "portfolio-management": "#6366f1",
  risk: "#f59e0b",
  compliance: "#a855f7",
  reporting: "#10b981",
  technology: "#64748b",
  external: "#f43f5e",
};

export const COLUMN_X = {
  external: 0,
  frontOffice: 400,
  middleOffice: 800,
  backOffice: 1200,
  output: 1600,
} as const;

export const ROW_GAP = 160;
