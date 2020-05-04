'use strict';

class Interface {

    static isMenuShowed = false;
    static isInfoShowed = false;

    static graph;

    static showMenu(show = true) {
        if (show) {
            this.isMenuShowed = !this.isMenuShowed;
            this.showInfo(false);
        } else {
            this.isMenuShowed = false;
        }
        if (this.isMenuShowed) {
            const width = document.getElementById('scrollable').offsetWidth;
            const height = document.getElementById('scrollable').offsetHeight;

            document.getElementById('menu-panel').style.width = `${width - 30}px`;
            document.getElementById('menu-panel').style.height = `${height - 30}px`;
            document.getElementById('menu-panel').style.display = "inherit";
        } else {
            document.getElementById('menu-panel').style.display = "none";
        }
    }

    static showInfo(show = true) {
        if (show) {
            this.isInfoShowed = !this.isInfoShowed;
            this.showMenu(false);
        } else {
            this.isInfoShowed = false;
        }
        if (this.isInfoShowed) {
            const width = document.getElementById('scrollable').offsetWidth;
            const height = document.getElementById('scrollable').offsetHeight;

            document.getElementById('info-box').style.width = `${width - 30}px`;
            document.getElementById('info-box').style.height = `${height - 30}px`;
            document.getElementById('info-box').style.display = "inherit";
        } else {
            document.getElementById('info-box').style.display = "none";
        }
    }

    static setInfo(info) {
        document.getElementById("unified").innerHTML = (info.uni === -1) ? "false" : info.uni.toString();

        const infoTable = document.getElementById("nodes-props");

        const rows = infoTable.getElementsByTagName("tr")
        for (let i = 1; i < rows.length; i) {
            infoTable.deleteRow(i);
        }

        for (let i = 0; i < info.degrees.length; i++) {
            const row = infoTable.insertRow(i + 1);
            row.insertCell(0).innerHTML = `<b>${(i + 1).toString()}</b>`;
            if (info.isOrientired) {
                row.insertCell(1).innerHTML = `+ ${info.degrees[i].from.toString()}<br>- ${info.degrees[i].to.toString()}`;
            } else {
                row.insertCell(1).innerHTML = info.degrees[i].sum().toString();
            }
            row.insertCell(2).innerHTML = (info.hangingNodes[i]) ? "Yes" : "";
            row.insertCell(3).innerHTML = (info.isolatedNodes[i]) ? "Yes" : "";
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

    static getCondensation () {
        const condensation = this.graph.condensation();
        const strMatrix = Matrix.toString(condensation);
        document.getElementById("condensation").innerText = strMatrix;
    }

    static getRoutes() {
        document.getElementById("routes").innerHTML = "";
        const length = Number(document.getElementById("routes-length").value);
        if (length) {
            const routes = this.graph.routes(length);
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
            document.getElementById("routes").innerHTML = strRoutes;
        }
    }

    static bfs = null;
    static getBFS() {
        document.getElementById("bfs-node").innerHTML = "";
        const node = Number(document.getElementById("bfs-node").value);
        document.getElementById("bfs").innerHTML = "";
        
        if (!node) {
            this.bfs = null;
            return false;
        }

        const { bfs, matrix } = this.graph.bfs(node - 1);
        this.bfs = bfs;

        document.getElementById("bfs").innerHTML = "<p></p>";
        document.querySelector("#bfs > p").innerHTML = `{ ${node}`;
        const condensation = [];
        for (let i = 0; i < matrix.length; i++) {
            condensation[i] = matrix[i].join(' ');
        }
        const strMatrix = condensation.join('\n');
        document.getElementById('matrix-input').value = strMatrix;

        return true;
    }

    static getBFSFull() {
        while (this.getBFSstep()) {

        }
    }

    static getBFSstep() {
        let ret = true;
        if (!this.bfs) {
            this.getBFS();
        } else {
            if (this.bfs.step()) {
                for (const node in this.bfs.nodesColor) {
                    if (this.bfs.nodesColor[node] === BFS.ACTIVE_NODE_COLOR) {
                        document.querySelector("#bfs > p").innerHTML += `, ${Number(node) + 1}`;
                    }
                }
            } else {
                document.querySelector("#bfs > p").innerHTML += " }";
                ret = false;
            }
        }

        this.refreshCanvas(this.bfs.nodesColor, this.bfs.labelsInfo);
        if (!ret) {
            this.bfs = null;
        }
        return ret;
    }

};

Interface.getReachability = function() {
    const reachability = this.graph.reachability();
    const strMatrix = Matrix.toString(reachability);
    document.getElementById("reachability").innerText = strMatrix;
}
Interface.getStrongBindingMatrix = function() {
    const matrix = this.graph.strongBindingMatrix();
    const strMatrix = Matrix.toString(matrix);
    document.getElementById("strongBindingM").innerText = strMatrix;
}
Interface.getStrongBindingComponents = function() {
    const components = this.graph.strongBindingComponents();
    for (let i = 0; i < components.length; i++) {
        components[i] = components[i].join(", ");
        components[i] += ' }';
        components[i] = `K${i+1}: { ` + components[i];
    }
    const strComponents = "<p>" + components.join('</p><p>');
    document.getElementById("strongBindingC").innerHTML = strComponents;
}

Interface.drawGraphs = function(matrix, options) {
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

Interface.refreshCanvas = function(nodesColor, labelsInfo) {
    this.showInfo(false);
    this.showMenu(false);

    const form = new FormData(document.forms.menu);
    const matrixStr = document.getElementById('matrix-input').value.split('\n');

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

Interface.buildCondensGraph = function() {
    const condensation = this.graph.condensation();
    for (let i = 0; i < condensation.length; i++) {
        condensation[i] = condensation[i].join(' ');
    }
    const strMatrix = condensation.join('\n');
    document.getElementById('matrix-input').value = strMatrix;
    this.refreshCanvas();
}

const loadDefaultGraph = () => {
    Interface.refreshCanvas();
}

document.addEventListener('DOMContentLoaded', loadDefaultGraph)
