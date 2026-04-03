"use client";

import { useState, useCallback } from "react";

export function useNodeSelection() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: { id: string }) => {
    setSelectedNodeId(node.id);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  return {
    selectedNodeId,
    isDetailOpen: selectedNodeId !== null,
    onNodeClick,
    closePanel,
  };
}
