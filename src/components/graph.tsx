// @ts-ignore
import Graph from 'react-graph-vis';
import "./graph.css";
import {useRef} from "react"; // Importing the correct CSS
type GraphData = {
    nodes: {
        id: number;
        label: string;
        title: string;
        color?: string;
        fixed?: {
            x: boolean,
            y: boolean,
        }
    }[];
    edges: {
        from: number;
        to: number;
    }[];
};
const SAMPLE = {
    nodes: [
        {id: 0, label: "0", x: 107, y: -133},
        {id: 1, label: "1", x: 7, y: -127},
        {id: 2, label: "2", x: -145, y: -145},
        {id: 3, label: "3", x: 217, y: -10},
        {id: 4, label: "4", x: 47, y: 23},
        {id: 5, label: "5", x: -106, y: -6},
        {id: 6, label: "6", x: -242, y: 16},
        {id: 7, label: "7", x: 179, y: 129},
        {id: 8, label: "8", x: 11, y: 166},
        {id: 9, label: "9", x: -139, y: 126},
    ],
    edges: [
        {from: 0, to: 1},
        {from: 0, to: 3},
        {from: 0, to: 4},
        {from: 1, to: 0},
        {from: 1, to: 2},
        {from: 1, to: 4},
        {from: 1, to: 5},
        {from: 2, to: 1},
        {from: 2, to: 5},
        {from: 2, to: 6},
        {from: 3, to: 0},
        {from: 3, to: 4},
        {from: 3, to: 7},
        {from: 4, to: 0},
        {from: 4, to: 1},
        {from: 4, to: 5},
        {from: 4, to: 8},
        {from: 4, to: 7},
        {from: 4, to: 3},
        {from: 5, to: 1},
        {from: 5, to: 2},
        {from: 5, to: 6},
        {from: 5, to: 9},
        {from: 5, to: 8},
        {from: 5, to: 4},
        {from: 6, to: 2},
        {from: 6, to: 5},
        {from: 6, to: 9},
        {from: 7, to: 3},
        {from: 7, to: 4},
        {from: 7, to: 8},
        {from: 8, to: 7},
        {from: 8, to: 4},
        {from: 8, to: 5},
        {from: 8, to: 9},
        {from: 9, to: 8},
        {from: 9, to: 5},
        {from: 9, to: 6},
    ]
}
function GraphRep({graph, setGraph, options, isEditing}: any) {

    const networkRef = useRef(null);

    let newOptions = {...options};
    if (isEditing) {
        newOptions = {
            ...newOptions,
            layout: {
                randomSeed: undefined,
            },
            interaction: {
                dragView: false,
                zoomView: false,
                dragNodes: true,
            },
            manipulation: {
                enabled: true,
                initiallyActive: true,
                addNode: function (nodeData: any, callback: any) {
                    const newNodeId = graph.nodes.length;
                    const newNode = {...nodeData, id: newNodeId, label: `${newNodeId}`};
                    console.log(newNode);
                    setGraph((prevGraph: GraphData) => ({
                        ...prevGraph,
                        nodes: [...prevGraph.nodes, newNode],
                    }));
                    callback(newNode);
                },
                addEdge: function (edgeData: any, callback: any) {
                    if (edgeData.from !== edgeData.to) {
                        setGraph((prevGraph: GraphData) => ({
                            ...prevGraph,
                            edges: [...prevGraph.edges, edgeData],
                        }));
                        callback(edgeData);
                    }
                },
                deleteNode: function (data: any, callback: any) {

                    let newNodes = graph.nodes.filter((node: { id: any; }) => !data.nodes.includes(node.id));
                    let newEdges = graph.edges.filter((edge: { id: any; }) => !data.edges.includes(edge.id));
                    setGraph({nodes: [...newNodes], edges: [...newEdges]});
                    callback(data);
                },
                deleteEdge: function (data: { nodes: string | any[]; edges: string | any[]; }, callback: (arg0: any) => void) {
                    console.log("old nodes",graph.nodes);
                    console.log("old edges",graph.edges);
                    let newNodes = graph.nodes.filter((node: { id: string; }) => !data.nodes.includes(node.id));
                    let newEdges = graph.edges.filter((edge: { id: string; }) => !data.edges.includes(edge.id));
                    console.log("new nodes",newNodes);
                    console.log("new edges",newEdges);
                    setGraph({nodes: [...newNodes], edges: [...newEdges]});
                    callback(data);
                },
                editEdge: false,

            }
        }
    } else {
        newOptions = {
            ...newOptions,
            layout: {
                randomSeed: 100,
            },
            interaction: {
                dragView: false,
                zoomView: false,
                dragNodes: false,
            },
        }
    }

    const events = {
        select: function (event: { nodes: any; edges: any; }) {
            let {nodes, edges} = event;
            console.log("Selected nodes:", nodes);
            console.log("Selected edges:", edges);
        }
    };

    let exampleClickHandle = () => {
        setGraph(SAMPLE);
    }
    let resetGraphClickHandle = () => {
        setGraph({nodes: [], edges: []});
    }
    const getNodePositions = () => {
        console.log(graph.nodes.length);
        console.log(graph.edges.length);
    };
    return (
        <div className="relative">
            <button className="btn btn-primary hidden" onClick={getNodePositions}>get</button>
            <div className="absolute right-0 bottom-0 z-10 flex gap-4">
                <button
                    onClick={resetGraphClickHandle}
                    className={`btn btn-outline btn-error ${isEditing ? "" : "hidden"}`}
                >
                    Reset
                </button>
                <button
                    onClick={exampleClickHandle}
                    className={`btn btn-outline  ${isEditing ? "" : "hidden"}`}
                >
                    Example
                </button>

            </div>
            <Graph
                key={JSON.stringify(graph)}
                graph={graph}
                options={newOptions}
                events={events}
                getNetwork={(network: null) => {
                    networkRef.current = network; // Store the network instance
                }}
            />
        </div>

    );
}

export default GraphRep;
