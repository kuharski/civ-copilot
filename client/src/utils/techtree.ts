import dagre from 'dagre';
import { Edge, Node, Position } from 'reactflow';

const nodeWidth = 140;
const nodeHeight = 80;

export function layout(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({     rankdir: 'TB',    // top → bottom instead of left→right
    align:   'UL',    // align each rank’s nodes along the upper-left
    nodesep: 60,      // horizontal distance between nodes
    ranksep: 120,});

  nodes.forEach(n => g.setNode(n.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach(e => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map(n => {
    const { x, y } = g.node(n.id);
    return {
      ...n,
      position: {
        x: x - nodeWidth / 2,
        y: y - nodeHeight / 2
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    };
  });
}