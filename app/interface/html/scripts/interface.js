'use strict';

class Interface {};

Interface.isMenuShowed = false;
Interface.isInfoShowed = false;

Interface.graph;

Interface.showMenu = function(show = true) {
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

Interface.showInfo = function(show = true) {
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

Interface.setInfo = function(info) {
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

Interface.isMatrixCorrect = function(matrix) {
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

Interface.getCondensation = function() {
    const condensation = this.graph.condensation();
    const strMatrix = Matrix.toString(condensation);
    document.getElementById("condensation").innerText = strMatrix;
}
Interface.getRoutes = function() {
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

Interface.bsfstart = true;
Interface.visited = [];
Interface.colored = [];
Interface.queqe = [];
Interface.bfs = [];
Interface.labelsInfo = [];
Interface.bfslevel = 0;
Interface.getBFS = function() {
    this.bfslevel = 0;
    this.bsfstart = true;
    this.visited = [];
    this.queqe = [];
    this.bfs = [];
    this.labelsInfo = [];
    do {
        this.getBFSstep();
    } while (!this.bsfstart);
}
Interface.getBFSstep = function() {
    if (this.bsfstart) {
        document.getElementById("bfs-node").innerHTML = "";
        const node = Number(document.getElementById("bfs-node").value);
        document.getElementById("bfs").innerHTML = "";
        if (node) {
            this.bfslevel = 2;
            this.bfs = this.graph.bfs(node - 1);
            this.visited = new Array(this.bfs.length).fill(false);
            this.visited[node - 1] = true;
            this.queqe = new Array();
            this.queqe.push(node - 1);

            document.getElementById("bfs").innerHTML = "<p></p>";
            document.querySelector("#bfs > p").innerHTML = `{ ${node}`;
            this.bsfstart = false;
            const condensation = [];
            for (let i = 0; i < this.bfs.length; i++) {
                condensation[i] = this.bfs[i].join(' ');
            }
            const strMatrix = condensation.join('\n');
            document.getElementById('matrix-input').value = strMatrix;

            const nodesColor = new Array(this.bfs.length).fill("#ffffff");
            nodesColor[node - 1] = "#6cc674";
            this.colored.push(node - 1);

            this.labelsInfo.push({ i: node-1, text: 1 });
            
            this.refreshCanvas(nodesColor, this.labelsInfo);
        }
        
    } else if (this.queqe.length) {

        const nodesColor = new Array(this.bfs.length).fill("#ffffff");
        for (const i of this.colored) {
            nodesColor[i] = "#c0c0c0";
        }
        let isLineZeros = true;
        const row = this.bfs[this.queqe[0]];
        for (let u = 0; u < row.length; u++) {
            if (row[u] && !this.visited[u]) {
                this.visited[u] = true;
                this.queqe.push(u);
                this.bfs[this.queqe[0]][u] = 1;

                nodesColor[u] = "#6cc674";
                this.colored.push(u);
                
                document.querySelector("#bfs > p").innerHTML += `, ${u + 1}`;

                this.labelsInfo.push({ i: u, text: this.bfslevel });

                this.bfslevel++;

                isLineZeros = false;
            }
        }
        this.queqe.shift();

        this.refreshCanvas(nodesColor, this.labelsInfo);

        if (isLineZeros) {
            this.getBFSstep();
        }
        if (!this.queqe.length) {
            document.querySelector("#bfs > p").innerHTML += " }";
            this.bsfstart = true;
            this.visited = [];
            this.queqe = [];
            this.bfs = [];
            return;
        }
    }
}
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
