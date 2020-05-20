'use strict';

class Graph {
    constructor(adj_matrix) {
        this.plot_x = 1000;
        this.plot_y = 500;
        this.adj_matrix = new Matrix(adj_matrix);
        this.w_matrix = null;
        this.nodes = adj_matrix.length;
        this.display = 'default';
        this.config = {
            plot_x_offfset: 100,
            plot_y_offfset: 100,
                    
            orientired: true,

            coords: []
        }
    }

    getSize() {
        return {
            x: this.plot_x,
            y: this.plot_y
        }
    }

    setSize(x, y) {
        this.plot_x = x;
        this.plot_y = y;
    }

    reachability() {
        const s = this.adj_matrix.size().m;
        let multiplycat = Matrix.createUnit(s);
        const pows = [];
        for (let i = 1; i < s; i++) {
            pows.push(this.adj_matrix.pow(i));
        }
        for (let i = 0; i < pows.length; i++) {
            multiplycat = Matrix.matrixSum(multiplycat, pows[i]);
        }
        this.adj_matrix.matrix = multiplycat;
        this.adj_matrix.booling();
        return this.adj_matrix.matrix;
    }

    bfs(node) {
        const matrix = this.adj_matrix.bfs(node);
        const bfs = new BFS(matrix, node);
        return {bfs, matrix};
    }

    strongBindingMatrix() {
        const R = this.reachability();
        const RT = Matrix.transpone(R);
        const S = Matrix.multiplyMatrixElem(R, RT);
        return S;
    }

    strongBindingComponents() {
        const S = this.strongBindingMatrix();
        for (let i = 0; i < S.length; i++) {
            for (let j = 0; j < S[i].length; j++) {
                if (S[i][j]) {
                    let ic = i+1;
                    while (ic < S.length) {
                        S[ic][j] = 0;
                        ic++;
                    }
                }
            }
        }

        const components = [];

        for (let i = 0; i < S.length; i++) {
            const component = [];
            for (let j = 0; j < S[i].length; j++) {
                if (S[i][j]) {
                    component.push(j+1);
                }
            }
            if (component.length) {
                components.push(component);
            }
        }
        
        return components;
    }

    condensation() {
        const nodes = this.strongBindingComponents();
        const cMatrix = Matrix.createZero(nodes.length);
        for (let m = 0; m < cMatrix.length; m++) {
            for (let n = 0; n < cMatrix[m].length; n++) {
                if (n === m+1) {
                    cMatrix[m][n] = 1;
                }
            }
        }
        return cMatrix;
    }
    
    routes(length) {
        const getWays = matrix => {
            let l1 = [];
            let l2 = [];
            let l3 = [];
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix.length; j++) {
                    if (matrix[i][j] === 1 && i != j) l1.push([i, j]);
                }
            }
            for (let i = 0; i < l1.length; i++) {
                let chain1 = l1[i];
                for (let j = 0; j < l1.length; j++) {
                    const chain2 = l1[j];
                    const c1first = chain1[0];
                    const c1last = chain1[chain1.length - 1];
                    const c2first = chain2[0];
                    const c2last = chain2[chain2.length - 1];
                    if (c1last === c2first && c1first !== c2last) {
                        l2.push([...chain1, c2last]);
                    }
                }
            }
            for (let i = 0; i < l1.length; i++) {
                let chain1 = l1[i];
                for (let j = 0; j < l2.length; j++) {
                    const chain2 = l2[j];
                    const c1first = chain1[0];
                    const c1last = chain1[chain1.length - 1];
                    const c2first = chain2[0];
                    const c2last = chain2[chain2.length - 1];
                    if (c2last === c1first && c2first !== c1last && chain2[1] !== c1last) {
                        l3.push([...chain2, c1last]);
                    }
                }
            }
            
            return { l1, l2, l3 };
        }

        if (length === 3) {
            return getWays(this.adj_matrix.matrix).l3;
        } else if (length === 2){
            return getWays(this.adj_matrix.matrix).l2;
        } else if (length === 1) {
            return getWays(this.adj_matrix.matrix).l1;
        }
        
    }

    orientired(isOrientired) {
        this.config.orientired = isOrientired;
        return this;
    }

    displayForm(display) {
        this.display = display;
        return this;
    }

    degrees() {
        class Deg {
            constructor(from = 0, to = 0) {
                this.from = from;
                this.to = to;
            }
            sum() {
                return this.from + this.to;
            }
        };
        const result = new Array(this.adj_matrix.size().m)
            .fill({})
            .map(el => el = new Deg());
        this.adj_matrix.iterate((a, b, m, n) => {
            let flag = true;
            if ((m - n) > 0) {
                flag = false;
            }
            if (a) {
                if (flag) {
                    result[m].from++;
                    result[n].to++;
                } else {
                    result[m].from++;
                    result[n].to++;
                }
            }
        });
        return result;
    }

    isUni() {
        const degrees = this.degrees();
        const item0 = degrees[0].sum();
        const isUni = degrees.every(item => item.sum() === item0);
        if (isUni) {
            return degrees[0].sum();
        } else {
            return -1;
        }
    }

    hangingNodes() {
        const degrees = this.degrees();
        const hangingNodes = [];
        degrees.forEach(item => {
            if (item.sum() === 1) {
                hangingNodes.push(item);
            } else {
                hangingNodes.push(null);
            }
        });
        return hangingNodes;
    }

    isolatedNodes() {
        const degrees = this.degrees();
        const isolatedNodes = [];
        degrees.forEach(item => {
            if (item.sum() === 0) {
                isolatedNodes.push(item);
            } else {
                isolatedNodes.push(null);
            }
        });
        return isolatedNodes;
    }

    weight(w_matrix) {
        this.w_matrix = w_matrix;
        return this;
    }

    isOrientired() {
        return this.config.orientired;
    }

    minSpanningTree() {
        let result = [];
        const weight = Matrix.matrixSum(this.w_matrix, Matrix.createInfinity(this.w_matrix.length));
        for (let i = 0; i < this.adj_matrix.matrix.length; i++) {
            for (let j = 0; j < this.adj_matrix.matrix[i].length; j++) {
                if (!this.adj_matrix.matrix[i][j]) {
                    weight[i][j] = Infinity;
                }
            }
        }

        // Используем алгоритм Прима
        const N = this.nodes;
        const INF = Infinity;
        const dist = new Array(N).fill(INF);
        dist[0] = 0;
        const used = new Array(N).fill(false);
        let ans = 0;
        for (let i = 0; i < N; ++i) {
            let u, min_dist = INF;
            for (let j = 0; j < N; ++j) {
                if (!used[j] && dist[j] < min_dist) {
                    min_dist = dist[j];
                    u = j;
                }
            }
            ans += min_dist;
            used[u] = true;
            for (let v = 0; v < N; ++v) {
                if (dist[v] > weight[u][v]) {
                    const dist_temp_copy = dist[v];
                    dist[v] = weight[u][v];
                    let isWayToVExist = false;
                    for (let t = 0; t < result.length; ++t) {
                        if (result[t].v === v) {
                            if (used[v]) {
                                dist[v] = dist_temp_copy;
                            } else {
                                result[t].u = u;
                            }
                            isWayToVExist = true;
                        }
                    }
                    if (!isWayToVExist) {
                        result.push({ u, v });
                    }
                }
            }
        }
        return result;
    }

    // Dijkstra's algorithm
    findShortestPaths(startNode, destNode) {
        console.dir({startNode, destNode})
        let weight = 0;
        const resultPath = [];
        const visited = new Array(this.adj_matrix.matrix.length).fill(false);
        let active = startNode;

        while (active !== destNode) {
            visited[active] = true;

            resultPath.push(active);

            let minNodeFromActiv;
            let isPathExist = false;
            let currRibWeight = Infinity;
            for (let i = 0; i < visited.length; i++) {
                if (!this.adj_matrix.matrix[active][i])
                    continue;

                const currNodeWeight = this.w_matrix[active][i];
                console.log(weight, currNodeWeight, i, !visited[i])
                if (i === destNode ||
                    (!visited[i] &&
                    currRibWeight > currNodeWeight)) {
                    currRibWeight = currNodeWeight;
                    minNodeFromActiv = i;
                    isPathExist = true;
                }
            }

            weight += currRibWeight;

            if (!isPathExist)
                break;

            active = minNodeFromActiv;
        }

        return {
            path: resultPath,
            weight
        }
    }

    // Dijkstra's algorithm
    FindShordestWay(start) {
        // step class for by-step trace
        class Step {
            constructor(visited, active) {
                this.visited = visited;
                this.active = active;
            }
        }
        // result by-step trace
        const bystep = [];
        // number of nodes
        const n = this.adj_matrix.matrix.length;
        const INF = Infinity;
        const dist = new Array(n).fill(INF);
        dist[start] = 0;
        const prev = new Array(n).fill(-1);
        const used = new Array(n);
        let min_dist = 0;
        let min_vertex = start;
        while (min_dist < INF) {
            let i = min_vertex;
            used[i] = true;
            for (let j = 0; j < n; j++) {
                const edge = this.adj_matrix.matrix[i][j];
                const wt = this.w_matrix[i][j];
                if (edge && (dist[i] + wt < dist[j])) {
                    dist[j] = dist[i] + wt;
                    prev[j] = i;
                }
            }
            min_dist = INF;
            for (let j = 0; j < n; ++j) {
                if (!used[j] && dist[j] < min_dist) {
                    min_dist = dist[j];
                    min_vertex = j;
                }
            }
            const visited = [];
            for (const i in used) {
                if (used[i]) {
                    visited.push(Number(i));
                }
            }
            bystep.push(new Step(visited, min_vertex));
        }
        
        class Path {
            constructor(p, w) {
                this.way = p;
                this.weight = w;
            }
        };

        const result = [];
        for (let i = 0; i < n; i++) {
            let end = i;
            if (end === start)
                continue;
            const path = [];
            const weight = dist[end];
            while (end != -1) {
                path.push(end);
                end = prev[end];
            }
            path.reverse();
            result.push(new Path(path, weight));
        }

        return { result, bystep };
    }

    generateCoords() {
        let plot_size_x = 0;
        let plot_size_y = 0;
        switch (this.display) {
            case 'default':
            case 'empty-triangle':
                const nodes = this.nodes;
                const diameter = Settings.vertex.radius * 2;
                const spacing = Settings.vertex.spacing;

                // количество вершин графа на каждой из сторон треугольника (минус один)
                let n1, n2, n3;

                // расчитываем сколько вершин на каждой из сторон треугольника
                // и считаем отступы от центра для вершин на нижней стороне
                if (nodes % 3 === 0) {
                    n1 = Math.floor(nodes / 3) + 1;
                    n2 = Math.floor(nodes / 3) - 1;
                    n3 = Math.floor(nodes / 3);
                } else if (nodes % 3 === 1) {
                    if (nodes % 2 === 0) {
                        n1 = Math.floor(nodes / 3) + 1;
                        n2 = n3 = Math.floor(nodes / 3);
                    } else {
                        n1 = Math.floor(nodes / 3) + 1;
                        n2 = n3 = Math.floor(nodes / 3);
                    }
                } else if (nodes % 3 === 2) {
                    if (nodes % 2 === 0) {
                        n1 = n2 = Math.floor(nodes / 3) + 1;
                        n3 = Math.floor(nodes / 3);
                    } else {
                        n1 = n2 = Math.floor(nodes / 3) + 1;
                        n3 = Math.floor(nodes / 3);
                    }
                }

                const l = 2 * diameter * spacing * (n1 - 1);
                const x = l / (n2 + 1);

                // генерируем координаты для n1-1 вершин графа на первой стороне треугольника
                for (let n = 0; n < n1; n++) {
                    this.config.coords.push({
                        x: diameter * spacing * n,
                        y: diameter * spacing * n
                    });
                }
                // генерируем координаты для n2-1 вершин графа на второй стороне треугольника
                for (let n = 0; n < n2; n++) {
                    const nodeCoords = {};
                    nodeCoords.x = diameter * spacing * (n1 - 1) - x * (n + 1);
                    nodeCoords.y = diameter * spacing * (n1 - 1);
                    this.config.coords.push(nodeCoords);
                }
                // генерируем координаты для n3-1 вершин графа на третей стороне треугольника
                for (let n = 0; n < n3; n++) {
                    this.config.coords.push({
                        x: - diameter * spacing * (n1 - 1) + diameter * spacing * n,
                        y: + diameter * spacing * (n1 - 1) - diameter * spacing * n
                    });
                }
                
                plot_size_x = 2 * (this.config.coords[n1 - 1].x + diameter / 2);//+ diameter*1;
                plot_size_y = this.config.coords[n1 - 1].y + diameter / 2 + diameter*spacing;//+ diameter * 1;

                // отступы сверху и слева от графа
                for (let c of this.config.coords) {
                    c.x += this.config.plot_x_offfset + plot_size_x / 2;
                    c.y += this.config.plot_y_offfset + diameter / 4;
                }

                // отступы снизу и справа от графа
                plot_size_x += this.config.plot_x_offfset + plot_size_x / 8;
                plot_size_y += this.config.plot_y_offfset + diameter / 2;
                break;
        }
        this.setSize(plot_size_x, plot_size_y);
        return this;
    }

};

