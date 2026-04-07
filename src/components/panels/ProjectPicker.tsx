"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFlowStore } from "@/store/useFlowStore";
import { templates } from "@/data/templates";
import { LayoutGrid, FileText } from "lucide-react";

interface ProjectPickerProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectPicker({ open, onClose }: ProjectPickerProps) {
  const loadTemplate = useFlowStore((s) => s.loadTemplate);
  const newBlankProject = useFlowStore((s) => s.newBlankProject);

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      if (template.nodes.length === 0) {
        newBlankProject();
      } else {
        loadTemplate(template);
      }
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-[#0c1225]/95 backdrop-blur-xl border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg">Choose a Template</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 mt-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/[0.04] shrink-0 mt-0.5">
                {template.nodes.length > 0 ? (
                  <LayoutGrid size={18} className="text-blue-400" />
                ) : (
                  <FileText size={18} className="text-white/40" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/90">
                  {template.name}
                </h3>
                <p className="text-[11px] text-white/40 mt-0.5">
                  {template.description}
                </p>
                {template.nodes.length > 0 && (
                  <p className="text-[10px] text-white/30 mt-1">
                    {template.nodes.length} systems &middot;{" "}
                    {template.edges.length} connections &middot;{" "}
                    {template.departments.length} departments
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
