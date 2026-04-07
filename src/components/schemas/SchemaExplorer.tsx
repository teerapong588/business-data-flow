"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useFlowStore, useDepartmentMap } from "@/store/useFlowStore";
import { getNodeSchemas } from "@/lib/schema-utils";
import { SchemaCard } from "./SchemaCard";
import { EdgeMappingViewer } from "./EdgeMappingViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { SystemNodeData, DataEdgeData } from "@/types/flow";
import { ArrowLeft, Search, Database, Plus, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SchemaExplorer() {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const departments = useFlowStore((s) => s.departments);
  const functions = useFlowStore((s) => s.functions);
  const editMode = useFlowStore((s) => s.editMode);
  const setEditMode = useFlowStore((s) => s.setEditMode);
  const departmentMap = useDepartmentMap();
  const isEditMode = editMode === "edit";

  const searchParams = useSearchParams();
  const nodeParam = searchParams.get("node");

  const router = useRouter();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodeParam);
  const [searchQuery, setSearchQuery] = useState("");

  const selectNode = (id: string) => {
    setSelectedNodeId(id);
    router.replace(`/schemas?node=${id}`, { scroll: false });
  };

  // Update selection when URL param changes
  useEffect(() => {
    if (nodeParam) setSelectedNodeId(nodeParam);
  }, [nodeParam]);

  // Group nodes by department
  const nodesByDept = useMemo(() => {
    const groups = new Map<string, typeof nodes>();
    for (const node of nodes) {
      const dept = (node.data as SystemNodeData).department;
      if (!groups.has(dept)) groups.set(dept, []);
      groups.get(dept)!.push(node);
    }
    return groups;
  }, [nodes]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedData = selectedNode?.data as SystemNodeData | undefined;
  const selectedSchemas = selectedData ? getNodeSchemas(selectedData) : [];
  const selectedDept = selectedData ? departmentMap[selectedData.department] : undefined;

  // Edges connected to selected node
  const connectedEdges = useMemo(() => {
    if (!selectedNodeId) return { outgoing: [], incoming: [] };
    return {
      outgoing: edges.filter((e) => e.source === selectedNodeId),
      incoming: edges.filter((e) => e.target === selectedNodeId),
    };
  }, [selectedNodeId, edges]);

  // Search across all nodes and their schemas/fields
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    const results: { nodeId: string; nodeLabel: string; schemaName: string; fieldName?: string }[] = [];
    for (const node of nodes) {
      const data = node.data as SystemNodeData;
      const schemas = getNodeSchemas(data);
      for (const schema of schemas) {
        if (schema.name.toLowerCase().includes(q)) {
          results.push({ nodeId: node.id, nodeLabel: data.label, schemaName: schema.name });
        }
        for (const field of schema.fields) {
          if (field.name.toLowerCase().includes(q) || field.id.toLowerCase().includes(q)) {
            results.push({ nodeId: node.id, nodeLabel: data.label, schemaName: schema.name, fieldName: field.name });
          }
        }
      }
    }
    return results;
  }, [searchQuery, nodes]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0e1a]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/50 hover:text-white/70 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="text-[11px]">Canvas</span>
          </Link>
          <Separator orientation="vertical" className="h-5 bg-white/[0.08]" />
          <div>
            <h1 className="text-lg font-semibold text-white/90 tracking-tight">
              Data Models
            </h1>
            <p className="text-[11px] text-white/30">
              Explore schemas and field mappings across all systems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] w-64">
            <Search size={12} className="text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemas and fields..."
              className="bg-transparent text-[11px] text-white/80 placeholder:text-white/25 outline-none w-full"
            />
          </div>

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
        </div>
      </div>

      {/* Search results dropdown */}
      {searchResults && searchResults.length > 0 && (
        <div className="px-6 py-2 bg-[#0c1225]/90 border-b border-white/[0.06]">
          <p className="text-[10px] text-white/40 mb-2">{searchResults.length} results</p>
          <div className="flex flex-wrap gap-1.5">
            {searchResults.slice(0, 10).map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  selectNode(r.nodeId);
                  setSearchQuery("");
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-white/60 hover:bg-white/[0.08] transition-colors"
              >
                <span className="text-white/80">{r.nodeLabel}</span>
                <span className="text-white/30">/</span>
                <span>{r.schemaName}</span>
                {r.fieldName && (
                  <>
                    <span className="text-white/30">.</span>
                    <span className="text-blue-400">{r.fieldName}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — system list */}
        <div className="w-64 border-r border-white/[0.06] flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-white/[0.06] shrink-0">
            <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
              Systems
            </span>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="py-2">
              {departments.map((dept) => {
                const deptNodes = nodesByDept.get(dept.id) ?? [];
                if (deptNodes.length === 0) return null;
                const deptFunctions = functions.filter((f) => f.departmentId === dept.id);

                // Group nodes by function
                const nodesByFn = new Map<string, typeof deptNodes>();
                const ungrouped: typeof deptNodes = [];
                for (const node of deptNodes) {
                  const fnId = (node.data as SystemNodeData).function;
                  if (fnId) {
                    if (!nodesByFn.has(fnId)) nodesByFn.set(fnId, []);
                    nodesByFn.get(fnId)!.push(node);
                  } else {
                    ungrouped.push(node);
                  }
                }

                return (
                  <div key={dept.id} className="mb-3">
                    <div className="px-4 py-1">
                      <span
                        className="text-[9px] uppercase tracking-wider font-semibold"
                        style={{ color: dept.color }}
                      >
                        {dept.label}
                      </span>
                    </div>
                    {deptFunctions.map((fn) => {
                      const fnNodes = nodesByFn.get(fn.id);
                      if (!fnNodes || fnNodes.length === 0) return null;
                      return (
                        <div key={fn.id}>
                          <div className="px-6 py-1">
                            <span
                              className="text-[8px] uppercase tracking-wider font-medium"
                              style={{ color: `${fn.color}90` }}
                            >
                              {fn.label}
                            </span>
                          </div>
                          {fnNodes.map((node) => {
                            const data = node.data as SystemNodeData;
                            const schemas = getNodeSchemas(data);
                            const isSelected = selectedNodeId === node.id;
                            return (
                              <button
                                key={node.id}
                                onClick={() => selectNode(node.id)}
                                className={`
                                  flex items-center justify-between w-full pl-8 pr-4 py-1.5 text-left transition-colors
                                  ${isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}
                                `}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="w-1 h-1 rounded-full shrink-0"
                                    style={{ backgroundColor: fn.color }}
                                  />
                                  <span
                                    className={`text-[10px] truncate ${isSelected ? "text-white/90 font-medium" : "text-white/55"}`}
                                  >
                                    {data.label}
                                  </span>
                                </div>
                                {schemas.length > 0 && (
                                  <span className="text-[9px] text-white/25 shrink-0 ml-2">
                                    {schemas.length}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                    {ungrouped.map((node) => {
                      const data = node.data as SystemNodeData;
                      const schemas = getNodeSchemas(data);
                      const isSelected = selectedNodeId === node.id;
                      return (
                        <button
                          key={node.id}
                          onClick={() => selectNode(node.id)}
                          className={`
                            flex items-center justify-between w-full px-6 py-1.5 text-left transition-colors
                            ${isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}
                          `}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-1 h-1 rounded-full shrink-0"
                              style={{ backgroundColor: dept.color }}
                            />
                            <span
                              className={`text-[10px] truncate ${isSelected ? "text-white/90 font-medium" : "text-white/55"}`}
                            >
                              {data.label}
                            </span>
                          </div>
                          {schemas.length > 0 && (
                            <span className="text-[9px] text-white/25 shrink-0 ml-2">
                              {schemas.length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Center — schema detail */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {selectedNode && selectedData ? (
            <>
              {/* Selected system header */}
              <div className="px-6 py-4 border-b border-white/[0.06] shrink-0">
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="w-3 h-8 rounded-sm"
                    style={{ backgroundColor: selectedDept?.color ?? "#64748b" }}
                  />
                  <div>
                    <h2 className="text-white text-lg font-semibold">
                      {selectedData.label}
                    </h2>
                    <p className="text-white/40 text-xs">{selectedData.systemName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] border-0"
                    style={{
                      backgroundColor: `${selectedDept?.color ?? "#64748b"}20`,
                      color: selectedDept?.color,
                    }}
                  >
                    {selectedDept?.label}
                  </Badge>
                  <span className="flex items-center gap-1 text-[10px] text-white/40">
                    <Database size={10} />
                    {selectedSchemas.length} schemas
                  </span>
                </div>
              </div>

              <ScrollArea className="flex-1 min-h-0 px-6 py-4">
                {selectedSchemas.length > 0 ? (
                  <div className="space-y-4 pb-8">
                    {selectedSchemas.map((schema) => (
                      <SchemaCard
                        key={schema.id}
                        schema={schema}
                        nodeId={selectedNodeId!}
                        color={selectedDept?.color ?? "#64748b"}
                        editable={editMode === "edit"}
                      />
                    ))}
                    {editMode === "edit" && (
                      <AddSchemaButton nodeId={selectedNodeId!} />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-white/30">
                    <Database size={32} className="mb-3" />
                    <p className="text-sm">No schemas defined</p>
                    {editMode === "edit" ? (
                      <AddSchemaButton nodeId={selectedNodeId!} />
                    ) : (
                      <p className="text-[11px] mt-1">
                        Switch to edit mode to add schemas
                      </p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-white/30">
              <Database size={40} className="mb-3" />
              <p className="text-sm">Select a system to view its data models</p>
            </div>
          )}
        </div>

        {/* Right panel — connections */}
        {selectedNode && (
          <div className="w-72 border-l border-white/[0.06] flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-white/[0.06] shrink-0">
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
                Connections
              </span>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <EdgeMappingViewer
                outgoingEdges={connectedEdges.outgoing}
                incomingEdges={connectedEdges.incoming}
                sourceNodeId={selectedNodeId!}
                nodes={nodes}
              />
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}

function AddSchemaButton({ nodeId }: { nodeId: string }) {
  const addSchema = useFlowStore((s) => s.addSchema);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    addSchema(nodeId, { id: `${id}-${Date.now()}`, name: name.trim(), fields: [] });
    setName("");
    setAdding(false);
  };

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="flex items-center gap-1.5 px-3 py-2 mt-2 rounded-lg text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
      >
        <Plus size={10} />
        Add Schema
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Schema name..."
        className="flex-1 text-[11px] text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 outline-none focus:border-blue-400/50 placeholder:text-white/20"
        autoFocus
      />
      <button
        onClick={handleAdd}
        disabled={!name.trim()}
        className="px-3 py-2 rounded-lg text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-30"
      >
        Add
      </button>
      <button
        onClick={() => { setAdding(false); setName(""); }}
        className="px-2 py-2 rounded-lg text-[10px] text-white/40 hover:text-white/60 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
