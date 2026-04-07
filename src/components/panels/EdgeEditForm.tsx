"use client";

import React, { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFlowStore, useDepartmentMap } from "@/store/useFlowStore";
import type { DataEdgeData, SystemNodeData } from "@/types/flow";
import { Trash2, ArrowRight } from "lucide-react";

interface EdgeEditFormProps {
  edgeId: string;
  open: boolean;
  onClose: () => void;
}

export function EdgeEditForm({ edgeId, open, onClose }: EdgeEditFormProps) {
  const edges = useFlowStore((s) => s.edges);
  const nodes = useFlowStore((s) => s.nodes);
  const flowTypes = useFlowStore((s) => s.flowTypes);
  const updateEdge = useFlowStore((s) => s.updateEdge);
  const deleteEdge = useFlowStore((s) => s.deleteEdge);
  const departmentMap = useDepartmentMap();

  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return null;

  const data = edge.data as DataEdgeData;
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  const sourceData = sourceNode?.data as SystemNodeData | undefined;
  const targetData = targetNode?.data as SystemNodeData | undefined;
  const sourceDept = departmentMap[sourceData?.department ?? ""];
  const targetDept = departmentMap[targetData?.department ?? ""];

  return (
    <EdgeEditFormInner
      key={edgeId}
      edgeId={edgeId}
      data={data}
      sourceLabel={sourceData?.label ?? edge.source}
      targetLabel={targetData?.label ?? edge.target}
      sourceColor={sourceDept?.color ?? "#64748b"}
      targetColor={targetDept?.color ?? "#64748b"}
      sourceDeptLabel={sourceDept?.label}
      targetDeptLabel={targetDept?.label}
      flowTypes={flowTypes}
      updateEdge={updateEdge}
      deleteEdge={deleteEdge}
      open={open}
      onClose={onClose}
    />
  );
}

function EdgeEditFormInner({
  edgeId,
  data,
  sourceLabel,
  targetLabel,
  sourceColor,
  targetColor,
  sourceDeptLabel,
  targetDeptLabel,
  flowTypes,
  updateEdge,
  deleteEdge,
  open,
  onClose,
}: {
  edgeId: string;
  data: DataEdgeData;
  sourceLabel: string;
  targetLabel: string;
  sourceColor: string;
  targetColor: string;
  sourceDeptLabel?: string;
  targetDeptLabel?: string;
  flowTypes: { id: string; label: string }[];
  updateEdge: (id: string, data: Partial<DataEdgeData>) => void;
  deleteEdge: (id: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const [label, setLabel] = useState(data.label ?? "");
  const [dataDescription, setDataDescription] = useState(data.dataDescription ?? "");
  const [frequency, setFrequency] = useState(data.frequency ?? "");
  const [protocol, setProtocol] = useState(data.protocol ?? "");
  const [owner, setOwner] = useState(data.owner ?? "");
  const [selectedFlowTypes, setSelectedFlowTypes] = useState<string[]>(data.flowTypes ?? []);

  const toggleFlowType = (ftId: string) => {
    setSelectedFlowTypes((prev) =>
      prev.includes(ftId) ? prev.filter((id) => id !== ftId) : [...prev, ftId]
    );
  };

  const handleSave = useCallback(() => {
    updateEdge(edgeId, {
      label: label.trim(),
      dataDescription: dataDescription.trim(),
      frequency: frequency.trim(),
      protocol: protocol.trim(),
      owner: owner.trim(),
      flowTypes: selectedFlowTypes,
    });
    onClose();
  }, [edgeId, label, dataDescription, frequency, protocol, owner, selectedFlowTypes, updateEdge, onClose]);

  const handleDelete = () => {
    deleteEdge(edgeId);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        className="w-[380px] border-l border-white/10 bg-[#0c1225]/95 backdrop-blur-xl p-0"
        style={{ ["--sheet-overlay-bg" as string]: "transparent" }}
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-white text-lg font-semibold">
            Edit Connection
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] px-6">
          <div className="space-y-4 pb-8">
            {/* Source → Target */}
            <div className="flex items-center gap-3 bg-white/[0.03] rounded-lg p-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sourceColor }} />
                  <span className="text-[11px] text-white/80 font-medium">{sourceLabel}</span>
                </div>
                <span className="text-[9px] text-white/30">{sourceDeptLabel}</span>
              </div>
              <ArrowRight size={14} className="text-white/20" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: targetColor }} />
                  <span className="text-[11px] text-white/80 font-medium">{targetLabel}</span>
                </div>
                <span className="text-[9px] text-white/30">{targetDeptLabel}</span>
              </div>
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Label */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">Label</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Market Data → OMS"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">Data Description</Label>
              <Textarea
                value={dataDescription}
                onChange={(e) => setDataDescription(e.target.value)}
                placeholder="What data flows through this connection..."
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs min-h-[60px]"
              />
            </div>

            {/* Frequency */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">Frequency</Label>
              <Input
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g., Real-time, Daily batch"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            {/* Protocol */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">Protocol</Label>
              <Input
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="e.g., FIX 4.4, REST API"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            {/* Owner */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">Owner / Responsible</Label>
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g., Trading Desk, John Smith, IT Ops"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Flow Types */}
            {flowTypes.length > 0 && (
              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-wider">Flow Types</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {flowTypes.map((ft) => (
                    <button
                      key={ft.id}
                      onClick={() => toggleFlowType(ft.id)}
                      className={`
                        px-2.5 py-1 rounded-full text-[10px] border transition-all
                        ${
                          selectedFlowTypes.includes(ft.id)
                            ? "border-white/20 bg-white/[0.08] text-white/80"
                            : "border-white/[0.06] text-white/40 hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-white/[0.06]" />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                Save Changes
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70 text-xs"
              >
                Cancel
              </Button>
            </div>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-[10px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all mt-2"
            >
              <Trash2 size={10} />
              Delete Connection
            </button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
