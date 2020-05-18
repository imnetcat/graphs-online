'use strict';

class Interface {
    
    static graph;

    static showMenu(flag) {
        if (flag) {
            DOM.getById('menu-panel').show();
            Interface.showInfo(false);
        } else {
            DOM.getById('menu-panel').hide();
        }
    }

    static showInfo(flag) {
        if (flag) {
            DOM.getById('info-box').show();
            Interface.showMenu(false);
        } else {
            DOM.getById('info-box').hide();
        }
    }

    static setInfo(info) {
        DOM.getById("unified").setHTML((info.uni === -1) ? "false" : info.uni.toString());

        const infoTable = DOM.getById("nodes-props");

        infoTable.delAllRows(1);

        for (let i = 0; i < info.degrees.length; i++) {
            const row = infoTable.addRow(i + 1);
            row.addCell(0).setHTML(`<b>${(i + 1).toString()}</b>`);
            if (info.isOrientired) {
                row.addCell(1).setHTML(`+ ${info.degrees[i].from.toString()}<br>- ${info.degrees[i].to.toString()}`);
            } else {
                row.addCell(1).setHTML(info.degrees[i].sum().toString());
            }
            row.addCell(2).setHTML((info.hangingNodes[i]) ? "Yes" : "");
            row.addCell(3).setHTML((info.isolatedNodes[i]) ? "Yes" : "");
        }

        const weightTable = DOM.getById("ribs-weight");
        weightTable.setHTML('');
        let row = weightTable.addRow(0);
        for (let i = 0; i < info.weight.length; i++) {
            row.addCell(i).setText(i+1);
        }
        row.addCell(0).setText('');
        for (let i = 1; i <= info.weight.length; i++) {
           row = weightTable.addRow(i);
           row.addCell(0).setText(i);
        }

        for (let i = 0; i < info.weight.length; i++) {
            row = weightTable.row(i+1);
            for (let j = 0; j < info.weight[i].length; j++) {
                row.addCell(j+1).setText(info.weight[i][j]);
            }
        }
    }

    static isMatrixCorrect(matrix) {
        if (!matrix.length) {
            return false;
        }
        if (matrix.length !== matrix[0].length) {
            return false;
        }
        for (const i of matrix) {
            for (const j of i) {
                if (j === 1) continue;
                if (j === 0) continue;
                return false;
            }
        }
        return true;
    }

    static clearCondensation() {
        DOM.getById("condensation").setText("");
    }
    static getCondensation () {
        const condensation = this.graph.condensation();
        const strMatrix = Matrix.toString(condensation);
        DOM.getById("condensation").setText(strMatrix);
    }

    static clearRoutes() {
        DOM.getById("routes").setHTML("");
    }

    static getRoutes() {
        DOM.getById("routes").setHTML("");
        const length = Number(DOM.getById("routes-length").value);
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
            DOM.getById("routes").setHTML(strRoutes);
        }
    }

    static bfs = null;
    static clearBFS() {
        DOM.getById("bfs-node").setHTML("");
        DOM.getById("bfs").setHTML("");
    }
    static getBFS() {
        const node = Number(DOM.getById("bfs-node").value);
        DOM.getById("bfs-node").setHTML("");
        DOM.getById("bfs").setHTML("");
        
        if (!node && !isNaN(node)) {
            this.bfs = null;
            return false;
        }
        
        const { bfs, matrix } = this.graph.bfs(node - 1);
        this.bfs = bfs;

        DOM.getById("bfs").setHTML("<p></p>");
        DOM.getBySelector("#bfs > p").setHTML(`{ ${node}`);
        const condensation = [];
        for (let i = 0; i < matrix.length; i++) {
            condensation[i] = matrix[i].join(' ');
        }
        const strMatrix = condensation.join('\n');
        DOM.getById('adj-matrix').value = strMatrix;

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
                        DOM.getBySelector("#bfs > p").addHTML(`, ${Number(node) + 1}`);
                    }
                }
            } else {
                DOM.getBySelector("#bfs > p").addHTML(" }");
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
        DOM.getById("reachability").setText("");
    }
    static getReachability() {
        const reachability = this.graph.reachability();
        const strMatrix = Matrix.toString(reachability);
        DOM.getById("reachability").setText(strMatrix);
    }

    static clearStrongBindingMatrix() {
        DOM.getById("strongBindingM").setText("");
    }
    static getStrongBindingMatrix() {
        const matrix = this.graph.strongBindingMatrix();
        const strMatrix = Matrix.toString(matrix);
        DOM.getById("strongBindingM").setText(strMatrix);
    }

    static clearStrongBindingComponents() {
        DOM.getById("strongBindingC").setHTML("");
    }
    static getStrongBindingComponents() {
        const components = this.graph.strongBindingComponents();
        for (let i = 0; i < components.length; i++) {
            components[i] = components[i].join(", ");
            components[i] += ' }';
            components[i] = `K${i + 1}: { ` + components[i];
        }
        const strComponents = "<p>" + components.join('</p><p>');
        DOM.getById("strongBindingC").setHTML(strComponents);
    }

    static buildCondensGraph() {
        const condensation = this.graph.condensation();
        for (let i = 0; i < condensation.length; i++) {
            condensation[i] = condensation[i].join(' ');
        }
        const strMatrix = condensation.join('\n');
        DOM.getById('adj-matrix').value = strMatrix;
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
        DOM.getById('mst').setHTML('<p></p>');
        DOM.getBySelector('#mst > p').setText('{');
    }
    static clearMST() {
        if (Interface.mst) {
        }
        Interface.clearMinSpanTree();
        DOM.getBySelector('#mst > p').setText('');
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
            DOM.getBySelector('#mst > p').addText(` ${Interface.mst_m + 1},`);
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
            DOM.getBySelector('#mst > p').addText(` ${Interface.mst_m + 1}`);
            Interface.mst_visited.push(Interface.mst_m);
             
            if (Interface.mst_visited.length === Interface.mstmatrix.length) {
                DOM.getBySelector('#mst > p').addText(` } (weight: ${Interface.mstweight})`);
                return false;
            } else {
                DOM.getBySelector('#mst > p').addText(',');
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
        DOM.getById('adj-matrix').value = strMatrix;
        this.refreshCanvas();
        if(!ret)
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

    static getDijkstraFull() {
        const startNode = DOM.getById('dij-start').value;
        const destNode = DOM.getById('dij-end').value;
        if (!startNode || !destNode)
            return;

        const dij = this.graph.findShortestPaths(startNode, destNode);
        DOM.getById('dij').setHTML(dij);
    }
    static clearDijkstra() {
        DOM.getById('dij').setHTML('');
    }

    
    static drawGraphs(adj_matrix, w_matrix, options) {
        const canvId = "canv";
        const canvas = new Canvas(canvId).clear('2d');

        this.graph = new Graph(adj_matrix);

        if (w_matrix) {
            this.graph.weight(w_matrix)
        }

        this.graph.orientired(options.orientired)
            .displayForm(options.form)
            .generateCoords();

        canvas.setSize(this.graph.getSize())
            .draw(this.graph, options.nodesColor, options.labelsInfo);

        const degrees = this.graph.degrees();
        const uni = this.graph.isUni();
        const hangingNodes = this.graph.hangingNodes();
        const isolatedNodes = this.graph.isolatedNodes();
        const isOrientired = this.graph.isOrientired();
        const weight = this.graph.w_matrix;
        this.setInfo({
            uni,
            degrees,
            hangingNodes,
            weight,
            isolatedNodes,
            isOrientired
        });
    }
    static refreshCanvas(nodesColor, labelsInfo) {
        this.showInfo(true);
        this.showMenu(false);

        const form = new FormData(document.forms.menu);
        const adj_matrixStr = DOM.getById('adj-matrix').value.split('\n');
        let w_matrixStr = DOM.getById('weight-matrix').value;
        const w_matrix = [];
        
        const adj_matrix = [];
        for (const row of adj_matrixStr) {
            adj_matrix.push([]);
            const elems = row.split(' ');
            for (const elem of elems) {
                adj_matrix[adj_matrix.length - 1].push(Number(elem));
            }
        }

        if (!this.isMatrixCorrect(adj_matrix)) {
            alert('You entered the wrong adjacency matrix');
            return;
        }

        if (w_matrixStr) {
            w_matrixStr = w_matrixStr.split('\n');
            for (const row of w_matrixStr) {
                w_matrix.push([]);
                const elems = row.split(' ');
                for (const elem of elems) {
                    w_matrix[w_matrix.length - 1].push(Number(elem));
                }
            }
            if (adj_matrix.length != w_matrix.length || adj_matrix[0].length != w_matrix[0].length) {
                alert('You entered the wrong weight matrix');
                return;
            }
        }

        nodesColor = nodesColor || new Array(adj_matrix.length).fill("#ffffff")
        const orientired = form.get('orientiation');
        const displayForm = form.get('display-form');
        const options = {
            orientired: orientired === 'orientired' ? true : false,
            form: displayForm,
            nodesColor,
            labelsInfo
        }

        this.drawGraphs(adj_matrix, w_matrix, options);
    }
};

const loadDefaultGraph = () => {
    Interface.refreshCanvas();
}

document.addEventListener('DOMContentLoaded', loadDefaultGraph)
