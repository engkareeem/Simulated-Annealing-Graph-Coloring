import {useEffect, useRef, useState} from "react";
import GraphRep from "./components/graph";
import {SimulatedAnnealing} from "./logic/simulated_annealing";
import { SiGraphql } from "react-icons/si";
import { PiGraph } from "react-icons/pi";
import Config from "./components/config";
import Stats from "./components/stats";

type graph = {
    [key: number]: number[];
}
type string_vertices_colors = {
    [key: number]: string;
}

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
        {id: 0, label: "0", x: 107, y: -133, fixed: {x:true, y:true}},
        {id: 1, label: "1", x: 7, y: -127, fixed: {x:true, y:true}},
        {id: 2, label: "2", x: -145, y: -145, fixed: {x:true, y:true}},
        {id: 3, label: "3", x: 217, y: -10, fixed: {x:true, y:true}},
        {id: 4, label: "4", x: 47, y: 23, fixed: {x:true, y:true}},
        {id: 5, label: "5", x: -106, y: -6, fixed: {x:true, y:true}},
        {id: 6, label: "6", x: -242, y: 16, fixed: {x:true, y:true}},
        {id: 7, label: "7", x: 179, y: 129, fixed: {x:true, y:true}},
        {id: 8, label: "8", x: 11, y: 166, fixed: {x:true, y:true}},
        {id: 9, label: "9", x: -139, y: 126, fixed: {x:true, y:true}},
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
const App = () => {
    const [graph, setGraph] = useState<GraphData>({nodes: [], edges: []});
    const [parameters, setParameters] = useState({temp: "", cool: "", colors: ""});
    const [isEditing, setIsEditing] = useState(true);
    const [options, setOptions] = useState<any>({
        layout: {
            hierarchical: false,
        },
        physics: {
            enabled: false,
        },
        interaction: {
            dragView: false,
            zoomView: false,
            dragNodes: false,
        },

        edges: {
            color: "#dedede",

            arrows: {
                to: {enabled: true}
            }
        },
        height: "600px",
        nodes: {
            shape: "dot",
            size: 24,
            color: {
                background: "#191e24",
                border: "#aa6aee",
                highlight: {
                    border: "#7b02f8",
                    background: "#191e24",

                }
            },
            font: {
                size: 16,
                color: "#c2c2c2",
            },
            borderWidth: 1,
        },
    });
    const [iteration, setIteration] = useState(-1);
    const [iterateStart, setIterateStart] = useState(false);
    const [simulatedAnnealing, setSimulatedAnnealing] = useState(new SimulatedAnnealing());
    const speed = useRef(1);

    useEffect(() => {
        if (iterateStart) {
            if (simulatedAnnealing.currentTemp > 1 && simulatedAnnealing.currentConflict > 0) {
                const timer = setTimeout(() => {
                    simulatedAnnealing.iterate();
                    let tested = simulatedAnnealing.testedVerticesColors;
                    let newColors = simulatedAnnealing.getStringColors(tested);

                    colorizeGraph(newColors);

                    let newSimulatedAnnealing = new SimulatedAnnealing();
                    Object.assign(newSimulatedAnnealing, simulatedAnnealing);

                    setSimulatedAnnealing(newSimulatedAnnealing);
                    setIteration(prevState => prevState + 1);
                }, 1000/speed.current);

                return () => clearTimeout(timer);
            } else {
                colorizeGraph(simulatedAnnealing.getStringColors(simulatedAnnealing.bestSolutionColors));
                setIterateStart(false);
                setIteration(0);

            }
        }
    }, [iterateStart, iteration]);


    let getAdjacencyList = () => {
        let adjacencyList: graph = {}
        graph.edges.forEach(edge => {
            if (adjacencyList[edge.from]) {
                adjacencyList[edge.from].push(edge.to);
            } else {
                adjacencyList[edge.from] = [edge.to];
            }
        });
        return adjacencyList;
    }


    let colorizeGraph = (colors: string_vertices_colors) => {
        // console.log(colors);
        let newGraph = {...graph};
        newGraph.nodes = newGraph.nodes.map(node => {
            return {...node, color: colors[node.id]};
        })
        setGraph(newGraph);
    }
    let resetGraphColors = () => {
        let newGraph = {...graph};
        newGraph.nodes = newGraph.nodes.map(node => {
            return {...node, color: undefined};
        })
        setGraph(newGraph);
    }

    let resetClickHandle = () => {
        resetGraphColors();
        let newSimAn = new SimulatedAnnealing();
        setSimulatedAnnealing(newSimAn);
        setParameters({temp: "", cool: "", colors: ""});
        setIsEditing(true);
        setIterateStart(false);
        setIteration(0);
    }
    let startClickHandle = () => {

        simulatedAnnealing.reset();

        simulatedAnnealing.simulatedAnnealing();
        colorizeGraph(simulatedAnnealing.getStringColors());
    }
    let randomClickHandle = () => {
        let adjacencyList = getAdjacencyList();
        simulatedAnnealing.setup({initialTemp: parseInt(parameters.temp), coolingRate: parseFloat(parameters.cool), colorCount: parseInt(parameters.colors), graph: adjacencyList});
        colorizeGraph(simulatedAnnealing.getStringColors());
        simulatedAnnealing.reset();
    }

    let doneEditClickHandle = () => {
        setIsEditing(false);
    }
    let iterationStartHandle = () => {
        simulatedAnnealing.reset();
        setIterateStart(true);
    }

    return (
        <div className="bg-base-200 h-screen flex flex-col text-gray-200">
            <div className="text-4xl w-all text-center py-6 font-bold mb-5 flex justify-center items-end gap-4">
                <SiGraphql className=" h-auto text-4xl"/>
                <div className="h-full">Graph Coloring</div>

            </div>
            <div className="flex overflow-hidden h-[90%]">
                <div className="border border-[#474060] rounded-3xl p-3 w-4/5 mb-3">
                    <GraphRep graph={graph} setGraph={setGraph} options={options} isEditing={isEditing} key={Math.random().toString()}/>
                </div>
                <div className="w-1/3 flex flex-col px-10 mb-3 gap-4">
                    <div className="">
                        <Config startClickHandle={startClickHandle} isEditing={isEditing} iterationStartHandle={iterationStartHandle}
                                randomClickHandle={randomClickHandle} doneEditClickHandle={doneEditClickHandle}
                                resetClickHandle={resetClickHandle}
                                speed={speed}
                                parameters={parameters} setParameters={setParameters}/>
                    </div>
                    <div className="grow">
                        <Stats saObject={simulatedAnnealing}/>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default App;