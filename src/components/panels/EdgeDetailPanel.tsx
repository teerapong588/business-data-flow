"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { edges } from "@/data/edges";
import { nodes } from "@/data/nodes";
import { departmentMap } from "@/data/departments";
import { flowTypes } from "@/data/flow-types";
import type { DataEdgeData, SystemNodeData } from "@/types/flow";
import { ArrowRight, Clock, Radio } from "lucide-react";

interface EdgeDetailPanelProps {
  edgeId: string | null;
  open: boolean;
  onClose: () => void;
}

export function EdgeDetailPanel({ edgeId, open, onClose }: EdgeDetailPanelProps) {
  if (!edgeId) return null;

  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return null;

  const data = edge.data as DataEdgeData;
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  const sourceData = sourceNode?.data as SystemNodeData | undefined;
  const targetData = targetNode?.data as SystemNodeData | undefined;
  const sourceDept = departmentMap[sourceData?.department ?? "technology"];
  const targetDept = departmentMap[targetData?.department ?? "technology"];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        className="w-[380px] border-l border-white/10 bg-[#0c1225]/95 backdrop-blur-xl p-0"
        style={{ ["--sheet-overlay-bg" as string]: "transparent" }}
      >
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-6 rounded-sm"
              style={{
                background: `linear-gradient(180deg, ${sourceDept?.color ?? "#64748b"}, ${targetDept?.color ?? "#64748b"})`,
              }}
            />
            <SheetTitle className="text-white text-lg font-semibold">
              {data.label}
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] px-6">
          {/* Description */}
          <p className="text-white/60 text-xs leading-relaxed mb-5">
            {data.dataDescription}
          </p>

          <Separator className="bg-white/[0.06] mb-5" />

          {/* Metadata */}
          <div className="space-y-4 mb-5">
            <MetaRow icon={Clock} label="Frequency" value={data.frequency} />
            <MetaRow icon={Radio} label="Protocol" value={data.protocol} />
          </div>

          <Separator className="bg-white/[0.06] mb-5" />

          {/* Source → Target */}
          <div className="mb-5">
            <h4 className="text-white/50 text-[10px] uppercase tracking-wider font-medium mb-3">
              Connection
            </h4>
            <div className="flex items-center gap-3 bg-white/[0.03] rounded-lg p-3">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: sourceDept?.color }}
                  />
                  <span className="text-[11px] text-white/80 font-medium">
                    {sourceData?.label ?? edge.source}
                  </span>
                </div>
                <span className="text-[9px] text-white/30">
                  {sourceDept?.label}
                </span>
              </div>
              <ArrowRight size={14} className="text-white/20" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: targetDept?.color }}
                  />
                  <span className="text-[11px] text-white/80 font-medium">
                    {targetData?.label ?? edge.target}
                  </span>
                </div>
                <span className="text-[9px] text-white/30">
                  {targetDept?.label}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/[0.06] mb-5" />

          {/* Flow Types */}
          <div className="mb-8">
            <h4 className="text-white/50 text-[10px] uppercase tracking-wider font-medium mb-2">
              Flow Types
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {data.flowTypes.map((ft) => {
                const ftConfig = flowTypes.find((f) => f.id === ft);
                return (
                  <Badge
                    key={ft}
                    variant="outline"
                    className="text-[9px] text-white/60 border-white/10 bg-white/[0.03]"
                  >
                    {ftConfig?.label ?? ft}
                  </Badge>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/[0.04] shrink-0">
        <Icon size={12} className="text-white/40" />
      </div>
      <div>
        <p className="text-white/40 text-[10px] uppercase tracking-wider">{label}</p>
        <p className="text-white/80 text-xs">{value}</p>
      </div>
    </div>
  );
}
