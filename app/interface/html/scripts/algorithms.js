'use strict';

class Algorithms extends Interface {

    static clearCondensation() {
        DOM.GetById("condensation").setText("");
    }
    static getCondensation() {
        const condensation = this.graph.condensation();
        const strMatrix = Matrix.toString(condensation);
        DOM.GetById("condensation").setText(strMatrix);
    }

    static clearRoutes() {
        DOM.GetById("routes").setHTML("");
    }

    static getRoutes() {
        DOM.GetById("routes").setHTML("");
        const length = Number(DOM.GetById("routes-length").value);
        if (length) {
            const routes = this.graph.routes(length);
            if (!routes) return;
            for (let i = 0; i < routes.length; i++) {
                for (let j = 0; j < routes[i].length; j++) {
                    routes[i][j]++;
                }
                routes[i] = routes[i].join(', ');
                routes[i] += ' } ';
                routes[i] = '{ ' + routes[i];
            }
            const strRouters = routes;
            for (let i = 3; i < routes.length; i += 4) {
                strRouters.splice(i, 0, "</p><p>");
            }
            strRouters.unshift("<p>");
            strRouters.push("</p>");
            const strRoutes = strRouters.join('');
            DOM.GetById("routes").setHTML(strRoutes);
        }
    }

    static bfs = null;
    static clearBFS() {
        DOM.GetById("bfs-node").setHTML("");
        DOM.GetById("bfs").setHTML("");
    }
    static getBFS() {
        const node = Number(DOM.GetById("bfs-node").value);
        DOM.GetById("bfs-node").setHTML("");
        DOM.GetById("bfs").setHTML("");

        if (!node && !isNaN(node)) {
            this.bfs = null;
            return false;
        }

        const { bfs, matrix } = this.graph.bfs(node - 1);
        this.bfs = bfs;

        DOM.GetById("bfs").setHTML("<p></p>");
        DOM.GetBySelector("#bfs > p").setHTML(`{ ${node}`);
        const condensation = [];
        for (let i = 0; i < matrix.length; i++) {
            condensation[i] = matrix[i].join(' ');
        }
        const strMatrix = condensation.join('\n');
        DOM.GetById('adj-matrix').value = strMatrix;

        return true;
    }
    static BFSstep() {
        let ret = true;
        if (!this.bfs) {
            if (!this.getBFS()) return false;
        } else {
            if (this.bfs.step()) {
                for (const node in this.bfs.nodesColor) {
                    if (this.bfs.nodesColor[node] === BFS.ACTIVE_NODE_COLOR) {
                        DOM.GetBySelector("#bfs > p").addHTML(`, ${Number(node) + 1}`);
                    }
                }
            } else {
                DOM.GetBySelector("#bfs > p").addHTML(" }");
                ret = false;
            }
        }

        return ret;
    }

    static getBFSFull() {
        while (this.BFSstep()) {
        }
        this.bfs = null;
    }

    static buildBFSFull() {
        while (this.BFSstep()) {
            this.refreshCanvas(this.bfs.nodesColor, this.bfs.labelsInfo);
        }
        this.refreshCanvas(this.bfs.nodesColor, this.bfs.labelsInfo);
        this.bfs = null;
    }

    static getBFSstep() {
        if (!this.BFSstep()) {
            this.bfs = null;
        }
    }
    static buildBFSstep() {
        const ret = this.BFSstep();
        this.refreshCanvas(this.bfs.nodesColor, this.bfs.labelsInfo);
        if (!ret) {
            this.bfs = null;
        }
    }

    static clearReachability() {
        DOM.GetById("reachability").setText("");
    }
    static getReachability() {
        const reachability = this.graph.reachability();
        const strMatrix = Matrix.toString(reachability);
        DOM.GetById("reachability").setText(strMatrix);
    }

    static clearStrongBindingMatrix() {
        DOM.GetById("strongBindingM").setText("");
    }
    static getStrongBindingMatrix() {
        const matrix = this.graph.strongBindingMatrix();
        const strMatrix = Matrix.toString(matrix);
        DOM.GetById("strongBindingM").setText(strMatrix);
    }

    static clearStrongBindingComponents() {
        DOM.GetById("strongBindingC").setHTML("");
    }
    static getStrongBindingComponents() {
        const components = this.graph.strongBindingComponents();
        for (let i = 0; i < components.length; i++) {
            components[i] = components[i].join(", ");
            components[i] += ' }';
            components[i] = `K${i + 1}: { ` + components[i];
        }
        const strComponents = "<p>" + components.join('</p><p>');
        DOM.GetById("strongBindingC").setHTML(strComponents);
    }

    static buildCondensGraph() {
        const condensation = this.graph.condensation();
        for (let i = 0; i < condensation.length; i++) {
            condensation[i] = condensation[i].join(' ');
        }
        const strMatrix = condensation.join('\n');
        DOM.GetById('adj-matrix').value = strMatrix;
        this.refreshCanvas();
    }

    static mstweight = 0;
    static mst_m = 0;
    static mst_visited = null;
    static mstmatrix = null;
    static mststep = 0;
    static minSpanTree() {
        const mst = this.graph.minSpanningTree();
        Algorithms.mstmatrix = [];
        for (let i = 0; i <= mst.length; i++) {
            Algorithms.mstmatrix.push(new Array(mst.length + 1));
            Algorithms.mstmatrix[i].fill(0);
        }

        for (let i = 0; i < mst.length; i++) {
            Algorithms.mstmatrix[mst[i].u][mst[i].v] = 1;
        }

        Algorithms.mstColored = [];
        Algorithms.mst_visited = [];
        DOM.GetById('mst').setHTML('<p></p>');
        DOM.GetBySelector('#mst > p').setText('{');
    }
    static clearMST() {
        if (Algorithms.mst) {
        }
        Algorithms.clearMinSpanTree();
        DOM.GetBySelector('#mst > p').setText('');
    }
    static clearMinSpanTree() {
        Algorithms.mstweight = 0;
        Algorithms.mstmatrix = null;
        Algorithms.mst_m = 0;
        Algorithms.mst_visited = null;
    }
    static stepMST() {

        if (!Algorithms.mstmatrix) {
            Algorithms.minSpanTree();
            DOM.GetBySelector('#mst > p').addText(` ${Algorithms.mst_m + 1},`);
            Algorithms.mstColored.push(Algorithms.mst_m);
            Algorithms.mst_visited.push(Algorithms.mst_m);
        }


        let isRowEnds = true;
        for (let i = 0; i < Algorithms.mstmatrix[Algorithms.mst_m].length; i++) {
            if (Algorithms.mstmatrix[Algorithms.mst_m][i]) {
                let isVisited = false;
                for (const visited_i of Algorithms.mst_visited) {
                    if (i === visited_i)
                        isVisited = true;
                }
                if (isVisited) continue;
                Algorithms.mstweight += this.graph.w_matrix[Algorithms.mst_m][i];
                Algorithms.mst_m = i;
                isRowEnds = false;
                break;
            }
        }

        return isRowEnds;
    }
    static getMSTstep() {
        if (Algorithms.stepMST()) {
            let index = Algorithms.mst_visited.indexOf(Algorithms.mst_m) - 1;
            Algorithms.mst_m = Algorithms.mst_visited[index];
            return Algorithms.getMSTstep();
        } else {
            DOM.GetBySelector('#mst > p').addText(` ${Algorithms.mst_m + 1}`);
            Algorithms.mst_visited.push(Algorithms.mst_m);

            if (Algorithms.mst_visited.length === Algorithms.mstmatrix.length) {
                DOM.GetBySelector('#mst > p').addText(` } (weight: ${Algorithms.mstweight})`);
                return false;
            } else {
                DOM.GetBySelector('#mst > p').addText(',');
            }
        }
        return true;
    }
    static buildMSTstep() {
        const ret = Algorithms.getMSTstep();

        let strMatrix = [];
        for (let i = 0; i < Algorithms.mstmatrix.length; i++) {
            strMatrix.push([]);
            for (let j = 0; j < Algorithms.mstmatrix.length; j++) {
                strMatrix[i].push(Algorithms.mstmatrix[i][j] && Algorithms.mst_visited.indexOf(j) != -1 ? 1 : 0);
            }
        }
        for (let i = 0; i < Algorithms.mstmatrix.length; i++) {
            strMatrix[i] = strMatrix[i].join(' ');
        }

        strMatrix = strMatrix.join('\n');
        DOM.GetById('adj-matrix').value = strMatrix;
        this.refreshCanvas();
        if (!ret)
            Algorithms.clearMinSpanTree();

        return ret;
    }
    static getMSTFull() {
        while (Algorithms.getMSTstep()) {
        }
    }
    static buildMSTFull() {
        while (Algorithms.buildMSTstep()) {
        }
        Algorithms.clearMinSpanTree();
    }

    static dij_step = 0;
    static dij_result = null;
    static dij_bystep = null;
    static getDijkstra() {
        Algorithms.clearDijkstra();
        const startNode = DOM.GetById('dij-start').value;
        if (!startNode)
            return;
        const { result, bystep } = this.graph.FindShordestWay(startNode - 1);
        Algorithms.dij_result = result;
        Algorithms.dij_bystep = bystep;
    }
    static getDijkstraFull() {
        Algorithms.getDijkstra();
        DOM.GetById('dij').setHTML('');
        for (const path of Algorithms.dij_result) {
            const tabulation = String(path.weight).length < 5 ?
                ' '.repeat(5 - String(path.weight).length) :
                ' '
            DOM.GetById('dij').addHTML(`<big><pre>weight: ${path.weight}${tabulation}way: ${path.way.map(el => ++el).join(' -> ')}</pre></big>`);
        }
    }
    static buildDijkstraStep() {
        const DEFAULT_NODE_COLOR = Settings.vertex.color.default;
        const ACTIVE_NODE_COLOR = Settings.vertex.color.active;
        const VISITED_NODE_COLOR = Settings.vertex.color.visited;
        if (!Algorithms.dij_result) {
            Algorithms.getDijkstraFull();
        }
        const { widths } = this.graph.FindShordestWay(Algorithms.dij_bystep[Algorithms.dij_step].lastVisited);
        if (Algorithms.dij_step === Algorithms.dij_result.length) {
            const nodesColor = new Array(Algorithms.dij_result.length + 1).fill(DEFAULT_NODE_COLOR);
            const step = Algorithms.dij_bystep[Algorithms.dij_step];
            nodesColor[step.active] = VISITED_NODE_COLOR;
            for (const v of step.visited) {
                nodesColor[v] = VISITED_NODE_COLOR;
            }
            this.refreshCanvas(nodesColor, widths);
            return;
        }

        const nodesColor = new Array(Algorithms.dij_result.length + 1).fill(DEFAULT_NODE_COLOR);

        const step = Algorithms.dij_bystep[Algorithms.dij_step];
        nodesColor[step.active] = ACTIVE_NODE_COLOR;
        for (const v of step.visited) {
            nodesColor[v] = VISITED_NODE_COLOR;
        }
        Algorithms.dij_step++;
        this.refreshCanvas(nodesColor, widths);
    }
    static clearDijkstra() {
        Algorithms.dij_bystep = null;
        Algorithms.dij_result = null;
        Algorithms.dij_step = 0;
        DOM.GetById('dij').setHTML('');
    }
};
