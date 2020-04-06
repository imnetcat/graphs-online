'use strict';

class Graph {
    constructor(matrix, ctx) {
        this.plot_x = 1000;
        this.plot_y = 500;
        this.matrix = new Matrix(matrix);
        this.nodes = matrix.length;
        this.display = 'default';
        this.config = {
            plot_x_offfset: 100,
            plot_y_offfset: 100,

            nodes_radius: 20,
            nodes_spacing: 2,

            orientired: true,

            coords: [],

            ctx: ctx || {}
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

    getRoutes(length) {
        const A = this.matrix.pow(length);
        const result = [];
        for (let m = 0; m < A.length; m++) {
            for (let n = 0; n < A[m].length; n++) {
                if (A[m][n]) {
                    if (length == 1) {
                        result.push([m, n]);
                    } else {
                        const res = this.getRoutes(length - 1);
                        for (let i = 0; i < res.length; i++) {
                            res[i].shift(m);
                        }
                        result.push(res);
                    }
                }
            }
        }
        console.log(result);
        return result;
    }

    context(ctx) {
        this.config.ctx = ctx;
        return this;
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
        const result = new Array(this.matrix.size().m)
            .fill({})
            .map(el => el = new Deg());
        this.matrix.iterate((a, b, m, n) => {
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

    isOrientired() {
        return this.config.orientired;
    }

    generateCoords() {
        let plot_size_x = 0;
        let plot_size_y = 0;
        switch (this.display) {
            case 'default':
            case 'empty-triangle':
                const nodes = this.nodes;
                const diameter = this.config.nodes_radius * 2;
                const spacing = this.config.nodes_spacing;

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
                console.log(this.config.plot_x_offfset + plot_size_x, this.config.plot_y_offfset + plot_size_y);

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

    draw() {

        const ribsVectors = [];

        const begin = () => {
            this.config.ctx.beginPath();
        }

        const end = (option) => {
            switch (option) {
                case 'stroke':
                    this.config.ctx.stroke();
                    break;
                case 'fill':
                    this.config.ctx.fill();
                    break;
            }
        }

        const node = (x, y) => {
            begin();
            this.config.ctx.fillStyle = "white";
            this.config.ctx.arc(x, y, this.config.nodes_radius, 0, 2 * Math.PI);
            end('fill');

            // border
            begin();
            this.config.ctx.arc(x, y, this.config.nodes_radius, 0, 2 * Math.PI);
            end('stroke');
        }

        const number = (x, y, n) => {
            this.config.ctx.font = '12px serif';
            this.config.ctx.fillStyle = "black";
            this.config.ctx.fillText(n.toString(), x, y);
        }

        // intersection of a segment with a circle
        const lineCrossNode = (from, to, circle, radius) => {
            const a = Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2);
            const b = 2 * ((to.x - from.x) * (from.x - circle.x) + (to.y - from.y) * (from.y - circle.y));
            const c = Math.pow(circle.x, 2) + Math.pow(circle.y, 2) + Math.pow(from.x, 2) + Math.pow(from.y, 2) - 2 * (circle.x * from.x + circle.y * from.y) - Math.pow(radius, 2);

            // descreminant
            const d = Math.pow(b, 2) - 4 * a * c;

            if (d < 0) {
                // no intersection
                return undefined;
            }

            // found parameters  t1 & t2
            const t1 = (-b - Math.sqrt(d)) / (2 * a);
            const t2 = (-b + Math.sqrt(d)) / (2 * a);

            let x, y;
            // check segment of line
            if (t1 >= 0 && t1 <= 1) {
                x = from.x * (1 - t1) + to.x * t1;
                y = from.y * (1 - t1) + to.y * t1;
            } else if (t2 >= 0 && t2 <= 1) {
                x = from.x * (1 - t2) + to.x * t2;
                y = from.y * (1 - t2) + to.y * t2;
            } else {
                return undefined;
            }

            return { x, y };
        }

        const arrow = (from, to) => {
            const fx = from.x,
                fy = from.y;

            const cross = lineCrossNode(from, to, to, this.config.nodes_radius);
            const tx = cross.x,
                ty = cross.y;
            const headlen = 10; // length of head in pixels
            const dx = tx - fx;
            const dy = ty - fy;
            const angle = Math.atan2(dy, dx);
            this.config.ctx.beginPath();
            this.config.ctx.moveTo(tx, ty);
            this.config.ctx.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6));
            this.config.ctx.moveTo(tx, ty);
            this.config.ctx.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6));
            this.config.ctx.stroke();
        }
        const checkCollision = (linesArray, from, to, fromNode, toNode, flags) => {
            // находим вектор линии
            const vector = {
                x: to.x - from.x,
                y: to.y - from.y
            };
            //
            const distanceFromPointToLine = (point, line) => {
                const x0 = point.x,
                    y0 = point.y,
                    x1 = line.from.x,
                    y1 = line.from.y,
                    x2 = line.to.x,
                    y2 = line.to.y;
                let a = y2 - y1;
                let b = x1 - x2;
                let c = -x1 * (y2 - y1) + y1 * (x2 - x1);
                const t = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
                if (c > 0) {
                    a = -a;
                    b = -b;
                    c = -c;
                }
                return (a * x0 + b * y0 + c) / t;
            }
            if (false) {
            } else {
                let collisionFound = false;
                // и проверяем все вершины
                for (const node in this.config.coords) {
                    const { x, y } = this.config.coords[node];

                    // пропускаем точки начала и конца линии
                    if ((x === fromNode.x &&
                        y === fromNode.y) ||
                        (x === toNode.x &&
                            y === toNode.y)) {
                        continue;
                    }
                    // если центр вершины между началом и концом линии
                    if ((to.x >= x && x >= from.x && to.y >= y && y >= from.y) ||
                        (to.x <= x && x <= from.x && to.y >= y && y >= from.y) ||
                        (to.x <= x && x <= from.x && to.y <= y && y <= from.y) ||
                        (to.x >= x && x >= from.x && to.y <= y && y <= from.y)) {
                        // если линия пересекает вершины графа
                        const pointCoords = { x, y };
                        const lineCoords = { from, to }
                        const distance = distanceFromPointToLine(pointCoords, lineCoords);
                        if (Math.abs(distance) < this.config.nodes_radius) {
                            collisionFound = true;
                            // исправляем коллизию
                            let newTy = 0;
                            let newTx = 0;
                            // Horizontal lines
                            // o < o
                            if (from.x < to.x && from.y === to.y) {
                                newTx = x;
                                newTy = y - this.config.nodes_radius * 2;
                            }
                            // o > o
                            if (from.x > to.x && from.y === to.y) {
                                newTx = x;
                                newTy = y + this.config.nodes_radius * 2;
                            }
                            // Vertical lines
                            // o
                            // ^
                            // o
                            if (from.x === to.x && from.y < to.y) {
                                newTx = x + this.config.nodes_radius * 2;
                                newTy = y;
                            }
                            // o
                            // V
                            // o
                            if (from.x === to.x && from.y > to.y) {
                                newTx = x - this.config.nodes_radius * 2;
                                newTy = y;
                            }

                            // Diagonal lines
                            //     o
                            //   V
                            // o
                            if (from.x > to.x && from.y < to.y) {
                                if (distance) {
                                    newTx = x - (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                    newTy = y - (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                } else {
                                    newTx = x - this.config.nodes_radius;
                                    newTy = y - this.config.nodes_radius;
                                }
                            }
                            //     o
                            //   ^
                            // o
                            if (from.x < to.x && from.y > to.y) {
                                if (distance) {
                                    newTx = x - (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                    newTy = y - (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                } else {
                                    newTx = x + this.config.nodes_radius;
                                    newTy = y + this.config.nodes_radius;
                                }
                            }
                            // o
                            //  ^
                            //    o
                            if (from.x > to.x && from.y > to.y) {
                                if (distance) {
                                    newTx = x - (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                    newTy = y + (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                } else {
                                    newTx = x - this.config.nodes_radius;
                                    newTy = y + this.config.nodes_radius;
                                }
                            }
                            // o
                            //  V
                            //    o
                            if (from.x < to.x && from.y < to.y) {
                                if (distance) {
                                    newTx = x - (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                    newTy = y + (distance / Math.abs(distance)) * (this.config.nodes_radius);
                                } else {
                                    newTx = x + this.config.nodes_radius;
                                    newTy = y - this.config.nodes_radius;
                                }
                            }

                            function getRandomInt(min, max) {
                                min = Math.ceil(min);
                                max = Math.floor(max);
                                return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
                            }

                            const randX = getRandomInt(5, 15);
                            const randY = getRandomInt(5, 15);

                            const newLine1 = {
                                from,
                                to: {
                                    x: newTx + randX,
                                    y: newTy + randY
                                }
                            }
                            const newLine2 = {
                                from: {
                                    x: newTx + randX,
                                    y: newTy + randY
                                },
                                to
                            }

                            flags.firstCollision = false;
                            checkCollision(linesArray, newLine1.from, newLine1.to, fromNode, toNode, flags);

                            checkCollision(linesArray, newLine2.from, newLine2.to, fromNode, toNode, flags);

                            return false;
                        }
                    }
                }
                if (!collisionFound) {
                    if (flags.firstCollision) {
                        if (from.x === to.x && from.y === to.y) {
                            let newTx = 0;
                            let newTy = 0;
                            // rib to the same element
                            // o > V
                            // ^   V
                            // ^ < <
                            const firstLine = {
                                from,
                                to: {
                                    x: from.x + this.config.nodes_radius * 2,
                                    y: from.y
                                }
                            }
                            const secondLine = {
                                from: firstLine.to,
                                to: {
                                    x: firstLine.to.x,
                                    y: firstLine.to.y + this.config.nodes_radius * 2
                                }
                            }
                            const thirdLine = {
                                from: secondLine.to,
                                to: {
                                    x: secondLine.to.x - this.config.nodes_radius * 2,
                                    y: secondLine.to.y
                                }
                            }
                            const fourthLine = {
                                from: thirdLine.to,
                                to
                            }
                            linesArray.push(firstLine);
                            linesArray.push(secondLine);
                            linesArray.push(thirdLine);
                            linesArray.push(fourthLine);

                        } else {
                            let newTx = 0;
                            let newTy = 0;
                            // Horizontal lines
                            // o < o
                            if (from.x < to.x && from.y === to.y) {
                                newTx = from.x + (to.x - from.x) / 2;
                                newTy = to.y + this.config.nodes_radius;
                            }
                            // o > o
                            if (from.x > to.x && from.y === to.y) {
                                newTx = to.x + (from.x - to.x) / 2;
                                newTy = to.y - this.config.nodes_radius;
                            }
                            // Vertical lines
                            // o
                            // V
                            // o
                            if (from.x === to.x && from.y < to.y) {
                                newTx = to.x - this.config.nodes_radius;
                                newTy = from.y + (to.y - from.y) / 2 - this.config.nodes_radius;
                            }
                            // o
                            // ^
                            // o
                            if (from.x === to.x && from.y > to.y) {
                                newTx = to.x + this.config.nodes_radius;
                                newTy = to.y + (from.y - to.y) / 2 + this.config.nodes_radius;
                            }
                            // Diagonal lines
                            //     o
                            //   V
                            // o
                            if (from.x > to.x && from.y < to.y) {
                                newTx = to.x + this.config.nodes_radius / 2;
                                newTy = to.y - this.config.nodes_radius * 2;
                            }
                            //     o
                            //   ^
                            // o
                            if (from.x < to.x && from.y > to.y) {
                                newTx = to.x - this.config.nodes_radius / 2;
                                newTy = to.y + this.config.nodes_radius * 2;
                            }
                            // o
                            //  ^
                            //    o
                            if (from.x > to.x && from.y > to.y) {
                                newTx = to.x + this.config.nodes_radius / 2;
                                newTy = to.y + this.config.nodes_radius * 2;
                            }
                            // o
                            //  V
                            //    o
                            if (from.x < to.x && from.y < to.y) {
                                newTx = to.x - this.config.nodes_radius / 2;
                                newTy = to.y - this.config.nodes_radius * 2;
                            }

                            const firstLine = {
                                from,
                                to: {
                                    x: newTx,
                                    y: newTy
                                }
                            }
                            const secondLine = {
                                from: {
                                    x: newTx,
                                    y: newTy
                                },
                                to
                            }
                            linesArray.push(firstLine);
                            linesArray.push(secondLine);
                        }
                    } else {
                        linesArray.push({ from, to });
                    }
                }
            }
            return true;
        }
        const line = (from, to, flags) => {
            let linesArray = [];
            checkCollision(linesArray, from, to, from, to, flags);
            for (const l of linesArray) {
                this.config.ctx.beginPath();
                this.config.ctx.moveTo(l.from.x, l.from.y);
                this.config.ctx.lineTo(l.to.x, l.to.y);
                this.config.ctx.stroke();
            }
            if (flags) {
                if (flags.arrow) {
                    arrow(linesArray[linesArray.length - 1].from, to);
                }
            }
        }


        const nodes = () => {
            for (const { x, y } of this.config.coords) {
                node(x, y);
            }
        }

        const numbers = () => {
            const font_spacing = 4;
            for (const index in this.config.coords) {
                number(this.config.coords[index].x - font_spacing, this.config.coords[index].y + font_spacing, Number(index) + 1);
            }
        }

        const ribs = () => {
            this.matrix.iterate((a, b, m, n) => {
                if (!(!this.config.orientired && (m - n) > 0)) {
                    if (a) {
                        const fx = this.config.coords[m].x,
                            fy = this.config.coords[m].y,
                            tx = this.config.coords[n].x,
                            ty = this.config.coords[n].y;
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
                            arrow: this.config.orientired,
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

                        line(from, to, flags);
                    }
                }
            });
        }
        ribs();
        nodes();
        numbers();
        return this;
    }
};

