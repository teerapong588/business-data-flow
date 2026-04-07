import type { FlowProject } from "@/types/flow";

export function exportProjectJson(project: FlowProject): void {
  const json = JSON.stringify(project, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}-flow.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importProjectJson(json: string): FlowProject {
  const parsed = JSON.parse(json);

  // Validate required fields
  if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
    throw new Error("Invalid project: missing nodes array");
  }
  if (!parsed.edges || !Array.isArray(parsed.edges)) {
    throw new Error("Invalid project: missing edges array");
  }
  if (!parsed.departments || !Array.isArray(parsed.departments)) {
    throw new Error("Invalid project: missing departments array");
  }
  if (!parsed.functions || !Array.isArray(parsed.functions)) {
    throw new Error("Invalid project: missing functions array");
  }

  return {
    id: parsed.id ?? crypto.randomUUID(),
    name: parsed.name ?? "Imported Project",
    description: parsed.description ?? "",
    nodes: parsed.nodes,
    edges: parsed.edges,
    departments: parsed.departments,
    functions: parsed.functions,
    flowTypes: parsed.flowTypes ?? [],
    flowPaths: parsed.flowPaths ?? {},
    createdAt: parsed.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
