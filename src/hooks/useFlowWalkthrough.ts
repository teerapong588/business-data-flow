"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import type { FlowType, SystemNodeData } from "@/types/flow";

export function useFlowWalkthrough() {
  const allEdges = useFlowStore((s) => s.edges);
  const allNodes = useFlowStore((s) => s.nodes);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFlowType, setCurrentFlowType] = useState<FlowType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [path, setPath] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeNodeId = isPlaying && path.length > 0 ? path[currentStepIndex] ?? null : null;

  // Find the edge between current and previous step
  const activeEdgeId = (() => {
    if (!isPlaying || currentStepIndex === 0 || path.length === 0) return null;
    const prevNode = path[currentStepIndex - 1];
    const currNode = path[currentStepIndex];
    if (!prevNode || !currNode) return null;
    const edge = allEdges.find(
      (e) =>
        (e.source === prevNode && e.target === currNode) ||
        (e.source === currNode && e.target === prevNode)
    );
    return edge?.id ?? null;
  })();

  // Track visited nodes and edges
  const visitedNodeIds = new Set(isPlaying ? path.slice(0, currentStepIndex + 1) : []);
  const visitedEdgeIds = new Set<string>();
  if (isPlaying) {
    for (let i = 1; i <= currentStepIndex; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      const edge = allEdges.find(
        (e) =>
          (e.source === prev && e.target === curr) ||
          (e.source === curr && e.target === prev)
      );
      if (edge) visitedEdgeIds.add(edge.id);
    }
  }

  const activeNodeLabel = (() => {
    if (!activeNodeId) return "";
    const node = allNodes.find((n) => n.id === activeNodeId);
    return (node?.data as SystemNodeData)?.label ?? activeNodeId;
  })();

  const play = useCallback((flowType: FlowType, flowPath: string[]) => {
    setCurrentFlowType(flowType);
    setPath(flowPath);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setPath([]);
    setCurrentFlowType(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Auto-advance steps
  useEffect(() => {
    if (!isPlaying || path.length === 0) return;

    if (currentStepIndex >= path.length - 1) {
      // Reached end, stop after a brief pause
      timerRef.current = setTimeout(stop, 2000);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, path.length, stop]);

  return {
    isPlaying,
    currentFlowType,
    currentStepIndex,
    totalSteps: path.length,
    activeNodeId,
    activeEdgeId,
    activeNodeLabel,
    visitedNodeIds,
    visitedEdgeIds,
    play,
    stop,
  };
}
