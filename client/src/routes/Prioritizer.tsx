import { fetchCivPreview, fetchTechs, fetchOptimalOrdering } from '../api/fetch';
import { CivPreview, Tech } from '../utils/types';
import Loading from '../components/Loading';
import SearchBarTechs from '../components/SearchBarTechs';
import ScenarioInput from '../components/ScenarioInput';
import TechNode from '../components/TechCard';
import 'reactflow/dist/style.css';
import React, { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from 'reactflow';
import dagre from 'dagre';

// TechNode from TechCard to style graph nodes
const nodeTypes = { techNode: TechNode };
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
const nodeWidth = 172;
const nodeHeight = 36;

// node layout logic with dagre
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    dagreGraph.setGraph({ 
        rankdir: direction, 
        ranker: 'network-simplex', 
        nodesep: 120, 
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

// dfs to build ancestors subgraph when users select a tech
const ancestors = (start: string, map: Map<string, Tech>): string[] => {

    const result: string[] = [];

    const dfs = (id: string) => {

        const tech = map.get(id);
        if(tech?.prereqs) {
            tech?.prereqs.forEach((prereq => dfs(prereq)));
        }
        result.push(id);
    };

    dfs(start);
    return result;
}

export default function Prioritizer() {
    // for  civiliation search bar component
    const [civs, civsState] = useState<CivPreview[]>([]);
    // lifted states submitting in POST to backend
    const [selectedCiv, setSelectedCiv] = useState<CivPreview | null>(null);
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const [scenario, setScenario] = useState<string>('');
    // state containing response from backend
    const [resultTechs, setResultTechs] = useState<string[] | null>(null);
    const [resultTargets, setResultTargets] = useState<string[] | null>(null);
    // state required for base react flow graph
    const [techs, techState] = useState<Tech[]>([]);
    const [techMap, setTechMap] = useState<Map<string, Tech>>(new Map());
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    // handling loading and submitting of user info
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    // submission of user info
    const handleSubmit = async () => {

        if (!selectedCiv) return;

        setSubmitting(true);

        try {
            let res = await fetchOptimalOrdering(selectedCiv.leader.name, scenario, selectedTechs);
            setResultTechs(res.ordering);
            setResultTargets(res.targets);
            setSubmitting(false);
        } catch (err) {
            alert('Failed to submit your plan.');
        }
    }

    // resetting all state when returning to scholars table page
    const handleReset = () => {
        setResultTechs(null);
        setResultTargets(null);
        setScenario("");
        setSelectedCiv(null);
        setSelectedTechs([]);
        // visuals
        setNodes((nds) =>
            nds.map((n) => ({
                ...n, data: { ...n.data, selected: false, ranked: -1, target: false },
            }))
        );
    };

    // retrieve required data for civ search bar and to create initial react flow graph
    useEffect(() => {
        const getInfo = async () => {
            let civData = await fetchCivPreview();
            let techData = await fetchTechs();
            civsState(civData);
            techState(techData);
            const map = new Map<string, Tech>();
            techData.forEach((tech) => {
                map.set(tech.name, tech);
            });
            setTechMap(map);
            setLoading(false);
        };
        getInfo();
    }, []);

    // handle tech selection state updates and logic
    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedTechs((prev) => {
        // only select nodes
        const updated = ancestors(node.id, techMap);
        const result = Array.from(new Set([...prev, ...updated]));

        // update visuals
        setNodes((nds) =>
            nds.map((n) => (
                { ...n, data: { ...n.data, selected: result.includes(n.id) }}
            ))
        );

        // update selected
        return result;
    });
    }, [techMap, setNodes]);

    // renders react flow graph and styles nodes based on state. uses dagre layout.
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
                        icon: t.icon,
                        prereqs: t.prereqs,
                        selected: false,
                        ranked: -1,
                        target: false
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
                        cursor: 'default'
                    },
                }))
                );

                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
                    initialNodes,
                    initialEdges,
                    'LR',
                );
                const finalNodes = layoutedNodes.map(n => {
                const isSelected = selectedTechs.includes(n.id);
                const rankIndex = resultTechs?.indexOf(n.id) ?? -1;
                const isTarget = resultTargets?.includes(n.id) ?? false;

                return {
                    ...n,
                    data: {
                    ...n.data,
                    selected: isSelected,
                    ranked: rankIndex >= 0 ? rankIndex + 1 : -1,
                    target: isTarget
                    }
                };
                });
                setNodes(finalNodes);
                setEdges(layoutedEdges);
            }
        };
        computeGraph();
    }, [loading, techs, selectedTechs, resultTechs, resultTargets, setNodes, setEdges]);

    // loading screen
    if(loading || submitting) {
        return(
            <div className="flex flex-col flex-1 items-center justify-center h-full">
                <div className="flex flex-1 items-center justify-center h-full w-full"><Loading /></div>
            </div>
        );
    }

    // displaying optimal tech path results
    if (resultTechs) {

        return(
            <div className="flex flex-col items-center justify-center text-text mb-12">
                <div className="flex flex-col sm:flex-row justify-center items-center my-12 text-center">
                <h1 className="text-5xl lg:text-6xl">
                    <span className="block md:inline">Your Optimal</span>{' '}
                    <span className="block md:inline pt-1">Tech Paths</span>
                </h1>
                </div>
                <div className="w-[80vw] h-[80vh] rounded-xl border-4 border-[#5b9bd5] overflow-hidden bg-surface">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        nodesFocusable={false}
                        fitView
                    >
                    <div className="absolute top-5 left-5 z-10">
                        <button
                        className="bg-[#434f61] border-4 border-[#5b9bd5] hover:bg-[#303946] font-semibold py-2 px-4 rounded-lg shadow transition-none"
                        onClick={handleReset}
                        >
                        Return to The Scholars Table                        
                        </button>
                    </div>
                    <div className="absolute top-20 md:top-5 right-5 z-10">
                    <div
                    className="bg-[#434f61] border-4 border-[#58ca52] py-2 px-4 rounded-lg shadow transition-none"
                    >
                    <p className="font-bold text-center">
                        Strategic Tech
                    </p>
                    <p className="font-bold text-center pb-2">
                        Tree Targets
                    </p>
                    {resultTargets?.map((tech) => (<p className="text-center">{tech}</p>))}
                    </div>
                    </div>
                    </ReactFlow>                
                </div>
            </div>
        );
    }

    // the scholars table landing page
    return (
        <div className="flex flex-col items-center justify-center text-text mb-12">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl mt-12">The Scholars Table</h1>
            </div>
            <div className="flex flex-col lg:flex-row justify-evenly items-center my-12 w-full">
                {/* instructions */}
                <div className="flex flex-col justify-center items-center mb-12 lg:mb-0 mx-6 lg:mx-0 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                    <h3 className="text-2xl md:text-3xl">Scholar's Guidebook</h3>
                    <p className="text-xl md:text-2xl mt-2">1. Describe Your Scenario</p>
                    <p className="text-sm sm:text-base mt-2 text-justify">
                        Share your strategies, goals, or challenges.
                    </p>
                    <p className="text-xl md:text-2xl mt-2">2. Choose Your Civilization</p>
                    <p className="text-sm sm:text-base mt-2 text-justify">
                        Confirm the civilization you command.
                    </p>
                    <p className="text-xl md:text-2xl mt-2">3. Mark Known Technologies</p>
                    <p className="text-sm sm:text-base mt-2 text-justify">
                        Tell us what your people have already mastered.
                    </p>
                    <p className="text-xl md:text-2xl mt-2">4. Submit Your Plan</p>
                    <p className="text-sm sm:text-base mt-2 text-justify">
                        Our AI advisors will craft your optimal tech paths.
                    </p> 
                </div>
                {/* scenario text input */}
                <ScenarioInput scenario={scenario} setScenario={setScenario} />
                {/* civ searchbar */}
                <div className="flex flex-col mt-12">
                    {!selectedCiv ? (
                        <div className="relative mx-auto size-40 lg:size-44 group mb-6">
                                <img src={"/default-civ.png"} alt={"Default Civ"} className="rounded-full relative w-full h-full object-cover drop-shadow-[0_0_12px_rgba(248,198,33,0.8)]" />
                        </div>
                    ) : (
                        <div className="relative mx-auto size-40 lg:size-44 hover:cursor-pointer group mb-6">
                                <img src={selectedCiv.civ.icon} alt={selectedCiv.civ.name} className="rounded-full relative w-full h-full object-cover drop-shadow-[0_0_12px_rgba(248,198,33,0.8)]" />
                        </div>
                    )}
                    <SearchBarTechs civs={civs} selectedCiv={selectedCiv} setSelectedCiv={setSelectedCiv}/>
                </div>
            </div>
            <div className="w-[80vw] h-[80vh] rounded-xl border-4 border-[#5b9bd5] overflow-hidden bg-surface">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    fitView
                >
                <div className="absolute top-5 left-5 z-10">
                    <button
                    className="bg-[#434f61] border-4 border-red-500 hover:bg-[#303946] font-semibold py-2 px-4 rounded-lg shadow transition-none"
                    onClick={() => {
                        setSelectedTechs([]);
                        // visuals
                        setNodes((nds) =>
                            nds.map((n) => ({
                                ...n, data: { ...n.data, selected: false, ranked: -1, target: false },
                            }))
                        );
                    }}
                    >
                    Reset Technology Selection
                    </button>
                </div>
                <div className="absolute top-20 md:top-5 right-5 z-10">
                    <button
                    disabled={submitting}
                    className="bg-[#434f61] border-4 border-green-600 hover:bg-[#303946] font-semibold py-2 px-4 rounded-lg shadow transition-none"
                    onClick={handleSubmit}
                    >
                    Submit Your Plan
                    </button>
                </div>
                </ReactFlow>
            </div>
        </div>
    );
}