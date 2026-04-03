"use client";

import { useState, useEffect, useCallback } from "react";
import type { SystemFlowNode, DataFlowEdge } from "@/types/flow";

interface UseKeyboardNavigationProps {
  nodes: SystemFlowNode[];
  edges: DataFlowEdge[];
  onSelectNode: (nodeId: string) => void;
  closePanel: () => void;
}

export function useKeyboardNavigation({
  nodes,
  edges,
  onSelectNode,
  closePanel,
}: UseKeyboardNavigationProps) {
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "Tab": {
          e.preventDefault();
          const currentIdx = focusedNodeId
            ? nodes.findIndex((n) => n.id === focusedNodeId)
            : -1;
          const nextIdx = e.shiftKey
            ? (currentIdx - 1 + nodes.length) % nodes.length
            : (currentIdx + 1) % nodes.length;
          setFocusedNodeId(nodes[nextIdx].id);
          break;
        }

        case "ArrowRight": {
          if (!focusedNodeId) return;
          e.preventDefault();
          const downstream = edges.find((edge) => edge.source === focusedNodeId);
          if (downstream) setFocusedNodeId(downstream.target);
          break;
        }

        case "ArrowLeft": {
          if (!focusedNodeId) return;
          e.preventDefault();
          const upstream = edges.find((edge) => edge.target === focusedNodeId);
          if (upstream) setFocusedNodeId(upstream.source);
          break;
        }

        case "ArrowDown": {
          if (!focusedNodeId) return;
          e.preventDefault();
          const currentNode = nodes.find((n) => n.id === focusedNodeId);
          if (!currentNode) return;
          // Find connected nodes below
          const connectedIds = new Set(
            edges
              .filter((e) => e.source === focusedNodeId || e.target === focusedNodeId)
              .map((e) => (e.source === focusedNodeId ? e.target : e.source))
          );
          const below = nodes
            .filter((n) => connectedIds.has(n.id) && n.position.y > currentNode.position.y)
            .sort((a, b) => a.position.y - b.position.y);
          if (below.length > 0) setFocusedNodeId(below[0].id);
          break;
        }

        case "ArrowUp": {
          if (!focusedNodeId) return;
          e.preventDefault();
          const currentNode = nodes.find((n) => n.id === focusedNodeId);
          if (!currentNode) return;
          const connectedIds = new Set(
            edges
              .filter((e) => e.source === focusedNodeId || e.target === focusedNodeId)
              .map((e) => (e.source === focusedNodeId ? e.target : e.source))
          );
          const above = nodes
            .filter((n) => connectedIds.has(n.id) && n.position.y < currentNode.position.y)
            .sort((a, b) => b.position.y - a.position.y);
          if (above.length > 0) setFocusedNodeId(above[0].id);
          break;
        }

        case "Enter": {
          if (focusedNodeId) {
            e.preventDefault();
            onSelectNode(focusedNodeId);
          }
          break;
        }

        case "Escape": {
          e.preventDefault();
          closePanel();
          setFocusedNodeId(null);
          break;
        }
      }
    },
    [focusedNodeId, nodes, edges, onSelectNode, closePanel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { focusedNodeId, setFocusedNodeId };
}
