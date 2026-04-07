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
  type Connection,
  type NodeChange,
  applyNodeChanges,
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
import { EditToolbar } from "@/components/panels/EditToolbar";
import { useFlowStore, useDepartmentMap, useFunctionMap } from "@/store/useFlowStore";
import { useFlowWalkthrough } from "@/hooks/useFlowWalkthrough";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { FieldTraceOverlay } from "@/components/panels/FieldTraceOverlay";
import type { SystemNodeData, DataEdgeData, DataFlowEdge } from "@/types/flow";
import { traceFieldThroughGraph } from "@/lib/schema-utils";
import { Eye, Pencil, Database } from "lucide-react";
import Link from "next/link";

function FlowCanvasInner() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // Store
  const allNodes = useFlowStore((s) => s.nodes);
  const allEdges = useFlowStore((s) => s.edges);
  const flowPaths = useFlowStore((s) => s.flowPaths);
  const editMode = useFlowStore((s) => s.editMode);
  const setEditMode = useFlowStore((s) => s.setEditMode);
  const storeAddEdge = useFlowStore((s) => s.addEdge);
  const storeUpdateNodePosition = useFlowStore((s) => s.updateNodePosition);
  const storeDeleteNode = useFlowStore((s) => s.deleteNode);
  const storeDeleteEdge = useFlowStore((s) => s.deleteEdge);
  const tracedField = useFlowStore((s) => s.tracedField);
  const setTracedField = useFlowStore((s) => s.setTracedField);
  const departmentMap = useDepartmentMap();
  const functionMap = useFunctionMap();
  const isEditMode = editMode === "edit";

  // Field tracing
  const tracedPath = useMemo(() => {
    if (!tracedField) return null;
    return traceFieldThroughGraph(
      tracedField.nodeId,
      tracedField.schemaId,
      tracedField.fieldId,
      allNodes,
      allEdges
    );
  }, [tracedField, allNodes, allEdges]);

  const tracedNodeIds = useMemo(
    () => (tracedPath ? new Set(tracedPath.map((p) => p.nodeId)) : null),
    [tracedPath]
  );
  const tracedEdgeIds = useMemo(
    () =>
      tracedPath
        ? new Set(tracedPath.filter((p) => p.edgeId).map((p) => p.edgeId!))
        : null,
    [tracedPath]
  );

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

  // Enrich nodes with freshness data + focused/walkthrough state + department config
  const enrichedNodes = useMemo(() => {
    return filteredNodes.map((node) => {
      const freshness = freshnessMap.get(node.id);
      const nodeData = node.data as SystemNodeData;
      const deptConfig = departmentMap[nodeData.department];
      const fnConfig = nodeData.function ? functionMap[nodeData.function] : undefined;
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

      // Field tracing: highlight traced nodes, dim others
      if (tracedNodeIds) {
        if (tracedNodeIds.has(node.id)) {
          className = "walkthrough-active";
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
          departmentConfig: deptConfig,
          functionConfig: fnConfig,
        },
      };
    });
  }, [filteredNodes, freshnessMap, focusedNodeId, walkthrough.isPlaying, walkthrough.activeNodeId, walkthrough.visitedNodeIds, departmentMap, functionMap, tracedNodeIds]);

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

      // Field tracing
      if (tracedEdgeIds) {
        if (tracedEdgeIds.has(edge.id)) {
          className = "highlighted";
        } else {
          className = "dimmed";
        }
      }

      return { ...edge, className: className.trim() };
    });
  }, [filteredEdges, walkthrough.isPlaying, walkthrough.activeEdgeId, walkthrough.visitedEdgeIds, tracedEdgeIds]);

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

  // Handle connection creation in edit mode
  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!isEditMode || !connection.source || !connection.target) return;
      const newEdge: DataFlowEdge = {
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        data: {
          label: "New Connection",
          dataDescription: "",
          frequency: "",
          protocol: "",
          flowTypes: [],
        },
      };
      storeAddEdge(newEdge);
      // Open edge detail panel for the new edge
      closePanel();
      onEdgeClick({} as React.MouseEvent, newEdge as Edge);
    },
    [isEditMode, storeAddEdge, closePanel, onEdgeClick]
  );

  // Handle node position changes in edit mode
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (!isEditMode) return;
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          storeUpdateNodePosition(change.id, change.position);
        }
      });
    },
    [isEditMode, storeUpdateNodePosition]
  );

  // Handle delete key in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        // Don't delete if user is typing in an input
        if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return;
        if (selectedNodeId && isDetailOpen) {
          storeDeleteNode(selectedNodeId);
          closePanel();
        } else if (selectedEdgeId && isEdgeDetailOpen) {
          storeDeleteEdge(selectedEdgeId);
          closeEdgePanel();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, selectedNodeId, selectedEdgeId, isDetailOpen, isEdgeDetailOpen, storeDeleteNode, storeDeleteEdge, closePanel, closeEdgePanel]);

  // Track mouse position globally and auto-dismiss tooltip
  useEffect(() => {
    if (!edgeTooltip) return;

    const handleMouseMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isOverEdge = el?.closest('.react-flow__edge') !== null;
      if (!isOverEdge) {
        setEdgeTooltip(null);
      }
    };

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
      <div
        className="flex items-center justify-between px-6 py-4 border-b transition-colors"
        style={{
          borderColor: isEditMode ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <h1 className="text-lg font-semibold text-white/90 tracking-tight">
            Asset Management Data Flow
          </h1>
          <p className="text-[11px] text-white/30">
            Interactive visualization of business data flows across systems
          </p>
        </div>

        {/* Search + Edit Toggle + Export + Live */}
        <div className="flex items-center gap-3">
          <SearchBar
            nodes={allNodes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectNode={handleSearchSelect}
          />

          {/* Edit Mode Toggle */}
          <button
            onClick={() => setEditMode(isEditMode ? "view" : "edit")}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
              border transition-all duration-200
              ${
                isEditMode
                  ? "border-blue-500/40 bg-blue-500/15 text-blue-400"
                  : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.06]"
              }
            `}
          >
            {isEditMode ? <Pencil size={12} /> : <Eye size={12} />}
            {isEditMode ? "Editing" : "View"}
          </button>

          <Link
            href="/schemas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.06] transition-all duration-200"
          >
            <Database size={12} />
            Schemas
          </Link>

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

      {/* Edit Toolbar */}
      {isEditMode && (
        <EditToolbar
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          onDeleteNode={() => {
            if (selectedNodeId) {
              storeDeleteNode(selectedNodeId);
              closePanel();
            }
          }}
          onDeleteEdge={() => {
            if (selectedEdgeId) {
              storeDeleteEdge(selectedEdgeId);
              closeEdgePanel();
            }
          }}
        />
      )}

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
          onConnect={isEditMode ? handleConnect : undefined}
          onNodesChange={isEditMode ? handleNodesChange : undefined}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={isEditMode}
          nodesConnectable={isEditMode}
          snapToGrid={isEditMode}
          snapGrid={[40, 40]}
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
              return dept ? departmentMap[dept]?.color ?? "#64748b" : "#64748b";
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

        {/* Field trace overlay */}
        {tracedField && tracedPath && (
          <FieldTraceOverlay
            tracedPath={tracedPath}
            onStop={() => setTracedField(null)}
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
