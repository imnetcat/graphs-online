'use strict';

class Interface {
    
    static graph;

    static menus = [];

    static Show(id) {
        for (const menu of Interface.menus) {
            if (menu.id === id) {
                menu.Show();
            } else {
                menu.Hide();
            }
        }
    }
    
    static setInfo(info) {
        DOM.GetById("unified").setHTML((info.uni === -1) ? "false" : info.uni.toString());

        const infoTable = DOM.GetById("nodes-props");

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

        const weightTable = DOM.GetById("ribs-weight");
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
        DOM.GetById("condensation").setText("");
    }
    static getCondensation () {
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

        const nodesColor = new Array(Interface.dij_result.length+1).fill(DEFAULT_NODE_COLOR);

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

        const form = new FormData(document.forms.menu);
        const adj_matrixStr = DOM.GetById('adj-matrix').value.split('\n');
        let w_matrixStr = DOM.GetById('weight-matrix').value;
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

// настраиваем интерфейс по дефолтным значиниям после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // добавляем все меню
    Interface.menus.push(new Menu('settings'));
    Interface.menus.push(new Menu('properties'));
    Interface.menus.push(new Menu('algorithms'));
    Interface.menus.push(new Menu('definition'));

    // устанавливаем меню видимое по умолчанию
    Interface.Show('definition');

    // загружаем пример графа
    Interface.refreshCanvas();
})
