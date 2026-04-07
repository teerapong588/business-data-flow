"use client";

import { useState, useCallback, useMemo } from "react";
import { Department, FlowType } from "@/types/flow";
import { useFlowStore } from "@/store/useFlowStore";
import type { SystemNodeData, DataEdgeData } from "@/types/flow";

export function useFlowFilters() {
  const allNodes = useFlowStore((s) => s.nodes);
  const allEdges = useFlowStore((s) => s.edges);

  const [activeDepartments, setActiveDepartments] = useState<Set<Department>>(
    new Set()
  );
  const [activeFlowType, setActiveFlowType] = useState<FlowType | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDepartment = useCallback((dept: Department) => {
    setActiveDepartments((prev) => {
      const next = new Set(prev);
      if (next.has(dept)) {
        next.delete(dept);
      } else {
        next.add(dept);
      }
      return next;
    });
  }, []);

  const setFlowType = useCallback((ft: FlowType | null) => {
    setActiveFlowType(ft);
  }, []);

  const resetFilters = useCallback(() => {
    setActiveDepartments(new Set());
    setActiveFlowType(null);
    setSearchQuery("");
  }, []);

  // Search matching node IDs
  const searchMatchingNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return new Set(
      allNodes
        .filter((node) => {
          const d = node.data as SystemNodeData;
          return (
            d.label.toLowerCase().includes(query) ||
            d.systemName.toLowerCase().includes(query) ||
            d.owner.toLowerCase().includes(query) ||
            d.department.toLowerCase().includes(query)
          );
        })
        .map((n) => n.id)
    );
  }, [searchQuery]);

  // Compute connected nodes for hover path tracing
  const connectedNodeIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    const connected = new Set<string>([hoveredNodeId]);

    const walkUp = (nodeId: string) => {
      allEdges.forEach((edge) => {
        if (edge.target === nodeId && !connected.has(edge.source)) {
          connected.add(edge.source);
          walkUp(edge.source);
        }
      });
    };

    const walkDown = (nodeId: string) => {
      allEdges.forEach((edge) => {
        if (edge.source === nodeId && !connected.has(edge.target)) {
          connected.add(edge.target);
          walkDown(edge.target);
        }
      });
    };

    walkUp(hoveredNodeId);
    walkDown(hoveredNodeId);
    return connected;
  }, [hoveredNodeId]);

  const connectedEdgeIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    return new Set(
      allEdges
        .filter(
          (e) => connectedNodeIds.has(e.source) && connectedNodeIds.has(e.target)
        )
        .map((e) => e.id)
    );
  }, [hoveredNodeId, connectedNodeIds]);

  // Apply filters + hover + search to nodes
  const filteredNodes = useMemo(() => {
    const hasDeptFilter = activeDepartments.size > 0;
    const hasHover = hoveredNodeId !== null;
    const hasSearch = searchMatchingNodeIds !== null;

    return allNodes.map((node) => {
      const nodeData = node.data as SystemNodeData;
      let dimmed = false;

      if (hasDeptFilter && !activeDepartments.has(nodeData.department)) {
        dimmed = true;
      }

      if (activeFlowType && !nodeData.flowTypes.includes(activeFlowType)) {
        dimmed = true;
      }

      if (hasHover && !connectedNodeIds.has(node.id)) {
        dimmed = true;
      }

      if (hasSearch && !searchMatchingNodeIds.has(node.id)) {
        dimmed = true;
      }

      return {
        ...node,
        className: dimmed ? "dimmed" : "",
      };
    });
  }, [activeDepartments, activeFlowType, hoveredNodeId, connectedNodeIds, searchMatchingNodeIds]);

  // Apply filters + hover to edges
  const filteredEdges = useMemo(() => {
    const hasHover = hoveredNodeId !== null;

    return allEdges.map((edge) => {
      const edgeData = edge.data as DataEdgeData;
      let dimmed = false;
      let highlighted = false;

      if (activeFlowType && !edgeData.flowTypes.includes(activeFlowType)) {
        dimmed = true;
      }

      if (hasHover) {
        if (connectedEdgeIds.has(edge.id)) {
          highlighted = true;
        } else {
          dimmed = true;
        }
      }

      return {
        ...edge,
        type: "animated" as const,
        className: dimmed ? "dimmed" : highlighted ? "highlighted" : "",
      };
    });
  }, [activeFlowType, hoveredNodeId, connectedEdgeIds]);

  return {
    activeDepartments,
    activeFlowType,
    hoveredNodeId,
    searchQuery,
    toggleDepartment,
    setFlowType,
    resetFilters,
    setHoveredNodeId,
    setSearchQuery,
    filteredNodes,
    filteredEdges,
  };
}
