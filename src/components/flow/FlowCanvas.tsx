"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import { useNodeSelection } from "@/hooks/useNodeSelection";
import { useFlowFilters } from "@/hooks/useFlowFilters";
import { useDataFreshness } from "@/hooks/useDataFreshness";
import { useEdgeSelection } from "@/hooks/useEdgeSelection";
import { NodeDetailPanel } from "@/components/panels/NodeDetailPanel";
import { EdgeDetailPanel } from "@/components/panels/EdgeDetailPanel";
import { FilterBar } from "@/components/panels/FilterBar";
import { Legend } from "@/components/panels/Legend";
import { SearchBar } from "@/components/panels/SearchBar";
import { ExportButton } from "@/components/panels/ExportButton";
import { EdgeTooltip } from "@/components/flow/edges/EdgeTooltip";
import { SwimLaneBackground } from "@/components/flow/SwimLaneBackground";
import { WalkthroughOverlay } from "@/components/panels/WalkthroughOverlay";
import { DEPARTMENT_COLORS } from "@/lib/constants";
import { nodes as allNodes } from "@/data/nodes";
import { edges as allEdges } from "@/data/edges";
import { flowPaths } from "@/data/flow-paths";
import { useFlowWalkthrough } from "@/hooks/useFlowWalkthrough";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import type { SystemNodeData, DataEdgeData } from "@/types/flow";

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  const { selectedNodeId, isDetailOpen, onNodeClick, closePanel } =
    useNodeSelection();
  const { selectedEdgeId, isEdgeDetailOpen, onEdgeClick, closeEdgePanel } =
    useEdgeSelection();
  const {
    activeDepartments,
    activeFlowType,
    toggleDepartment,
    setFlowType,
    resetFilters,
    setHoveredNodeId,
    searchQuery,
    setSearchQuery,
    filteredNodes,
    filteredEdges,
  } = useFlowFilters();
  const freshnessMap = useDataFreshness();

  // Walkthrough
  const walkthrough = useFlowWalkthrough();

  // Keyboard navigation
  const { focusedNodeId } = useKeyboardNavigation({
    nodes: allNodes,
    edges: allEdges,
    onSelectNode: (nodeId: string) => {
      onNodeClick(
        {} as React.MouseEvent,
        { id: nodeId } as { id: string }
      );
    },
    closePanel: () => {
      closePanel();
      closeEdgePanel();
    },
  });

  // Edge tooltip state
  const [edgeTooltip, setEdgeTooltip] = useState<{
    data: DataEdgeData;
    x: number;
    y: number;
  } | null>(null);

  // Enrich nodes with freshness data + focused/walkthrough state
  const enrichedNodes = useMemo(() => {
    return filteredNodes.map((node) => {
      const freshness = freshnessMap.get(node.id);
      let className = node.className || "";

      if (focusedNodeId === node.id) {
        className += " focused";
      }

      // Walkthrough: dim all except active node
      if (walkthrough.isPlaying) {
        if (walkthrough.activeNodeId === node.id) {
          className = "walkthrough-active";
        } else if (walkthrough.visitedNodeIds.has(node.id)) {
          className = "";
        } else {
          className = "dimmed";
        }
      }

      return {
        ...node,
        className: className.trim(),
        data: {
          ...node.data,
          freshness,
        },
      };
    });
  }, [filteredNodes, freshnessMap, focusedNodeId, walkthrough.isPlaying, walkthrough.activeNodeId, walkthrough.visitedNodeIds]);

  // Enrich edges with walkthrough state
  const enrichedEdges = useMemo(() => {
    return filteredEdges.map((edge) => {
      let className = edge.className || "";

      if (walkthrough.isPlaying) {
        if (walkthrough.activeEdgeId === edge.id) {
          className = "highlighted";
        } else if (walkthrough.visitedEdgeIds.has(edge.id)) {
          className = "";
        } else {
          className = "dimmed";
        }
      }

      return { ...edge, className: className.trim() };
    });
  }, [filteredEdges, walkthrough.isPlaying, walkthrough.activeEdgeId, walkthrough.visitedEdgeIds]);

  const onNodeMouseEnter = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      if (!walkthrough.isPlaying) setHoveredNodeId(node.id);
    },
    [setHoveredNodeId, walkthrough.isPlaying]
  );

  const onNodeMouseLeave = useCallback(() => {
    if (!walkthrough.isPlaying) setHoveredNodeId(null);
  }, [setHoveredNodeId, walkthrough.isPlaying]);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      closeEdgePanel();
      onNodeClick(event, node);
    },
    [onNodeClick, closeEdgePanel]
  );

  const handleEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      closePanel();
      onEdgeClick(event, edge);
    },
    [onEdgeClick, closePanel]
  );

  // Track mouse position globally and auto-dismiss tooltip
  useEffect(() => {
    if (!edgeTooltip) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      // Check if we're still over an edge SVG element
      const isOverEdge = el?.closest('.react-flow__edge') !== null;
      if (!isOverEdge) {
        setEdgeTooltip(null);
      }
    };

    // Small delay before attaching so the initial hover doesn't immediately dismiss
    const timeout = setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove);
    }, 50);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [edgeTooltip]);

  const handleEdgeMouseEnter = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      const data = edge.data as DataEdgeData;
      if (data) {
        setEdgeTooltip({ data, x: event.clientX, y: event.clientY });
      }
    },
    []
  );

  const handleEdgeMouseLeave = useCallback(() => {
    setEdgeTooltip(null);
  }, []);

  const handleSearchSelect = useCallback(
    (nodeId: string) => {
      reactFlowInstance.fitView({
        nodes: [{ id: nodeId }],
        duration: 800,
        padding: 0.5,
      });
      closeEdgePanel();
      onNodeClick({} as React.MouseEvent, { id: nodeId } as { id: string });
    },
    [reactFlowInstance, onNodeClick, closeEdgePanel]
  );

  return (
    <div className="flex flex-col h-screen bg-[#0a0e1a]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-lg font-semibold text-white/90 tracking-tight">
            Asset Management Data Flow
          </h1>
          <p className="text-[11px] text-white/30">
            Interactive visualization of business data flows across systems
          </p>
        </div>

        {/* Search + Export + Live */}
        <div className="flex items-center gap-3">
          <SearchBar
            nodes={allNodes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectNode={handleSearchSelect}
          />
          <ExportButton targetRef={reactFlowWrapper} />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-white/40">Live</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        activeDepartments={activeDepartments}
        activeFlowType={activeFlowType}
        onToggleDepartment={toggleDepartment}
        onSetFlowType={setFlowType}
        onReset={resetFilters}
        onPlayWalkthrough={() => {
          if (activeFlowType && flowPaths[activeFlowType]) {
            walkthrough.play(activeFlowType, flowPaths[activeFlowType]);
          }
        }}
        isWalkthroughPlaying={walkthrough.isPlaying}
        onStopWalkthrough={walkthrough.stop}
      />

      {/* Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={enrichedNodes}
          edges={enrichedEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={handleNodeClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onEdgeClick={handleEdgeClick}
          onEdgeMouseEnter={handleEdgeMouseEnter}
          onEdgeMouseLeave={handleEdgeMouseLeave}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={false}
          nodesConnectable={false}
          defaultEdgeOptions={{ type: "animated" }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <SwimLaneBackground />
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(255,255,255,0.04)"
          />
          <Controls
            showInteractive={false}
            position="bottom-left"
            className="!bottom-4 !left-4"
          />
          <MiniMap
            position="bottom-left"
            className="!bottom-20 !left-4"
            nodeColor={(node) => {
              const dept = (node.data as SystemNodeData)?.department;
              return dept ? DEPARTMENT_COLORS[dept] ?? "#64748b" : "#64748b";
            }}
            maskColor="rgba(10, 14, 26, 0.85)"
            style={{
              width: 160,
              height: 100,
            }}
          />
          <Legend />
        </ReactFlow>

        {/* Walkthrough overlay */}
        {walkthrough.isPlaying && (
          <WalkthroughOverlay
            flowType={walkthrough.currentFlowType!}
            currentStep={walkthrough.currentStepIndex}
            totalSteps={walkthrough.totalSteps}
            currentNodeLabel={walkthrough.activeNodeLabel}
            onStop={walkthrough.stop}
          />
        )}

        {/* Edge tooltip */}
        {edgeTooltip && <EdgeTooltip {...edgeTooltip} />}

        {/* Detail Panels */}
        <NodeDetailPanel
          nodeId={selectedNodeId}
          open={isDetailOpen}
          onClose={closePanel}
        />
        <EdgeDetailPanel
          edgeId={selectedEdgeId}
          open={isEdgeDetailOpen}
          onClose={closeEdgePanel}
        />
      </div>
    </div>
  );
}

export function FlowCanvas() {
  return (
    <ReactFlowProvider>
      <FlowCanvasInner />
    </ReactFlowProvider>
  );
}
