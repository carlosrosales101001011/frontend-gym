import React, { useState } from "react";

/**
 * Forma mínima que necesita cualquier nodo para poder renderizarse
 * como árbol. No sabe nada de "gastos", "montos", etc.
 *
 * El truco es el generic acotado (F-bounded polymorphism):
 * `T extends TreeNodeBase<T>` hace que `children` sea `T[]`
 * en vez de `TreeNodeBase[]`, así el árbol conserva el tipo real
 * del consumidor durante toda la recursión.
 */
export interface TreeNodeBase<T> {
  id: string | number;
  children?: T[];
}

interface TreeViewProps<T extends TreeNodeBase<T>> {
  data: T[];
  /** Requerido: el componente ya no asume nombre/monto */
  renderNode: (
    node: T,
    ctx: { level: number; hasChildren: boolean; isExpanded: boolean }
  ) => React.ReactNode;
  /** IDs expandidos por defecto (opcional) */
  defaultExpanded?: (string | number)[];
}

export function TreeView<T extends TreeNodeBase<T>>({
  data,
  renderNode,
  defaultExpanded = [],
}: TreeViewProps<T>) {
  const [expanded, setExpanded] = useState<Set<string | number>>(
    new Set(defaultExpanded)
  );

  const toggleNode = (id: string | number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderTree = (nodes: T[], level = 0): React.ReactNode => {
    return nodes.map((node) => {
      const hasChildren = Array.isArray(node.children) && node.children.length > 0;
      const isExpanded = expanded.has(node.id);

      return (
        <div key={node.id}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 12px",
              paddingLeft: `${level * 24 + 12}px`,
              cursor: hasChildren ? "pointer" : "default",
              borderBottom: "1px solid #eee",
              userSelect: "none",
              backgroundColor: isExpanded ? "#e8f5e9" : "#fff",
              borderLeft: isExpanded ? "3px solid #4caf50" : "3px solid transparent",
              transition: "all 0.2s ease",
            }}
            onClick={() => {
              if (hasChildren) toggleNode(node.id);
            }}
          >
            <span
              style={{
                width: "20px",
                display: "inline-flex",
                justifyContent: "center",
                marginRight: "5px",
              }}
            >
              {hasChildren ? (isExpanded ? "▼" : "▶") : "•"}
            </span>

            <div style={{ flex: 1 }}>
              {renderNode(node, { level, hasChildren, isExpanded })}
            </div>
          </div>

          {hasChildren && isExpanded && (
            <div
              style={{
                marginLeft: `${level * 24 + 21}px`,
                borderLeft: "1px solid #bdbdbd",
              }}
            >
              {renderTree(node.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {renderTree(data)}
    </div>
  );
}

export default TreeView;

/* ────────────────────────────────────────────────────────────────
   USO ESPECÍFICO PARA TU CASO (gastos): esto ya no vive dentro del
   componente reusable, vive en tu módulo de dominio.
   ──────────────────────────────────────────────────────────────── */

// interface TreeNodeCR extends TreeNodeBase<TreeNodeCR> {
//   nombre: string;
//   monto?: number;
//   tipogasto?: string;
//   fechaInicio?: string;
//   fechaFin?: string;
//   isSinLimite?: boolean;
//   isPromediado?: boolean;
// }
//
// function TreeViewCR({ data }: { data: TreeNodeCR[] }) {
//   return (
//     <TreeView<TreeNodeCR>
//       data={data}
//       renderNode={(node) => (
//         <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
//           <span>{node.nombre}</span>
//           {node.monto !== undefined && (
//             <strong>
//               S/ {node.monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
//             </strong>
//           )}
//         </div>
//       )}
//     />
//   );
// }
//
// // Otro consumidor totalmente distinto, mismo componente:
// interface TreeNodeFile extends TreeNodeBase<TreeNodeFile> {
//   name: string;
//   sizeKb?: number;
// }
//
// function FileExplorer({ data }: { data: TreeNodeFile[] }) {
//   return (
//     <TreeView<TreeNodeFile>
//       data={data}
//       renderNode={(node) => (
//         <span>
//           {node.name} {node.sizeKb ? `(${node.sizeKb} KB)` : ""}
//         </span>
//       )}
//     />
//   );
// }