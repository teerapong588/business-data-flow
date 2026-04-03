"use client";

import React, { memo } from "react";
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
  MarkerType,
} from "@xyflow/react";
import { DEPARTMENT_COLORS } from "@/lib/constants";
import { nodes } from "@/data/nodes";
import type { SystemNodeData } from "@/types/flow";

function AnimatedDataEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  source,
  target,
  style,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const sourceNode = nodes.find((n) => n.id === source);
  const targetNode = nodes.find((n) => n.id === target);
  const sourceColor =
    DEPARTMENT_COLORS[(sourceNode?.data as SystemNodeData)?.department ?? "technology"];
  const targetColor =
    DEPARTMENT_COLORS[(targetNode?.data as SystemNodeData)?.department ?? "technology"];

  const gradientId = `gradient-${id}`;
  const filterId = `glow-${id}`;
  const particleCount = 3;
  const label = (data as Record<string, unknown>)?.label as string | undefined;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={sourceColor} stopOpacity={0.8} />
          <stop offset="100%" stopColor={targetColor} stopOpacity={0.8} />
        </linearGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={targetColor} opacity={0.6} />
        </marker>
      </defs>

      {/* Glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={sourceColor}
        strokeWidth={4}
        strokeOpacity={0.08}
        filter={`url(#${filterId})`}
      />

      {/* Main edge path */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: `url(#${gradientId})`,
          strokeWidth: 1.5,
          ...style,
        }}
        markerEnd={`url(#arrow-${id})`}
      />

      {/* Particle dots */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <circle key={`${id}-particle-${i}`} r="2.5" fill={sourceColor} opacity={0.9}>
          <animateMotion
            dur={`${2.5 + i * 0.8}s`}
            repeatCount="indefinite"
            begin={`${i * 0.9}s`}
          >
            <mpath href={`#${id}`} />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            dur={`${2.5 + i * 0.8}s`}
            repeatCount="indefinite"
            begin={`${i * 0.9}s`}
          />
        </circle>
      ))}

      {/* Edge label on hover (rendered via CSS :hover on the group) */}
      {label && (
        <text>
          <textPath
            href={`#${id}`}
            startOffset="50%"
            textAnchor="middle"
            className="fill-white/0 hover:fill-white/60 transition-all text-[8px]"
            dy={-8}
          >
            {label}
          </textPath>
        </text>
      )}
    </>
  );
}

export const AnimatedDataEdge = memo(AnimatedDataEdgeComponent);
