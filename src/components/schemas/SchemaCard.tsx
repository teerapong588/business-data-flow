"use client";

import React, { useState } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import type { DataSchema } from "@/types/flow";
import { ChevronDown, ChevronRight, Route, Circle, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SchemaCardProps {
  schema: DataSchema;
  nodeId: string;
  color: string;
  editable?: boolean;
}

const FIELD_TYPES = ["string", "number", "boolean", "date", "object", "array"];

export function SchemaCard({ schema, nodeId, color, editable }: SchemaCardProps) {
  const [expanded, setExpanded] = useState(true);
  const setTracedField = useFlowStore((s) => s.setTracedField);
  const updateSchema = useFlowStore((s) => s.updateSchema);
  const deleteSchema = useFlowStore((s) => s.deleteSchema);
  const addField = useFlowStore((s) => s.addField);
  const updateField = useFlowStore((s) => s.updateField);
  const deleteField = useFlowStore((s) => s.deleteField);
  const router = useRouter();

  const [editingName, setEditingName] = useState(false);
  const [schemaName, setSchemaName] = useState(schema.name);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("string");

  const handleTrace = (fieldId: string) => {
    setTracedField({ nodeId, schemaId: schema.id, fieldId });
    router.push("/");
  };

  const handleSaveSchemaName = () => {
    if (schemaName.trim() && schemaName !== schema.name) {
      updateSchema(nodeId, schema.id, { name: schemaName.trim() });
    }
    setEditingName(false);
  };

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    const fieldId = newFieldName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    addField(nodeId, schema.id, {
      id: `${fieldId}-${Date.now()}`,
      name: newFieldName.trim(),
      type: newFieldType,
      required: false,
    });
    setNewFieldName("");
    setNewFieldType("string");
  };

  const handleDeleteSchema = () => {
    deleteSchema(nodeId, schema.id);
  };

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: `${color}25` }}
    >
      {/* Schema header */}
      <div
        className="flex items-center justify-between w-full px-4 py-2.5 text-left transition-colors hover:bg-white/[0.02]"
        style={{ backgroundColor: `${color}08` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 flex-1"
        >
          {expanded ? (
            <ChevronDown size={12} className="text-white/40" />
          ) : (
            <ChevronRight size={12} className="text-white/40" />
          )}
          {editable && editingName ? (
            <input
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              onBlur={handleSaveSchemaName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveSchemaName()}
              className="text-[12px] font-semibold text-white/90 bg-white/[0.06] border border-white/[0.15] rounded px-2 py-0.5 outline-none focus:border-blue-400/50 w-40"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className="text-[12px] font-semibold text-white/90"
              onDoubleClick={() => editable && setEditingName(true)}
            >
              {schema.name}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">
            {schema.fields.length} fields
          </span>
          {editable && (
            <button
              onClick={handleDeleteSchema}
              className="text-white/20 hover:text-red-400 transition-colors p-0.5"
              title="Delete schema"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Fields table */}
      {expanded && (
        <div className="border-t" style={{ borderColor: `${color}15` }}>
          {/* Table header */}
          <div className="flex items-center px-4 py-1.5 text-[9px] text-white/30 uppercase tracking-wider border-b border-white/[0.04]">
            <span className="flex-1">Name</span>
            <span className="w-20">Type</span>
            <span className="w-8 text-center">Req</span>
            <span className="w-16"></span>
          </div>

          {/* Field rows */}
          {schema.fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center px-4 py-1.5 text-[11px] hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-0 group"
            >
              {editable ? (
                <>
                  <input
                    value={field.name}
                    onChange={(e) =>
                      updateField(nodeId, schema.id, field.id, { name: e.target.value })
                    }
                    className="flex-1 text-white/70 font-mono text-[10px] bg-transparent border-b border-transparent hover:border-white/10 focus:border-blue-400/50 outline-none px-0 py-0.5"
                  />
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(nodeId, schema.id, field.id, { type: e.target.value })
                    }
                    className="w-20 text-white/40 text-[10px] bg-transparent border-b border-transparent hover:border-white/10 focus:border-blue-400/50 outline-none cursor-pointer"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#0c1225] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      updateField(nodeId, schema.id, field.id, { required: !field.required })
                    }
                    className="w-8 flex justify-center"
                  >
                    <Circle
                      size={6}
                      className={
                        field.required
                          ? "fill-blue-400 text-blue-400 cursor-pointer"
                          : "text-white/15 cursor-pointer hover:text-white/30"
                      }
                    />
                  </button>
                  <span className="w-16 flex justify-end gap-1">
                    <button
                      onClick={() => handleTrace(field.id)}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] text-white/30 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title={`Trace ${field.name}`}
                    >
                      <Route size={8} />
                    </button>
                    <button
                      onClick={() => deleteField(nodeId, schema.id, field.id)}
                      className="px-1 py-0.5 rounded text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete field"
                    >
                      <X size={8} />
                    </button>
                  </span>
                </>
              ) : (
                <>
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
                  <span className="w-16 flex justify-end">
                    <button
                      onClick={() => handleTrace(field.id)}
                      className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] text-white/30 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                      title={`Trace ${field.name} across the flow`}
                    >
                      <Route size={8} />
                      Trace
                    </button>
                  </span>
                </>
              )}
            </div>
          ))}

          {schema.fields.length === 0 && !editable && (
            <div className="px-4 py-3 text-[10px] text-white/20 text-center">
              No fields defined
            </div>
          )}

          {/* Add field row (edit mode) */}
          {editable && (
            <div className="flex items-center gap-2 px-4 py-2 border-t border-white/[0.04]">
              <input
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddField()}
                placeholder="Field name..."
                className="flex-1 text-[10px] text-white/70 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 outline-none focus:border-blue-400/50 placeholder:text-white/20"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value)}
                className="text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 outline-none cursor-pointer"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#0c1225] text-white">
                    {t}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddField}
                disabled={!newFieldName.trim()}
                className="flex items-center gap-0.5 px-2 py-1 rounded text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Plus size={8} />
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
