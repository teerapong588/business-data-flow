import type {
  SystemNodeData,
  DataSchema,
  SystemFlowNode,
  DataFlowEdge,
  DataEdgeData,
} from "@/types/flow";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getNodeSchemas(data: SystemNodeData): DataSchema[] {
  if (data.schemas && data.schemas.length > 0) {
    return data.schemas;
  }
  // Fallback: convert legacy dataTypes strings to stub schemas
  return data.dataTypes.map((dt) => ({
    id: slugify(dt),
    name: dt,
    fields: [],
  }));
}

export interface TracedFieldPath {
  nodeId: string;
  nodeLabel: string;
  schemaId: string;
  schemaName: string;
  fieldId: string;
  fieldName: string;
  edgeId?: string;
  edgeLabel?: string;
  direction: "origin" | "upstream" | "downstream";
}

export function traceFieldThroughGraph(
  originNodeId: string,
  schemaId: string,
  fieldId: string,
  nodes: SystemFlowNode[],
  edges: DataFlowEdge[]
): TracedFieldPath[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const path: TracedFieldPath[] = [];
  const visited = new Set<string>();

  // Add origin
  const originNode = nodeMap.get(originNodeId);
  if (!originNode) return path;
  const originData = originNode.data as SystemNodeData;
  const originSchemas = getNodeSchemas(originData);
  const originSchema = originSchemas.find((s) => s.id === schemaId);
  const originField = originSchema?.fields.find((f) => f.id === fieldId);

  path.push({
    nodeId: originNodeId,
    nodeLabel: originData.label,
    schemaId,
    schemaName: originSchema?.name ?? schemaId,
    fieldId,
    fieldName: originField?.name ?? fieldId,
    direction: "origin",
  });
  visited.add(originNodeId);

  // Trace downstream (follow edges where source = current node)
  function walkDown(nodeId: string) {
    const outEdges = edges.filter((e) => e.source === nodeId);
    for (const edge of outEdges) {
      if (visited.has(edge.target)) continue;
      const edgeData = edge.data as DataEdgeData;
      const mappings = edgeData?.fieldMappings;

      // Check if this edge carries our schema/field
      let carries = false;
      let targetSchemaId = schemaId;

      if (mappings && mappings.length > 0) {
        const mapping = mappings.find((m) => m.sourceSchemaId === schemaId);
        if (mapping) {
          // If sourceFieldIds is empty, all fields flow through
          if (mapping.sourceFieldIds.length === 0 || mapping.sourceFieldIds.includes(fieldId)) {
            carries = true;
            targetSchemaId = mapping.targetSchemaId ?? schemaId;
          }
        }
      }

      if (carries) {
        const targetNode = nodeMap.get(edge.target);
        if (!targetNode) continue;
        const targetData = targetNode.data as SystemNodeData;
        const targetSchemas = getNodeSchemas(targetData);
        const targetSchema = targetSchemas.find((s) => s.id === targetSchemaId);

        visited.add(edge.target);
        path.push({
          nodeId: edge.target,
          nodeLabel: targetData.label,
          schemaId: targetSchemaId,
          schemaName: targetSchema?.name ?? targetSchemaId,
          fieldId,
          fieldName: originField?.name ?? fieldId,
          edgeId: edge.id,
          edgeLabel: edgeData?.label,
          direction: "downstream",
        });
        walkDown(edge.target);
      }
    }
  }

  // Trace upstream (follow edges where target = current node)
  function walkUp(nodeId: string) {
    const inEdges = edges.filter((e) => e.target === nodeId);
    for (const edge of inEdges) {
      if (visited.has(edge.source)) continue;
      const edgeData = edge.data as DataEdgeData;
      const mappings = edgeData?.fieldMappings;

      let carries = false;

      if (mappings && mappings.length > 0) {
        const mapping = mappings.find(
          (m) => m.sourceSchemaId === schemaId || m.targetSchemaId === schemaId
        );
        if (mapping) {
          if (mapping.sourceFieldIds.length === 0 || mapping.sourceFieldIds.includes(fieldId)) {
            carries = true;
          }
        }
      }

      if (carries) {
        const sourceNode = nodeMap.get(edge.source);
        if (!sourceNode) continue;
        const sourceData = sourceNode.data as SystemNodeData;
        const sourceSchemas = getNodeSchemas(sourceData);
        const sourceSchema = sourceSchemas.find((s) => s.id === schemaId);

        visited.add(edge.source);
        path.push({
          nodeId: edge.source,
          nodeLabel: sourceData.label,
          schemaId,
          schemaName: sourceSchema?.name ?? schemaId,
          fieldId,
          fieldName: originField?.name ?? fieldId,
          edgeId: edge.id,
          edgeLabel: edgeData?.label,
          direction: "upstream",
        });
        walkUp(edge.source);
      }
    }
  }

  walkDown(originNodeId);
  walkUp(originNodeId);

  return path;
}
