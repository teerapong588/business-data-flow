"use client";

import React, { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import type { DataSchema } from "@/types/flow";
import { ChevronDown, ChevronRight, Route, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SchemaCardProps {
  schema: DataSchema;
  nodeId: string;
  color: string;
  editable?: boolean;
}

export function SchemaCard({ schema, nodeId, color, editable }: SchemaCardProps) {
  const [expanded, setExpanded] = useState(true);
  const setTracedField = useFlowStore((s) => s.setTracedField);
  const router = useRouter();

  const handleTrace = (fieldId: string) => {
    setTracedField({ nodeId, schemaId: schema.id, fieldId });
    router.push("/");
  };

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      {/* Schema header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left transition-colors hover:bg-white/[0.02]"
        style={{ backgroundColor: `${color}08` }}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown size={12} className="text-white/40" />
          ) : (
            <ChevronRight size={12} className="text-white/40" />
          )}
          <span className="text-[12px] font-semibold text-white/90">
            {schema.name}
          </span>
        </div>
        <span className="text-[10px] text-white/30">
          {schema.fields.length} fields
        </span>
      </button>

      {/* Fields table */}
      {expanded && (
        <div className="border-t" style={{ borderColor: `${color}15` }}>
          {/* Table header */}
          <div className="flex items-center px-4 py-1.5 text-[9px] text-white/30 uppercase tracking-wider border-b border-white/[0.04]">
            <span className="flex-1">Name</span>
            <span className="w-20">Type</span>
            <span className="w-8 text-center">Req</span>
            <span className="w-12"></span>
          </div>

          {/* Field rows */}
          {schema.fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center px-4 py-1.5 text-[11px] hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0"
            >
              <span className="flex-1 text-white/70 font-mono text-[10px]">
                {field.name}
              </span>
              <span className="w-20 text-white/40 text-[10px]">
                {field.type}
              </span>
              <span className="w-8 flex justify-center">
                <Circle
                  size={6}
                  className={field.required ? "fill-blue-400 text-blue-400" : "text-white/15"}
                />
              </span>
              <span className="w-12 flex justify-end">
                <button
                  onClick={() => handleTrace(field.id)}
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] text-white/30 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  title={`Trace ${field.name} across the flow`}
                >
                  <Route size={8} />
                  Trace
                </button>
              </span>
            </div>
          ))}

          {schema.fields.length === 0 && (
            <div className="px-4 py-3 text-[10px] text-white/20 text-center">
              No fields defined
            </div>
          )}
        </div>
      )}
    </div>
  );
}
