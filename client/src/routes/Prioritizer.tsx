import { fetchCivPreview, fetchTechs } from '../api/fetch';
import { CivPreview, Tech } from '../utils/types';
import Loading from '../components/Loading';
import TechNode from '../components/TechCard';
import 'reactflow/dist/style.css';
import React, { useEffect, useState, useCallback } from 'react';
import {
  Background,
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType
} from 'reactflow';
import dagre from 'dagre';

const nodeTypes = { techNode: TechNode };
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    dagreGraph.setGraph({ 
        rankdir: direction, 
        ranker: 'network-simplex', 
        nodesep: 100, 
        ranksep: 200,
    });
    
    nodes.forEach((node: Node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    
    edges.forEach((edge: Edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });
    
    dagre.layout(dagreGraph);
    
    const newNodes = nodes.map((node: Node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = {
        ...node,
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        },
        };
    
        return newNode;
    });
    
    return { nodes: newNodes, edges };
};

export default function Prioritizer() {

    const [civs, civsState] = useState<CivPreview[]>([]);
    const [techs, techState] = useState<Tech[]>([]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState<boolean>(true);

    // retrieve data
    useEffect(() => {
        const getInfo = async () => {
            let civData = await fetchCivPreview();
            let techData = await fetchTechs();
            civsState(civData);
            techState(techData);
            setLoading(false);
        };
        getInfo();
    }, []);

    useEffect(() => {
        const computeGraph = () => {
            if (!loading && techs.length > 0) {
                // initial nodes and edges
                const initialNodes: Node[] = techs.map(t => ({
                    id: t.name,
                    type: 'techNode',
                    data: { 
                        name: t.name,
                        cost: t.cost,
                        icon: t.icon
                    },
                    position: { x: 0, y: 0 },
                    draggable: false,
                    selectable: true
                }));

                const initialEdges: Edge[] = techs.flatMap(t =>
                t.prereqs.map(pr => ({
                    id: `e-${pr}-${t.name}`,
                    source: pr,
                    target: t.name,
                    type: 'simplebezier',
                    animated: false,
                    deletable: false,
                    selectable: false,
                    reconnectable: false,
                    focusable: false,
                    markerEnd: { type: MarkerType.ArrowClosed },
                    style: {        
                        stroke: '#BBB',
                        strokeWidth: 2,
                    },
                }))
                );

                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                    initialNodes,
                    initialEdges,
                    'LR',
                );
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
            }
        };
        computeGraph();
    }, [loading, techs, setNodes, setEdges]);

    if(loading) {
        return(
            <div className="flex flex-col flex-1 items-center justify-center h-full">
                <div className="flex flex-1 items-center justify-center h-full w-full"><Loading /></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-text mb-12">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl mt-12">The Scholar's Table</h1>
            </div>
            <div className="flex flex-col justify-center items-center gap-6 my-10 w-full">
                {/* instructions */}
                <div className="flex flex-col justify-center items-center max-w-80 md:max-w-96 w-full mt-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                    <h3 className="text-3xl md:text-4xl">Victory Focus</h3>
                    <p className="text-sm md:text-lg mt-2 text-justify">
                        Your civilization stands at the threshold of greatness. 
                        To guide it toward glory, you must chart a wise course through the ages of technology.
                    </p>
                    <p className="text-lg md:text-2xl mt-2">1. Choose your leader</p>
                    <p className="text-sm md:text-lg mt-2 text-justify">
                        Select the visionary who will shape your empire’s unique path.
                    </p>
                    <p className="text-lg md:text-2xl mt-2">2. Mark known technologies</p>
                    <p className="text-sm md:text-lg mt-2 text-justify">
                        Tell us what your people have already mastered.
                    </p>
                    <p className="text-lg md:text-2xl mt-2">3. Describe your scenario</p>
                    <p className="text-sm md:text-lg mt-2 text-justify">
                        Share your strategy, goals, or challenges ahead.
                    </p>
                    <p className="text-lg md:text-2xl mt-2">4. Submit your plan</p>
                    <p className="text-sm md:text-lg mt-2 text-justify">
                        Our advisors will craft your optimal tech path to victory.
                    </p> 
                </div>
                <div className="w-full h-[80vh] rounded-xl border-4 border-[#5b9bd5] lg:mx-10 mx-5 p-4 overflow-hidden">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        nodesConnectable={false}
                        fitView
                    >
                    <Background />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}