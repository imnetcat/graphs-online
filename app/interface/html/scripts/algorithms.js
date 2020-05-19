'use strict';

class Algorithms {

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
        Interface.mstmatrix = [];
        for (let i = 0; i <= mst.length; i++) {
            Interface.mstmatrix.push(new Array(mst.length + 1));
            Interface.mstmatrix[i].fill(0);
        }

        for (let i = 0; i < mst.length; i++) {
            Interface.mstmatrix[mst[i].u][mst[i].v] = 1;
        }

        Interface.mstColored = [];
        Interface.mst_visited = [];
        DOM.GetById('mst').setHTML('<p></p>');
        DOM.GetBySelector('#mst > p').setText('{');
    }
    static clearMST() {
        if (Interface.mst) {
        }
        Interface.clearMinSpanTree();
        DOM.GetBySelector('#mst > p').setText('');
    }
    static clearMinSpanTree() {
        Interface.mstweight = 0;
        Interface.mstmatrix = null;
        Interface.mst_m = 0;
        Interface.mst_visited = null;
    }
    static stepMST() {

        if (!Interface.mstmatrix) {
            Interface.minSpanTree();
            DOM.GetBySelector('#mst > p').addText(` ${Interface.mst_m + 1},`);
            Interface.mstColored.push(Interface.mst_m);
            Interface.mst_visited.push(Interface.mst_m);
        }


        let isRowEnds = true;
        for (let i = 0; i < Interface.mstmatrix[Interface.mst_m].length; i++) {
            if (Interface.mstmatrix[Interface.mst_m][i]) {
                let isVisited = false;
                for (const visited_i of Interface.mst_visited) {
                    if (i === visited_i)
                        isVisited = true;
                }
                if (isVisited) continue;
                Interface.mstweight += this.graph.w_matrix[Interface.mst_m][i];
                Interface.mst_m = i;
                isRowEnds = false;
                break;
            }
        }

        return isRowEnds;
    }
    static getMSTstep() {
        if (Interface.stepMST()) {
            let index = Interface.mst_visited.indexOf(Interface.mst_m) - 1;
            Interface.mst_m = Interface.mst_visited[index];
            return Interface.getMSTstep();
        } else {
            DOM.GetBySelector('#mst > p').addText(` ${Interface.mst_m + 1}`);
            Interface.mst_visited.push(Interface.mst_m);

            if (Interface.mst_visited.length === Interface.mstmatrix.length) {
                DOM.GetBySelector('#mst > p').addText(` } (weight: ${Interface.mstweight})`);
                return false;
            } else {
                DOM.GetBySelector('#mst > p').addText(',');
            }
        }
        return true;
    }
    static buildMSTstep() {
        const ret = Interface.getMSTstep();

        let strMatrix = [];
        for (let i = 0; i < Interface.mstmatrix.length; i++) {
            strMatrix.push([]);
            for (let j = 0; j < Interface.mstmatrix.length; j++) {
                strMatrix[i].push(Interface.mstmatrix[i][j] && Interface.mst_visited.indexOf(j) != -1 ? 1 : 0);
            }
        }
        for (let i = 0; i < Interface.mstmatrix.length; i++) {
            strMatrix[i] = strMatrix[i].join(' ');
        }

        strMatrix = strMatrix.join('\n');
        DOM.GetById('adj-matrix').value = strMatrix;
        this.refreshCanvas();
        if (!ret)
            Interface.clearMinSpanTree();

        return ret;
    }
    static getMSTFull() {
        while (Interface.getMSTstep()) {
        }
    }
    static buildMSTFull() {
        while (Interface.buildMSTstep()) {
        }
        Interface.clearMinSpanTree();
    }

    static dij_step = 0;
    static dij_result = null;
    static dij_bystep = null;
    static getDijkstra() {
        Interface.clearDijkstra();
        const startNode = DOM.GetById('dij-start').value;
        if (!startNode)
            return;
        const { result, bystep } = this.graph.FindShordestWay(startNode - 1);
        Interface.dij_result = result;
        Interface.dij_bystep = bystep;
    }
    static getDijkstraFull() {
        Interface.getDijkstra();
        DOM.GetById('dij').setHTML('');
        for (const path of Interface.dij_result) {
            const tabulation = String(path.weight).length < 5 ?
                ' '.repeat(5 - String(path.weight).length) :
                ' '
            DOM.GetById('dij').addHTML(`<big><pre>weight: ${path.weight}${tabulation}way: ${path.way.map(el => ++el).join(' -> ')}</pre></big>`);
        }
    }
    static buildDijkstraStep() {
        const DEFAULT_NODE_COLOR = "#ffffff";
        const ACTIVE_NODE_COLOR = "#6cc674";
        const VISITED_NODE_COLOR = "#c0c0c0";
        if (!Interface.dij_result) {
            Interface.getDijkstraFull();
        }
        if (Interface.dij_step === Interface.dij_result.length) {
            const nodesColor = new Array(Interface.dij_result.length + 1).fill(DEFAULT_NODE_COLOR);
            const step = Interface.dij_bystep[Interface.dij_step];
            nodesColor[step.active] = VISITED_NODE_COLOR;
            for (const v of step.visited) {
                nodesColor[v] = VISITED_NODE_COLOR;
            }
            this.refreshCanvas(nodesColor);
            return;
        }

        const nodesColor = new Array(Interface.dij_result.length + 1).fill(DEFAULT_NODE_COLOR);

        const step = Interface.dij_bystep[Interface.dij_step];
        nodesColor[step.active] = ACTIVE_NODE_COLOR;
        for (const v of step.visited) {
            nodesColor[v] = VISITED_NODE_COLOR;
        }
        console.log(nodesColor, Interface.dij_result.length)
        Interface.dij_step++;
        this.refreshCanvas(nodesColor);
    }
    static clearDijkstra() {
        Interface.dij_bystep = null;
        Interface.dij_result = null;
        Interface.dij_step = 0;
        DOM.GetById('dij').setHTML('');
    }
};
