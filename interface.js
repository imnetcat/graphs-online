'use strict';

let isMenuShowed = false;
let isInfoShowed = false;

let graph;

const showMenu = (show = true) => {
    if (show) {
        isMenuShowed = !isMenuShowed;
        showInfo(false);
    } else {
        isMenuShowed = false;
    }
    if (isMenuShowed) {
        const width = document.getElementById('scrollable').offsetWidth;
        const height = document.getElementById('scrollable').offsetHeight;

        document.getElementById('menu-panel').style.width = `${width - 30}px`;
        document.getElementById('menu-panel').style.height = `${height - 30}px`;
        document.getElementById('menu-panel').style.display = "inherit";
    } else {
        document.getElementById('menu-panel').style.display = "none";
    }
}

const showInfo = (show = true) => {
    if (show) {
        isInfoShowed = !isInfoShowed;
        showMenu(false);
    } else {
        isInfoShowed = false;
    }
    if (isInfoShowed) {
        const width = document.getElementById('scrollable').offsetWidth;
        const height = document.getElementById('scrollable').offsetHeight;

        document.getElementById('info-box').style.width = `${width - 30}px`;
        document.getElementById('info-box').style.height = `${height - 30}px`;
        document.getElementById('info-box').style.display = "inherit";
    } else {
        document.getElementById('info-box').style.display = "none";
    }
}

const setInfo = (info) => {
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

const isMatrixCorrect = (matrix) => {
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

const getCondensation = () => {
    const condensation = graph.condensation();
    const strMatrix = Matrix.toString(condensation);
    document.getElementById("condensation").innerText = strMatrix;
}
const getRoutes = () => {
    document.getElementById("routes").innerHTML = "";
    const length = Number(document.getElementById("routes-length").value);
    if (length) {
        const routes = graph.routes(length);
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
let bfsstep = 0;
let bfs = [];
const getBFS = () => {
    bfsstep = 0;
    document.getElementById("bfs-node").innerHTML = "";
    const node = Number(document.getElementById("bfs-node").value);
    document.getElementById("bfs").innerHTML = "";
    if (node) {
        const bfs = graph.bfs(node - 1);
        console.log(bfs);
    }
}
const getBFSstep = () => {
    if (!bfsstep) {
        document.getElementById("bfs-node").innerHTML = "";
        const node = Number(document.getElementById("bfs-node").value);
        document.getElementById("bfs").innerHTML = "";
        if (node) {
            bfs = graph.bfs(node - 1).map(el => el + 1);
        }
        document.getElementById("bfs").innerHTML = "<p></p>";
        document.querySelector("#bfs > p").innerHTML = "{ ";
    }
    document.querySelector("#bfs > p").innerHTML += bfs[bfsstep];
    bfsstep++;
    if (bfsstep === bfs.length) {
        bfs = [];
        bfsstep = 0;
        document.querySelector("#bfs > p").innerHTML += " }";
    }
    else {
        document.querySelector("#bfs > p").innerHTML += ", ";
    }
}
const getReachability = () => {
    const reachability = graph.reachability();
    const strMatrix = Matrix.toString(reachability);
    document.getElementById("reachability").innerText = strMatrix;
}
const getStrongBindingMatrix = () => {
    const matrix = graph.strongBindingMatrix();
    const strMatrix = Matrix.toString(matrix);
    document.getElementById("strongBindingM").innerText = strMatrix;
}
const getStrongBindingComponents = () => {
    const components = graph.strongBindingComponents();


    for (let i = 0; i < components.length; i++) {
        components[i] = components[i].join(", ");
        components[i] += ' }';
        components[i] = `K${i+1}: { ` + components[i];
    }
    const strComponents = "<p>" + components.join('</p><p>');
    document.getElementById("strongBindingC").innerHTML = strComponents;
}

const drawGraphs = (matrix, options) => {
    const canvId = "canv";
    const canvas = Canvas(canvId).clear('2d');
    const context = canvas.context('2d');
    
    graph = new Graph(matrix, context);
    
    graph.orientired(options.orientired)
        .context(context)
        .displayForm(options.form)
        .generateCoords();
    canvas.setSize(graph.getSize());
    graph.draw();

    const degrees = graph.degrees();
    const uni = graph.isUni();
    const hangingNodes = graph.hangingNodes();
    const isolatedNodes = graph.isolatedNodes();
    const isOrientired = graph.isOrientired();
    setInfo({
        uni,
        degrees,
        hangingNodes,
        isolatedNodes,
        isOrientired
    })
}

const refreshCanvas = () => {
    showInfo(false);
    showMenu(false);

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

    if (!isMatrixCorrect(matrix)) {
        alert('You entered the wrong matrix');
        return;
    }

    const orientired = form.get('orientiation');
    const displayForm = form.get('display-form')
    const options = {
        orientired: orientired === 'orientired' ? true : false,
        form: displayForm
    };

    drawGraphs(matrix, options);
}

const buildCondensGraph = () => {
    const condensation = graph.condensation();
    for (let i = 0; i < condensation.length; i++) {
        condensation[i] = condensation[i].join(' ');
    }
    const strMatrix = condensation.join('\n');
    document.getElementById('matrix-input').value = strMatrix;
    refreshCanvas();
}

document.addEventListener('DOMContentLoaded', refreshCanvas)
