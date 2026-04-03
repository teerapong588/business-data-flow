"use client";

import { useState, useCallback } from "react";
import type { Edge } from "@xyflow/react";

export function useEdgeSelection() {
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  const closeEdgePanel = useCallback(() => {
    setSelectedEdgeId(null);
  }, []);

  return {
    selectedEdgeId,
    isEdgeDetailOpen: selectedEdgeId !== null,
    onEdgeClick,
    closeEdgePanel,
  };
}
