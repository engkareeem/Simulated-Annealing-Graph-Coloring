type graph = {
    [key: number]: number[];
}

type vertices_colors = {
    [key: number]: number;
}
type string_vertices_colors = {
    [key: number]: string;
}

export class SimulatedAnnealing {
    private INITIAL_TEMP: number;
    private COOLING_RATE: number;
    public currentConflict: number = 0;
    public currentTemp: number = 0;
    private graph: graph;
    public verticesColors: vertices_colors = {};
    public firstVerticesColors: vertices_colors = {};
    private lastVertex: number = -1;

    public testedVerticesColors: vertices_colors = {};
    private COLOR_COUNT: number; // MAX 10
    public iteration: number = 0;
    private readonly COLORS: string[] = [
        '#e74c3c', '#ff00fb', '#28b463',
        '#0021ff', '#f2d141', '#dc7633',
        '#884ea0', '#5d6d7e', '#17202a',
        '#fdfefe'
    ]

    public bestSolutionColors: vertices_colors = {};
    public bestSolutionConflict: number = 0;

    constructor(props?: { initialTemp: number, coolingRate: number, colorCount: number, graph: graph }) {
        this.INITIAL_TEMP = 0;
        this.COOLING_RATE = 0;
        this.graph = {};
        this.COLOR_COUNT = 0;
        this.verticesColors = {};
        if (props) {
            this.setup(props);
        }
    }

    setup(props: { initialTemp: number, coolingRate: number, colorCount: number, graph: graph }) {
        this.INITIAL_TEMP = props.initialTemp;
        this.COOLING_RATE = props.coolingRate;
        this.graph = props.graph;
        this.COLOR_COUNT = props.colorCount;
        this.firstVerticesColors = this.randomColors();
        this.reset();
    }

    setGraph(graph: graph) {
        this.graph = graph;
    }

    reset() {
        this.bestSolutionColors = {...this.firstVerticesColors};
        this.bestSolutionConflict = this.getConflictsCount(this.bestSolutionColors);
        this.testedVerticesColors = {...this.firstVerticesColors};
        this.currentTemp = this.INITIAL_TEMP;
        this.verticesColors = {...this.firstVerticesColors};
        this.currentConflict = this.getConflictsCount(this.verticesColors);
        this.iteration = 0;
    }

    randomColors() {
        let initialColors: { [key: number]: number } = {};
        for (let vertex in this.graph) {
            initialColors[vertex] = Math.floor(Math.random() * this.COLOR_COUNT);
        }
        return initialColors;
    }

    getConflictsCount(verticesColors: vertices_colors) {
        let conflicts = 0;
        for (let vertex in this.graph) {
            for (let neighbor of this.graph[vertex]) {
                if (verticesColors[vertex] === verticesColors[neighbor]) {
                    conflicts++;
                }
            }
        }
        conflicts /= 2; // undirected graph
        return conflicts;
    }

    getRandomVertex(): number {
        const keys = Object.keys(this.graph);
        let vertex: number;
        do {
            vertex = Math.floor(Math.random() * keys.length);
        } while (parseInt(keys[vertex]) === this.lastVertex);
        return parseInt(keys[vertex]);
    }

    getRandomColor(currentColor: number): number {
        let newColor: number;
        do {
            newColor = Math.floor(Math.random() * this.COLOR_COUNT);
        } while (newColor === currentColor);
        return newColor;
    }

    getStringColors(verticesColors?: vertices_colors): string_vertices_colors {
        let colors: string_vertices_colors = {};
        let object = verticesColors ?? this.verticesColors;
        Object.keys(object).forEach(color => {
            let index = parseInt(color);
            colors[index] = this.COLORS[object[index]];
        })
        return colors;
    }


    simulatedAnnealing() {
        this.reset();
        while (this.currentTemp > 1 && this.currentConflict > 0) {
            this.iterate();
        }
    }

    iterate() {
        let vertex = this.getRandomVertex();
        let oldColor = this.verticesColors[vertex];
        this.verticesColors[vertex] = this.getRandomColor(this.verticesColors[vertex]);
        this.testedVerticesColors = {...this.verticesColors}; // to save the solution even if it's not accepted

        let newConflict = this.getConflictsCount(this.verticesColors);
        if (newConflict < this.currentConflict || Math.random() < Math.exp((this.currentConflict - newConflict) / this.currentTemp)) {
            this.currentConflict = newConflict;
            if(this.currentConflict < this.bestSolutionConflict) {
                this.bestSolutionColors = {...this.verticesColors};
                this.bestSolutionConflict = this.currentConflict;
            }

        } else this.verticesColors[vertex] = oldColor;
        this.currentTemp *= this.COOLING_RATE;
        this.iteration++;
    }
}
