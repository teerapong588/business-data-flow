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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFlowStore } from "@/store/useFlowStore";
import type { SystemFlowNode, SystemNodeData } from "@/types/flow";
import { Trash2, X, Plus } from "lucide-react";

interface NodeEditFormProps {
  mode: "add" | "edit";
  nodeId?: string;
  open: boolean;
  onClose: () => void;
}

export function NodeEditForm({ mode, nodeId, open, onClose }: NodeEditFormProps) {
  const nodes = useFlowStore((s) => s.nodes);
  const departments = useFlowStore((s) => s.departments);
  const functions = useFlowStore((s) => s.functions);
  const flowTypes = useFlowStore((s) => s.flowTypes);
  const addNode = useFlowStore((s) => s.addNode);
  const updateNode = useFlowStore((s) => s.updateNode);
  const deleteNode = useFlowStore((s) => s.deleteNode);

  const existingNode = mode === "edit" ? nodes.find((n) => n.id === nodeId) : null;
  const existingData = existingNode?.data as SystemNodeData | undefined;

  const [label, setLabel] = useState(existingData?.label ?? "");
  const [systemName, setSystemName] = useState(existingData?.systemName ?? "");
  const [department, setDepartment] = useState(existingData?.department ?? (departments[0]?.id ?? ""));
  const [businessFunction, setBusinessFunction] = useState(existingData?.function ?? "");
  const [owner, setOwner] = useState(existingData?.owner ?? "");
  const [description, setDescription] = useState(existingData?.description ?? "");
  const [dataTypes, setDataTypes] = useState<string[]>(existingData?.dataTypes ?? []);
  const [newDataType, setNewDataType] = useState("");
  const [schedule, setSchedule] = useState(existingData?.schedule ?? "");
  const [protocol, setProtocol] = useState(existingData?.protocol ?? "");
  const [criticality, setCriticality] = useState<"high" | "medium" | "low">(existingData?.criticality ?? "medium");
  const [selectedFlowTypes, setSelectedFlowTypes] = useState<string[]>(existingData?.flowTypes ?? []);

  const filteredFunctions = functions.filter((f) => f.departmentId === department);

  const handleAddDataType = () => {
    if (newDataType.trim() && !dataTypes.includes(newDataType.trim())) {
      setDataTypes([...dataTypes, newDataType.trim()]);
      setNewDataType("");
    }
  };

  const handleRemoveDataType = (dt: string) => {
    setDataTypes(dataTypes.filter((d) => d !== dt));
  };

  const toggleFlowType = (ftId: string) => {
    setSelectedFlowTypes((prev) =>
      prev.includes(ftId) ? prev.filter((id) => id !== ftId) : [...prev, ftId]
    );
  };

  const handleSave = useCallback(() => {
    if (!label.trim()) return;

    const nodeData: SystemNodeData = {
      label: label.trim(),
      systemName: systemName.trim(),
      department,
      function: businessFunction,
      owner: owner.trim(),
      description: description.trim(),
      dataTypes,
      schedule: schedule.trim(),
      protocol: protocol.trim(),
      criticality,
      flowTypes: selectedFlowTypes,
    };

    if (mode === "add") {
      // Find a non-overlapping position by checking existing nodes
      const existingPositions = nodes.map((n) => n.position);
      let posX = 400;
      let posY = 200;
      // Shift down by 200px until we find a spot that doesn't overlap
      while (existingPositions.some((p) => Math.abs(p.x - posX) < 160 && Math.abs(p.y - posY) < 120)) {
        posY += 160;
      }
      const newNode: SystemFlowNode = {
        id: `node-${Date.now()}`,
        type: "system",
        position: { x: posX, y: posY },
        data: nodeData,
      };
      addNode(newNode);
    } else if (nodeId) {
      updateNode(nodeId, nodeData);
    }

    onClose();
  }, [label, systemName, department, businessFunction, owner, description, dataTypes, schedule, protocol, criticality, selectedFlowTypes, mode, nodeId, addNode, updateNode, onClose]);

  const handleDelete = () => {
    if (nodeId && mode === "edit") {
      deleteNode(nodeId);
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        className="w-[380px] border-l border-white/10 bg-[#0c1225]/95 backdrop-blur-xl p-0"
        style={{ ["--sheet-overlay-bg" as string]: "transparent" }}
      >
        <SheetHeader className="p-6 pb-4">
          <SheetTitle className="text-white text-lg font-semibold">
            {mode === "add" ? "Add System" : "Edit System"}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] px-6">
          <div className="space-y-4 pb-8">
            {/* Label */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                System Label
              </Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Order Management"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            {/* System Name */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                System Name
              </Label>
              <Input
                value={systemName}
                onChange={(e) => setSystemName(e.target.value)}
                placeholder="e.g., CRD, Hi-Port, Bara"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Department */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Department
              </Label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setBusinessFunction("");
                }}
                className="mt-1 w-full rounded-md bg-white/[0.04] border border-white/[0.08] text-white/80 text-xs px-3 py-2 outline-none focus:border-white/20"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#0c1225] text-white">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Function */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Function
              </Label>
              <select
                value={businessFunction}
                onChange={(e) => setBusinessFunction(e.target.value)}
                className="mt-1 w-full rounded-md bg-white/[0.04] border border-white/[0.08] text-white/80 text-xs px-3 py-2 outline-none focus:border-white/20"
              >
                <option value="" className="bg-[#0c1225] text-white">
                  Select function...
                </option>
                {filteredFunctions.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#0c1225] text-white">
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Owner
              </Label>
              <Input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="e.g., Trading Desk"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this system does..."
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs min-h-[60px]"
              />
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Data Types */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Data Types
              </Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {dataTypes.map((dt) => (
                  <Badge
                    key={dt}
                    variant="outline"
                    className="text-[9px] text-white/60 border-white/10 bg-white/[0.03] cursor-pointer hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-colors"
                    onClick={() => handleRemoveDataType(dt)}
                  >
                    {dt} <X size={8} className="ml-1" />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-1.5 mt-1.5">
                <Input
                  value={newDataType}
                  onChange={(e) => setNewDataType(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddDataType())}
                  placeholder="Add data type..."
                  className="bg-white/[0.04] border-white/[0.08] text-white/80 text-xs flex-1"
                />
                <Button
                  onClick={handleAddDataType}
                  size="sm"
                  variant="outline"
                  className="border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70 px-2"
                >
                  <Plus size={12} />
                </Button>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Schedule
              </Label>
              <Input
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g., Real-time, Daily batch"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            {/* Protocol */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Protocol
              </Label>
              <Input
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="e.g., FIX 4.4, REST API, SWIFT"
                className="mt-1 bg-white/[0.04] border-white/[0.08] text-white/80 text-xs"
              />
            </div>

            {/* Criticality */}
            <div>
              <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                Criticality
              </Label>
              <div className="flex gap-2 mt-1.5">
                {(["high", "medium", "low"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setCriticality(level)}
                    className={`
                      px-3 py-1.5 rounded-md text-[10px] border transition-all
                      ${
                        criticality === level
                          ? level === "high"
                            ? "border-red-500/30 bg-red-500/15 text-red-400"
                            : level === "medium"
                              ? "border-yellow-500/30 bg-yellow-500/15 text-yellow-400"
                              : "border-green-500/30 bg-green-500/15 text-green-400"
                          : "border-white/[0.08] bg-white/[0.04] text-white/40 hover:bg-white/[0.06]"
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-white/[0.06]" />

            {/* Flow Types */}
            {flowTypes.length > 0 && (
              <div>
                <Label className="text-[10px] text-white/50 uppercase tracking-wider">
                  Flow Types
                </Label>
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
                disabled={!label.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                {mode === "add" ? "Add System" : "Save Changes"}
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
            {mode === "edit" && (
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-md text-[10px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all mt-2"
              >
                <Trash2 size={10} />
                Delete System
              </button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
