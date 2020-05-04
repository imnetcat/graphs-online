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
        DOM.getById('matrix-input').value = strMatrix;

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
        DOM.getById('matrix-input').value = strMatrix;
        this.refreshCanvas();
    }

    static drawGraphs(matrix, options) {
        const canvId = "canv";
        const canvas = Canvas(canvId).clear('2d');
        const context = canvas.context('2d');

        this.graph = new Graph(matrix, context);

        this.graph.orientired(options.orientired)
            .context(context)
            .displayForm(options.form)
            .generateCoords();
        canvas.setSize(this.graph.getSize());
        this.graph.draw(options.nodesColor, options.labelsInfo);

        const degrees = this.graph.degrees();
        const uni = this.graph.isUni();
        const hangingNodes = this.graph.hangingNodes();
        const isolatedNodes = this.graph.isolatedNodes();
        const isOrientired = this.graph.isOrientired();
        this.setInfo({
            uni,
            degrees,
            hangingNodes,
            isolatedNodes,
            isOrientired
        });
    }
    static refreshCanvas(nodesColor, labelsInfo) {
        this.showInfo(true);
        this.showMenu(false);

        const form = new FormData(document.forms.menu);
        const matrixStr = DOM.getById('matrix-input').value.split('\n');

        const matrix = [];
        for (const row of matrixStr) {
            matrix.push([]);
            const elems = row.split(' ');
            for (const elem of elems) {
                matrix[matrix.length - 1].push(Number(elem));
            }
        }

        if (!this.isMatrixCorrect(matrix)) {
            alert('You entered the wrong matrix');
            return;
        }
        nodesColor = nodesColor || new Array(matrix.length).fill("#ffffff")
        const orientired = form.get('orientiation');
        const displayForm = form.get('display-form');
        const options = {
            orientired: orientired === 'orientired' ? true : false,
            form: displayForm,
            nodesColor,
            labelsInfo
        }
        this.drawGraphs(matrix, options);
    }
};

const loadDefaultGraph = () => {
    Interface.refreshCanvas();
}

document.addEventListener('DOMContentLoaded', loadDefaultGraph)
