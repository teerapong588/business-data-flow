"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import type {
  SystemFlowNode,
  DataFlowEdge,
  DepartmentConfig,
  BusinessFunctionConfig,
  FlowTypeConfig,
  SystemNodeData,
  DataEdgeData,
  EditMode,
  FlowProject,
} from "@/types/flow";
import { ASSET_MANAGEMENT_TEMPLATE } from "@/data/templates";

function generateGlowFromColor(hex: string): {
  glowColor: string;
  glowIntense: string;
} {
  // Convert hex to rgb values
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    glowColor: `0 0 20px rgba(${r},${g},${b},0.3)`,
    glowIntense: `0 0 30px rgba(${r},${g},${b},0.5), 0 0 60px rgba(${r},${g},${b},0.2)`,
  };
}

interface FlowState {
  // Project metadata
  projectId: string;
  projectName: string;
  projectDescription: string;

  // Flow data
  nodes: SystemFlowNode[];
  edges: DataFlowEdge[];
  departments: DepartmentConfig[];
  functions: BusinessFunctionConfig[];
  flowTypes: FlowTypeConfig[];
  flowPaths: Record<string, string[]>;

  // Edit mode
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;

  // Node CRUD
  addNode: (node: SystemFlowNode) => void;
  updateNode: (id: string, data: Partial<SystemNodeData>) => void;
  deleteNode: (id: string) => void;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;

  // Edge CRUD
  addEdge: (edge: DataFlowEdge) => void;
  updateEdge: (id: string, data: Partial<DataEdgeData>) => void;
  deleteEdge: (id: string) => void;

  // Department CRUD
  addDepartment: (dept: Omit<DepartmentConfig, "glowColor" | "glowIntense">) => void;
  updateDepartment: (id: string, updates: Partial<DepartmentConfig>) => void;
  deleteDepartment: (id: string) => void;

  // Function CRUD
  addFunction: (fn: BusinessFunctionConfig) => void;
  updateFunction: (id: string, updates: Partial<BusinessFunctionConfig>) => void;
  deleteFunction: (id: string) => void;

  // FlowType CRUD
  addFlowType: (ft: FlowTypeConfig) => void;
  updateFlowType: (id: string, updates: Partial<FlowTypeConfig>) => void;
  deleteFlowType: (id: string) => void;

  // Project management
  setProjectName: (name: string) => void;
  setProjectDescription: (description: string) => void;
  loadProject: (project: FlowProject) => void;
  getProject: () => FlowProject;
  newBlankProject: () => void;
  loadTemplate: (template: FlowProject) => void;
}

export const useFlowStore = create<FlowState>()(
  persist(
    (set, get) => ({
      // Initialize with Asset Management template
      projectId: ASSET_MANAGEMENT_TEMPLATE.id,
      projectName: ASSET_MANAGEMENT_TEMPLATE.name,
      projectDescription: ASSET_MANAGEMENT_TEMPLATE.description,
      nodes: ASSET_MANAGEMENT_TEMPLATE.nodes,
      edges: ASSET_MANAGEMENT_TEMPLATE.edges,
      departments: ASSET_MANAGEMENT_TEMPLATE.departments,
      functions: ASSET_MANAGEMENT_TEMPLATE.functions,
      flowTypes: ASSET_MANAGEMENT_TEMPLATE.flowTypes,
      flowPaths: ASSET_MANAGEMENT_TEMPLATE.flowPaths,

      editMode: "view",
      setEditMode: (mode) => set({ editMode: mode }),

      // ── Node CRUD ───────────────────────────────────────────────────

      addNode: (node) =>
        set((state) => ({ nodes: [...state.nodes, node] })),

      updateNode: (id, data) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, data: { ...n.data, ...data } } : n
          ),
        })),

      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          // Also remove connected edges
          edges: state.edges.filter(
            (e) => e.source !== id && e.target !== id
          ),
        })),

      updateNodePosition: (id, position) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, position } : n
          ),
        })),

      // ── Edge CRUD ───────────────────────────────────────────────────

      addEdge: (edge) =>
        set((state) => ({ edges: [...state.edges, edge] })),

      updateEdge: (id, data) =>
        set((state) => ({
          edges: state.edges.map((e) =>
            e.id === id
              ? ({ ...e, data: { ...e.data, ...data } } as DataFlowEdge)
              : e
          ),
        })),

      deleteEdge: (id) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== id),
        })),

      // ── Department CRUD ─────────────────────────────────────────────

      addDepartment: (dept) =>
        set((state) => ({
          departments: [
            ...state.departments,
            {
              ...dept,
              ...generateGlowFromColor(dept.color),
            },
          ],
        })),

      updateDepartment: (id, updates) =>
        set((state) => ({
          departments: state.departments.map((d) => {
            if (d.id !== id) return d;
            const updated = { ...d, ...updates };
            // Regenerate glow if color changed
            if (updates.color) {
              const glow = generateGlowFromColor(updates.color);
              updated.glowColor = glow.glowColor;
              updated.glowIntense = glow.glowIntense;
            }
            return updated;
          }),
        })),

      deleteDepartment: (id) =>
        set((state) => ({
          departments: state.departments.filter((d) => d.id !== id),
          // Also remove functions under this department
          functions: state.functions.filter((f) => f.departmentId !== id),
        })),

      // ── Function CRUD ───────────────────────────────────────────────

      addFunction: (fn) =>
        set((state) => ({ functions: [...state.functions, fn] })),

      updateFunction: (id, updates) =>
        set((state) => ({
          functions: state.functions.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      deleteFunction: (id) =>
        set((state) => ({
          functions: state.functions.filter((f) => f.id !== id),
        })),

      // ── FlowType CRUD ──────────────────────────────────────────────

      addFlowType: (ft) =>
        set((state) => ({ flowTypes: [...state.flowTypes, ft] })),

      updateFlowType: (id, updates) =>
        set((state) => ({
          flowTypes: state.flowTypes.map((ft) =>
            ft.id === id ? { ...ft, ...updates } : ft
          ),
        })),

      deleteFlowType: (id) =>
        set((state) => ({
          flowTypes: state.flowTypes.filter((ft) => ft.id !== id),
        })),

      // ── Project Management ──────────────────────────────────────────

      setProjectName: (name) => set({ projectName: name }),
      setProjectDescription: (description) => set({ projectDescription: description }),

      loadProject: (project) =>
        set({
          projectId: project.id,
          projectName: project.name,
          projectDescription: project.description,
          nodes: project.nodes,
          edges: project.edges,
          departments: project.departments,
          functions: project.functions,
          flowTypes: project.flowTypes,
          flowPaths: project.flowPaths,
        }),

      getProject: (): FlowProject => {
        const state = get();
        return {
          id: state.projectId,
          name: state.projectName,
          description: state.projectDescription,
          nodes: state.nodes,
          edges: state.edges,
          departments: state.departments,
          functions: state.functions,
          flowTypes: state.flowTypes,
          flowPaths: state.flowPaths,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      },

      newBlankProject: () =>
        set({
          projectId: crypto.randomUUID(),
          projectName: "New Project",
          projectDescription: "",
          nodes: [],
          edges: [],
          departments: [],
          functions: [],
          flowTypes: [],
          flowPaths: {},
        }),

      loadTemplate: (template) =>
        set({
          projectId: crypto.randomUUID(),
          projectName: template.name,
          projectDescription: template.description,
          nodes: structuredClone(template.nodes),
          edges: structuredClone(template.edges),
          departments: structuredClone(template.departments),
          functions: structuredClone(template.functions),
          flowTypes: structuredClone(template.flowTypes),
          flowPaths: structuredClone(template.flowPaths),
        }),
    }),
    {
      name: "flow-project",
      version: 6,
      migrate: (_persistedState, _version) => ({
        projectId: ASSET_MANAGEMENT_TEMPLATE.id,
        projectName: ASSET_MANAGEMENT_TEMPLATE.name,
        projectDescription: ASSET_MANAGEMENT_TEMPLATE.description,
        nodes: structuredClone(ASSET_MANAGEMENT_TEMPLATE.nodes),
        edges: structuredClone(ASSET_MANAGEMENT_TEMPLATE.edges),
        departments: structuredClone(ASSET_MANAGEMENT_TEMPLATE.departments),
        functions: structuredClone(ASSET_MANAGEMENT_TEMPLATE.functions),
        flowTypes: structuredClone(ASSET_MANAGEMENT_TEMPLATE.flowTypes),
        flowPaths: structuredClone(ASSET_MANAGEMENT_TEMPLATE.flowPaths),
        editMode: "view" as const,
      }),
      // Replace entirely instead of merging with old state
      merge: (_persistedState, currentState) => {
        const persisted = _persistedState as Partial<FlowState> | undefined;
        if (!persisted || !persisted.nodes) return currentState;
        return { ...currentState, ...persisted };
      },
    }
  )
);

// ── Selectors ─────────────────────────────────────────────────────────────

export const useDepartmentMap = () => {
  const departments = useFlowStore(useShallow((state) => state.departments));
  const map: Record<string, DepartmentConfig> = {};
  for (const d of departments) {
    map[d.id] = d;
  }
  return map;
};

export const useFunctionMap = () => {
  const functions = useFlowStore(useShallow((state) => state.functions));
  const map: Record<string, BusinessFunctionConfig> = {};
  for (const f of functions) {
    map[f.id] = f;
  }
  return map;
};

export const useFunctionsByDepartment = (departmentId: string) =>
  useFlowStore(
    useShallow((state) =>
      state.functions.filter((f) => f.departmentId === departmentId)
    )
  );
