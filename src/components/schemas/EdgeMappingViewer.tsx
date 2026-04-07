"use client";

import React from "react";
import { getNodeSchemas } from "@/lib/schema-utils";
import { useDepartmentMap } from "@/store/useFlowStore";
import type { DataFlowEdge, SystemFlowNode, SystemNodeData, DataEdgeData } from "@/types/flow";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface EdgeMappingViewerProps {
  outgoingEdges: DataFlowEdge[];
  incomingEdges: DataFlowEdge[];
  sourceNodeId: string;
  nodes: SystemFlowNode[];
}

export function EdgeMappingViewer({
  outgoingEdges,
  incomingEdges,
  sourceNodeId,
  nodes,
}: EdgeMappingViewerProps) {
  const departmentMap = useDepartmentMap();
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const getNodeInfo = (nodeId: string) => {
    const node = nodeMap.get(nodeId);
    if (!node) return { label: nodeId, color: "#64748b" };
    const data = node.data as SystemNodeData;
    const dept = departmentMap[data.department];
    return { label: data.label, color: dept?.color ?? "#64748b", schemas: getNodeSchemas(data) };
  };

  const sourceInfo = getNodeInfo(sourceNodeId);
  const sourceSchemas = sourceInfo.schemas ?? [];

  return (
    <div className="p-4 space-y-4">
      {/* Outgoing */}
      {outgoingEdges.length > 0 && (
        <div>
          <h4 className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-2 flex items-center gap-1">
            <ArrowRight size={10} />
            Outgoing ({outgoingEdges.length})
          </h4>
          <div className="space-y-2">
            {outgoingEdges.map((edge) => {
              const edgeData = edge.data as DataEdgeData;
              const targetInfo = getNodeInfo(edge.target);
              const mappings = edgeData?.fieldMappings ?? [];

              return (
                <div
                  key={edge.id}
                  className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: targetInfo.color }}
                    />
                    <span className="text-[11px] text-white/80 font-medium">
                      {targetInfo.label}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/30 mb-2">
                    {edgeData?.label}
                  </p>

                  {mappings.length > 0 ? (
                    <div className="space-y-1.5">
                      {mappings.map((m, i) => {
                        const schema = sourceSchemas.find(
                          (s) => s.id === m.sourceSchemaId
                        );
                        const fieldNames =
                          m.sourceFieldIds.length > 0
                            ? m.sourceFieldIds
                                .map((fid) => schema?.fields.find((f) => f.id === fid)?.name ?? fid)
                                .join(", ")
                            : "All fields";

                        return (
                          <div
                            key={i}
                            className="text-[9px] bg-white/[0.02] rounded px-2 py-1.5"
                          >
                            <span className="text-blue-400 font-medium">
                              {schema?.name ?? m.sourceSchemaId}
                            </span>
                            {m.targetSchemaId && (
                              <span className="text-white/30">
                                {" → "}
                                {m.targetSchemaId}
                              </span>
                            )}
                            <p className="text-white/30 mt-0.5">{fieldNames}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[9px] text-white/20 italic">
                      No field mappings defined
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Incoming */}
      {incomingEdges.length > 0 && (
        <div>
          <h4 className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-2 flex items-center gap-1">
            <ArrowLeft size={10} />
            Incoming ({incomingEdges.length})
          </h4>
          <div className="space-y-2">
            {incomingEdges.map((edge) => {
              const edgeData = edge.data as DataEdgeData;
              const srcInfo = getNodeInfo(edge.source);
              const mappings = edgeData?.fieldMappings ?? [];
              const srcSchemas = srcInfo.schemas ?? [];

              return (
                <div
                  key={edge.id}
                  className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: srcInfo.color }}
                    />
                    <span className="text-[11px] text-white/80 font-medium">
                      {srcInfo.label}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/30 mb-2">
                    {edgeData?.label}
                  </p>

                  {mappings.length > 0 ? (
                    <div className="space-y-1.5">
                      {mappings.map((m, i) => {
                        const schema = srcSchemas.find(
                          (s) => s.id === m.sourceSchemaId
                        );
                        const fieldNames =
                          m.sourceFieldIds.length > 0
                            ? m.sourceFieldIds
                                .map((fid) => schema?.fields.find((f) => f.id === fid)?.name ?? fid)
                                .join(", ")
                            : "All fields";

                        return (
                          <div
                            key={i}
                            className="text-[9px] bg-white/[0.02] rounded px-2 py-1.5"
                          >
                            <span className="text-blue-400 font-medium">
                              {schema?.name ?? m.sourceSchemaId}
                            </span>
                            <p className="text-white/30 mt-0.5">{fieldNames}</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[9px] text-white/20 italic">
                      No field mappings defined
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {outgoingEdges.length === 0 && incomingEdges.length === 0 && (
        <p className="text-[10px] text-white/20 text-center py-4">
          No connections
        </p>
      )}
    </div>
  );
}
