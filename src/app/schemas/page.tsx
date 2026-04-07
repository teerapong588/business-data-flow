"use client";

import dynamic from "next/dynamic";

const SchemaExplorer = dynamic(
  () =>
    import("@/components/schemas/SchemaExplorer").then(
      (mod) => mod.SchemaExplorer
    ),
  { ssr: false }
);

export default function SchemasPage() {
  return <SchemaExplorer />;
}
