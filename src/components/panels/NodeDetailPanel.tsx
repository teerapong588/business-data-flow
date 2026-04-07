"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFlowStore, useDepartmentMap } from "@/store/useFlowStore";
import { NodeEditForm } from "./NodeEditForm";
import type { SystemNodeData } from "@/types/flow";
import {
  ArrowDownRight,
  ArrowUpLeft,
  Clock,
  Radio,
  Shield,
  User,
} from "lucide-react";

interface NodeDetailPanelProps {
  nodeId: string | null;
  open: boolean;
  onClose: () => void;
}

export function NodeDetailPanel({ nodeId, open, onClose }: NodeDetailPanelProps) {
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const editMode = useFlowStore((s) => s.editMode);
  const departmentMap = useDepartmentMap();

  // In edit mode, show the edit form instead
  if (editMode === "edit" && nodeId && open) {
    return <NodeEditForm mode="edit" nodeId={nodeId} open={open} onClose={onClose} />;
  }

  if (!nodeId) return null;

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const data = node.data as SystemNodeData;
  const dept = departmentMap[data.department];
  const color = dept?.color ?? "#64748b";

  const upstream = edges
    .filter((e) => e.target === nodeId)
    .map((e) => {
      const srcNode = nodes.find((n) => n.id === e.source);
      return {
        id: e.source,
        label: (srcNode?.data as SystemNodeData)?.label ?? e.source,
        edgeLabel: (e.data as Record<string, string>)?.label ?? "",
      };
    });

  const downstream = edges
    .filter((e) => e.source === nodeId)
    .map((e) => {
      const tgtNode = nodes.find((n) => n.id === e.target);
      return {
        id: e.target,
        label: (tgtNode?.data as SystemNodeData)?.label ?? e.target,
        edgeLabel: (e.data as Record<string, string>)?.label ?? "",
      };
    });

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        className="w-[380px] border-l border-white/10 bg-[#0c1225]/95 backdrop-blur-xl p-0"
        style={{ ["--sheet-overlay-bg" as string]: "transparent" }}
      >
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-3 h-8 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <div>
              <SheetTitle className="text-white text-lg font-semibold">
                {data.label}
              </SheetTitle>
              <p className="text-white/40 text-xs">{data.systemName}</p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] px-6">
          {/* Department + Criticality */}
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="secondary"
              className="text-[10px] border-0"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {dept?.label}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] border-0"
              style={{
                backgroundColor:
                  data.criticality === "high"
                    ? "rgba(239,68,68,0.15)"
                    : data.criticality === "medium"
                      ? "rgba(245,158,11,0.15)"
                      : "rgba(34,197,94,0.15)",
                color:
                  data.criticality === "high"
                    ? "#ef4444"
                    : data.criticality === "medium"
                      ? "#f59e0b"
                      : "#22c55e",
              }}
            >
              {data.criticality} criticality
            </Badge>
          </div>

          {/* Description */}
          <p className="text-white/60 text-xs leading-relaxed mb-5">
            {data.description}
          </p>

          <Separator className="bg-white/[0.06] mb-5" />

          {/* Metadata Grid */}
          <div className="space-y-4 mb-5">
            <MetaRow icon={User} label="Owner" value={data.owner} />
            <MetaRow icon={Clock} label="Schedule" value={data.schedule} />
            <MetaRow icon={Radio} label="Protocol" value={data.protocol} />
          </div>

          <Separator className="bg-white/[0.06] mb-5" />

          {/* Data Types */}
          <div className="mb-5">
            <h4 className="text-white/50 text-[10px] uppercase tracking-wider font-medium mb-2">
              Data Types
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {data.dataTypes.map((dt) => (
                <Badge
                  key={dt}
                  variant="outline"
                  className="text-[9px] text-white/60 border-white/10 bg-white/[0.03]"
                >
                  {dt}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-white/[0.06] mb-5" />

          {/* Connections */}
          <div className="mb-5">
            <h4 className="text-white/50 text-[10px] uppercase tracking-wider font-medium mb-3">
              <ArrowUpLeft size={10} className="inline mr-1" />
              Upstream ({upstream.length})
            </h4>
            <div className="space-y-2">
              {upstream.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-2 text-xs text-white/50 bg-white/[0.03] rounded-lg px-3 py-2"
                >
                  <ArrowUpLeft size={10} className="text-white/30 shrink-0" />
                  <span className="text-white/70">{u.label}</span>
                </div>
              ))}
              {upstream.length === 0 && (
                <p className="text-white/30 text-[10px]">No upstream systems</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-white/50 text-[10px] uppercase tracking-wider font-medium mb-3">
              <ArrowDownRight size={10} className="inline mr-1" />
              Downstream ({downstream.length})
            </h4>
            <div className="space-y-2">
              {downstream.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center gap-2 text-xs text-white/50 bg-white/[0.03] rounded-lg px-3 py-2"
                >
                  <ArrowDownRight size={10} className="text-white/30 shrink-0" />
                  <span className="text-white/70">{d.label}</span>
                </div>
              ))}
              {downstream.length === 0 && (
                <p className="text-white/30 text-[10px]">No downstream systems</p>
              )}
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
