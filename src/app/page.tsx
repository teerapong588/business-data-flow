"use client";

import dynamic from "next/dynamic";

const FlowCanvas = dynamic(
  () => import("@/components/flow/FlowCanvas").then((mod) => mod.FlowCanvas),
  { ssr: false }
);

export default function Home() {
  return <FlowCanvas />;
}
