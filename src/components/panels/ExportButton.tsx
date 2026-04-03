"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, Image, FileCode } from "lucide-react";
import { exportToPng, exportToSvg } from "@/lib/export";

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export function ExportButton({ targetRef }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (format: "png" | "svg") => {
    const el = targetRef.current?.querySelector(".react-flow") as HTMLElement;
    if (!el) return;

    if (format === "png") {
      await exportToPng(el, "data-flow");
    } else {
      await exportToSvg(el, "data-flow");
    }
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors text-[10px] text-white/50 hover:text-white/70"
      >
        <Download size={12} />
        Export
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 z-50 bg-[#0c1225]/95 backdrop-blur-xl border border-white/[0.1] rounded-lg shadow-xl overflow-hidden w-40">
          <button
            onClick={() => handleExport("png")}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/[0.06] transition-colors text-left"
          >
            <Image size={12} className="text-white/40" />
            <span className="text-[11px] text-white/70">Export as PNG</span>
          </button>
          <button
            onClick={() => handleExport("svg")}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-white/[0.06] transition-colors text-left"
          >
            <FileCode size={12} className="text-white/40" />
            <span className="text-[11px] text-white/70">Export as SVG</span>
          </button>
        </div>
      )}
    </div>
  );
}
