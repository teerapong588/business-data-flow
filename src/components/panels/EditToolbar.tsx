"use client";

import React, { useState, useRef } from "react";
import { useFlowStore } from "@/store/useFlowStore";
import { exportProjectJson, importProjectJson } from "@/lib/persistence";
import { NodeEditForm } from "./NodeEditForm";
import { ProjectPicker } from "./ProjectPicker";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  FolderOpen,
  Save,
} from "lucide-react";

interface EditToolbarProps {
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onDeleteNode: () => void;
  onDeleteEdge: () => void;
}

export function EditToolbar({
  selectedNodeId,
  selectedEdgeId,
  onDeleteNode,
  onDeleteEdge,
}: EditToolbarProps) {
  const getProject = useFlowStore((s) => s.getProject);
  const loadProject = useFlowStore((s) => s.loadProject);
  const projectName = useFlowStore((s) => s.projectName);
  const setProjectName = useFlowStore((s) => s.setProjectName);

  const [showAddNode, setShowAddNode] = useState(false);
  const [showProjectPicker, setShowProjectPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasSelection = selectedNodeId || selectedEdgeId;

  const handleExport = () => {
    const project = getProject();
    exportProjectJson(project);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const project = importProjectJson(event.target?.result as string);
        loadProject(project);
      } catch (err) {
        alert(`Failed to import: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be re-imported
    e.target.value = "";
  };

  return (
    <>
      <div className="flex items-center gap-2 px-6 py-2 bg-blue-500/[0.04] border-b border-blue-500/[0.15]">
        {/* Project name */}
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-transparent text-[11px] text-white/70 font-medium border-b border-transparent hover:border-white/20 focus:border-blue-400/50 outline-none px-1 py-0.5 w-40"
        />

        <div className="w-px h-4 bg-white/[0.08]" />

        {/* Add System */}
        <button
          onClick={() => setShowAddNode(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
        >
          <Plus size={10} />
          Add System
        </button>

        {/* Delete Selected */}
        {hasSelection && (
          <button
            onClick={() => {
              if (selectedNodeId) onDeleteNode();
              else if (selectedEdgeId) onDeleteEdge();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 size={10} />
            Delete
          </button>
        )}

        <div className="flex-1" />

        {/* Project Picker */}
        <button
          onClick={() => setShowProjectPicker(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
        >
          <FolderOpen size={10} />
          Templates
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
        >
          <Download size={10} />
          Export
        </button>

        {/* Import */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] text-white/50 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
        >
          <Upload size={10} />
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {/* Add Node Sheet */}
      {showAddNode && (
        <NodeEditForm
          mode="add"
          open={showAddNode}
          onClose={() => setShowAddNode(false)}
        />
      )}

      {/* Project Picker Dialog */}
      {showProjectPicker && (
        <ProjectPicker
          open={showProjectPicker}
          onClose={() => setShowProjectPicker(false)}
        />
      )}
    </>
  );
}
