"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDepartmentMap } from "@/store/useFlowStore";
import type { SystemFlowNode, SystemNodeData } from "@/types/flow";

interface SearchBarProps {
  nodes: SystemFlowNode[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export function SearchBar({
  nodes,
  searchQuery,
  onSearchChange,
  onSelectNode,
}: SearchBarProps) {
  const departmentMap = useDepartmentMap();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const query = searchQuery.toLowerCase();
  const matches =
    query.length > 0
      ? nodes.filter((n) => {
          const d = n.data as SystemNodeData;
          return (
            d.label.toLowerCase().includes(query) ||
            d.systemName.toLowerCase().includes(query) ||
            d.owner.toLowerCase().includes(query) ||
            d.department.toLowerCase().includes(query)
          );
        })
      : [];

  const showDropdown = isFocused && matches.length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && matches.length === 1) {
      onSelectNode(matches[0].id);
      onSearchChange("");
      setIsFocused(false);
    }
    if (e.key === "Escape") {
      onSearchChange("");
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] focus-within:border-white/[0.15] transition-colors w-56">
        <Search size={12} className="text-white/30" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search systems..."
          className="bg-transparent text-[11px] text-white/80 placeholder:text-white/25 outline-none w-full"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-white/30 hover:text-white/60"
          >
            <X size={10} />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full mt-1 left-0 w-72 z-50 bg-[#0c1225]/95 backdrop-blur-xl border border-white/[0.1] rounded-lg shadow-xl overflow-hidden">
          {matches.slice(0, 6).map((node) => {
            const d = node.data as SystemNodeData;
            const dept = departmentMap[d.department];
            return (
              <button
                key={node.id}
                onClick={() => {
                  onSelectNode(node.id);
                  onSearchChange("");
                  setIsFocused(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-white/[0.06] transition-colors text-left"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: dept?.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/80 truncate">{d.label}</p>
                  <p className="text-[9px] text-white/30 truncate">{d.systemName}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[8px] px-1.5 py-0 h-4 border-0 shrink-0"
                  style={{ backgroundColor: `${dept?.color}18`, color: dept?.color }}
                >
                  {dept?.label}
                </Badge>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
