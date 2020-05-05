'use strict';

class Graph extends Plot {
    constructor(canvasId, adj_matrix) {
        super(canvasId);
        this.adj_matrix = new Matrix(adj_matrix);
        this._orientired = true;
        this.wieght_matrix = null;
        this._vertexes = [];
        this._ribs = [];
    }

    get orientired() {
        return this._orientired;
    }
    set orientired(isOrientired) {
        this._orientired = isOrientired;
        return this;
    }

    get wieght() {
        return this.wieght_matrix;
    }
    set wieght(wieght_matrix) {
        this.wieght_matrix = new Matrix(wieght_matrix);
        return this;
    }
    
    // генерация коордиинат вершин для пустого треугольника
    generateEmptyTriangle(nodes) {
        const diameter = this.nodes_radius * 2;
        const spacing = this.nodes_spacing;

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
            this.coords.push({
                x: diameter * spacing * n,
                y: diameter * spacing * n
            });
        }
        // генерируем координаты для n2-1 вершин графа на второй стороне треугольника
        for (let n = 0; n < n2; n++) {
            const nodeCoords = {};
            nodeCoords.x = diameter * spacing * (n1 - 1) - x * (n + 1);
            nodeCoords.y = diameter * spacing * (n1 - 1);
            this.coords.push(nodeCoords);
        }
        // генерируем координаты для n3-1 вершин графа на третей стороне треугольника
        for (let n = 0; n < n3; n++) {
            this.coords.push({
                x: - diameter * spacing * (n1 - 1) + diameter * spacing * n,
                y: + diameter * spacing * (n1 - 1) - diameter * spacing * n
            });
        }

        let plot_size_x = 2 * (this.coords[n1 - 1].x + diameter / 2);//+ diameter*1;
        let plot_size_y = this.coords[n1 - 1].y + diameter / 2 + diameter * spacing;//+ diameter * 1;

        // отступы сверху и слева от графа
        for (let c of this.coords) {
            c.x += this.plot_x_offfset + plot_size_x / 2;
            c.y += this.plot_y_offfset + diameter / 4;
        }

        // отступы снизу и справа от графа
        plot_size_x += this.plot_x_offfset + plot_size_x / 8;
        plot_size_y += this.plot_y_offfset + diameter / 2;

        return {
            x: plot_size_x,
            y: plot_size_y
        };
    }

    // генерация коордиинат вершин для заданой формы
    generate() {
        let plot_size_x = 0;
        let plot_size_y = 0;
        switch (this._shape) {
            case 'default':
            case 'empty-triangle':
                const { x, y } = this.generateEmptyTriangle(this.adj_matrix.matrix.length);
                plot_size_x = x;
                plot_size_y = y;
                break;
        }
        this.size = { x: plot_size_x, y: plot_size_y };
        return this;
    }

    ribs() {
        this.adj_matrix.iterate((a, b, m, n) => {
            if (!(!this.orientired && (m - n) > 0)) {
                if (a) {
                    const fx = this.coords[m].x,
                        fy = this.coords[m].y,
                        tx = this.coords[n].x,
                        ty = this.coords[n].y;
                    const from = {
                        x: fx,
                        y: fy
                    };
                    const to = {
                        x: tx,
                        y: ty
                    };

                    const flags = {
                        firstCollision: true,
                        arrow: this.orientired,
                        superimposed: false,
                        toTheSameNode: false
                    }

                    //
                    if (a === b && a && b && n !== m) {
                        flags.superimposed = true;
                    }

                    //
                    if (a === b && a && b && n === m) {
                        flags.toTheSameNode = true;
                    }

                    this.line(from, to, flags);
                }
            }
        });
    }

    nodes(colors) {
        let i = 0;
        for (const { x, y } of this.coords) {
            this.node(x, y, nodes_radius, colors[i]);
            i++;
        }
    }

    numbers() {
        const font_spacing = 4;
        for (const index in this.coords) {
            this.lable(this.coords[index].x - font_spacing, this.coords[index].y + font_spacing, Number(index) + 1);
        }
    }

    labels(labels) {
        for (const label of labels) {
            this.lable(this.coords[label.i].x + nodes_radius, this.coords[label.i].y - nodes_radius, label.text);
        }
    }

    draw(nodesColor, labelsInfo) {

        this.ribs();
        this.nodes(nodesColor);
        this.numbers();
        if (labelsInfo)
            labels(labelsInfo);
        return this;
    }
};

Graph.reachability = function(graph) {
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

Graph.bfs = function (graph, node) {
    const matrix = this.adj_matrix.bfs(node);
    const bfs = new BFS(matrix, node);
    return { bfs, matrix };
}

Graph.strongBindingMatrix = function (graph) {
    const R = this.reachability();
    const RT = Matrix.transpone(R);
    const S = Matrix.multiplyMatrixElem(R, RT);
    return S;
}

Graph.strongBindingComponents = function (graph) {
    const S = this.strongBindingMatrix();
    for (let i = 0; i < S.length; i++) {
        for (let j = 0; j < S[i].length; j++) {
            if (S[i][j]) {
                let ic = i + 1;
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
                component.push(j + 1);
            }
        }
        if (component.length) {
            components.push(component);
        }
    }

    return components;
}

Graph.condensation = function (graph) {
    const nodes = this.strongBindingComponents();
    const cMatrix = Matrix.createZero(nodes.length);
    for (let m = 0; m < cMatrix.length; m++) {
        for (let n = 0; n < cMatrix[m].length; n++) {
            if (n === m + 1) {
                cMatrix[m][n] = 1;
            }
        }
    }
    return cMatrix;
}

Graph.routes = function (graph, length) {
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
    } else if (length === 2) {
        return getWays(this.adj_matrix.matrix).l2;
    } else if (length === 1) {
        return getWays(this.adj_matrix.matrix).l1;
    }

}

Graph.degrees = function (graph) {
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

Graph.isUni = function (graph) {
    const degrees = this.degrees();
    const item0 = degrees[0].sum();
    const isUni = degrees.every(item => item.sum() === item0);
    if (isUni) {
        return degrees[0].sum();
    } else {
        return -1;
    }
}

Graph.hangingNodes = function (graph) {
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

Graph.isolatedNodes = function (graph) {
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

