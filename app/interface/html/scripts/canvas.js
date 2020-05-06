'use strict';

// 
class Collision {

    static coords = [];

    // 
    static distanceFromPointToLine(x0, y0, from, to) {
        const x1 = from.x,
            y1 = from.y,
            x2 = to.x,
            y2 = to.y;
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

    // пересечение отрезка с кругом
    static lineCrossNode(from, to, circle, radius) {
        const a = Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2);
        const b = 2 * ((to.x - from.x) * (from.x - circle.x) + (to.y - from.y) * (from.y - circle.y));
        const c = Math.pow(circle.x, 2) + Math.pow(circle.y, 2) + Math.pow(from.x, 2) + Math.pow(from.y, 2) - 2 * (circle.x * from.x + circle.y * from.y) - Math.pow(radius, 2);

        // дискриминант
        const d = Math.pow(b, 2) - 4 * a * c;

        if (d < 0) {
            // нет пересечений
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

    static min(a, b) {
        return a < b ? a : b;
    }
    static max(a, b) {
        return a > b ? a : b;
    }
        // Максимум не включается, минимум включается
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    static checkCollisionNodes(nodes_radius, from, to, x, y) {
        // если центр вершины между началом и концом линии тогда продолжаем, иначе return
        if (!((to.x >= x && x >= from.x && to.y >= y && y >= from.y) ||
            (to.x <= x && x <= from.x && to.y >= y && y >= from.y) ||
            (to.x <= x && x <= from.x && to.y <= y && y <= from.y) ||
            (to.x >= x && x >= from.x && to.y <= y && y <= from.y)))
            return;
        // если линия пересекает вершины графа
        const distance = Collision.distanceFromPointToLine(x, y, from, to);
        if (Math.abs(distance) < nodes_radius) {
            // исправляем коллизию
            let newTy = 0;
            let newTx = 0;

            const randX = Collision.getRandomInt(3, 10);
            const randY = Collision.getRandomInt(3, 10);

            let dk = distance == 0 ? 1 : distance;
            dk = Math.abs(dk) / (dk);

            // Horizontal lines
            if (from.x != to.x && from.y === to.y) {
                if (from.x > to.x) {
                    newTx = x + randX;
                    newTy = y - (nodes_radius + Math.abs(distance) + randY);
                } else {
                    newTx = x + randX;
                    newTy = y + (nodes_radius + Math.abs(distance) + randY);
                }
            }
            // Vertical lines
            else if (from.x === to.x && from.y != to.y) {
                if (from.y > to.y) {
                    newTx = x + (nodes_radius + Math.abs(distance) + randX);
                    newTy = y + randY;
                } else {
                    newTx = x - (nodes_radius + Math.abs(distance) + randX);
                    newTy = y + randY;
                }
            }
            // Diagonal lines
            else {
                // o
                //   V
                //     o
                if (from.x < to.x && from.y < to.y) {
                    newTx = x - (nodes_radius + Math.abs(distance));
                    newTy = y + (nodes_radius + Math.abs(distance));
                }
                // o
                //   ^
                //     o
                else if (from.x > to.x && from.y > to.y) {
                    newTx = x + (nodes_radius + Math.abs(distance));
                    newTy = y - (nodes_radius + Math.abs(distance));
                }
                //     o
                //   V
                // o
                else if (from.x > to.x && from.y < to.y) {
                    newTx = x - (nodes_radius + Math.abs(distance));
                    newTy = y - (nodes_radius + Math.abs(distance));
                }
                //     o
                //   ^
                // o
                else if (from.x < to.x && from.y > to.y) {
                    newTx = x + (nodes_radius + Math.abs(distance));
                    newTy = y + (nodes_radius + Math.abs(distance));
                }
            }

            const newLine1 = {
                from,
                to: {
                    x: newTx,
                    y: newTy
                }
            }
            const newLine2 = {
                from: {
                    x: newTx,
                    y: newTy
                },
                to
            }

            return { first: newLine1, second: newLine2 };
        }
        return;
    }
    static checkCollisionNodesRec(nodes_radius, linesArray, from, to) {
        let fracture;
        for (const { x, y } of Collision.coords) {
            // пропускаем точки начала и конца линии
            if ((x === from.x && y === from.y) ||
                (x === to.x && y === to.y)) {
                continue;
            }
            fracture = Collision.checkCollisionNodes(nodes_radius, from, to, x, y);
            if (fracture) {
                break;
            }
        }
        if (fracture) {
            Collision.checkCollisionNodesRec(nodes_radius, linesArray, fracture.first.from, fracture.first.to);
            Collision.checkCollisionNodesRec(nodes_radius, linesArray, fracture.second.from, fracture.second.to);
        } else {
            // проверяем коллизии всех линий с линией
            Collision.checkCollisionLines(nodes_radius, linesArray, from, to);
            // linesArray.push({ from, to });
        }
    }
    static checkCollisionLines(nodes_radius, linesArray, from, to) {
        let newTx = 0;
        let newTy = 0;

        const randX = Collision.getRandomInt(3, 10);
        const randY = Collision.getRandomInt(3, 10);

        const minx = Collision.min(from.x, to.x);
        const miny = Collision.min(from.y, to.y);
        const maxx = Collision.max(from.x, to.x);
        const maxy = Collision.max(from.y, to.y);

        // Horizontal lines
        if (from.x != to.x && from.y === to.y) {
            if (from.x > to.x) {
                newTx = minx + (maxx - minx) / 2 + randX;
                newTy = from.y + nodes_radius / 2 + randY;
            } else {
                newTx = minx + (maxx - minx) / 2 + randX;
                newTy = from.y - nodes_radius / 2 + randY;
            }
        }
        // Vertical lines
        else if (from.x === to.x && from.y != to.y) {
            if (from.y > to.y) {
                newTx = from.x + nodes_radius / 2 + randX;
                newTy = miny + (maxy - miny) / 2 + randY;
            } else {
                newTx = from.x - nodes_radius / 2 + randX;
                newTy = miny + (maxy - miny) / 2 + randY;
            }
        }
        // Diagonal lines
        else {
            // o
            //   V
            //     o
            if (from.x < to.x && from.y < to.y) {
                newTx = minx + (maxx - minx) / 2 - (nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 + (nodes_radius / 2 - randY);
            }
            // o
            //   ^
            //     o
            else if (from.x > to.x && from.y > to.y) {
                newTx = minx + (maxx - minx) / 2 + (nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 - (nodes_radius / 2 - randY);
            }
            //     o
            //   V
            // o
            else if (from.x > to.x && from.y < to.y) {
                newTx = minx + (maxx - minx) / 2 - (nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 - (nodes_radius / 2 - randY);
            }
            //     o
            //   ^
            // o
            else if (from.x < to.x && from.y > to.y) {
                newTx = minx + (maxx - minx) / 2 + (nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 + (nodes_radius / 2 - randY);
            }
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
};


class Canvas {
    constructor(canvasId) {
        this.domElem = document.getElementById(canvasId);
        this.ctx = this.domElem.getContext('2d');
    }

    setSize(size) {
        this.domElem.setAttribute("width", `${size.x}px`);
        this.domElem.setAttribute("height", `${size.y}px`);
        return this;
    }
    context(ctx) {
        return this.domElem.getContext(ctx);
    }
    clear(ctx) {
        this.domElem.getContext(ctx).clearRect(0, 0, this.domElem.width, this.domElem.height);
        return this;
    }
    begin() {
        this.ctx.beginPath();
    }
    end(option) {
        switch (option) {
            case 'stroke':
                this.ctx.stroke();
                break;
            case 'fill':
                this.ctx.fill();
                break;
        }
    }
    node(x, y, radius, color) {
        this.begin();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.end('fill');

        // border
        this.begin();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.end('stroke');
    }
    lable(x, y, n) {
        this.ctx.font = '12px serif';
        this.ctx.fillStyle = "black";
        this.ctx.fillText(n, x, y);
    }
    line(from, to) {
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }
    arrow(from, to) {
        const fx = from.x,
            fy = from.y,
            tx = to.x,
            ty = to.y;
        const headlen = 10; // length of head in pixels
        const dx = tx - fx;
        const dy = ty - fy;
        const angle = Math.atan2(dy, dx);
        this.ctx.beginPath();
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }

    draw(graph, nodesColor, labelsInfo) {

        const nodes_radius = graph.config.nodes_radius;

        Collision.coords = graph.config.coords;
        
        const line = (from, to) => {
            let linesArray = [];

            // Если линия из вершины входит в эту же вершину
            if (from.x === to.x && from.y === to.y) {
                // o > V
                // ^   V
                // ^ < <
                const firstLine = {
                    from,
                    to: {
                        x: from.x + nodes_radius * 2,
                        y: from.y
                    }
                }
                const secondLine = {
                    from: firstLine.to,
                    to: {
                        x: firstLine.to.x,
                        y: firstLine.to.y + nodes_radius * 2
                    }
                }
                const thirdLine = {
                    from: secondLine.to,
                    to: {
                        x: secondLine.to.x - nodes_radius * 2,
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
            }
            else { // иначе имеем линию из одной вершины в другую
                // проверяем коллизии всех вершин с линией
                Collision.checkCollisionNodesRec(nodes_radius, linesArray, from, to);
            }
            return linesArray;
        }
        const complete_ribs = [];
        const ribs = () => {
            for (const m in graph.adj_matrix.matrix) {
                for (const n in graph.adj_matrix.matrix[m]) {
                    const a = graph.adj_matrix.matrix[m][n];
                    const b = graph.adj_matrix.matrix[n][m];
                    
                    if (!graph.config.orientired) {
                        let flag = false;
                        for (const r of complete_ribs) {
                            if (r.m === n && r.n === m)
                                flag = true;
                        }
                        if(flag)
                            continue;
                    }

                    if (a) {
                        complete_ribs.push({ m, n });
                        const fx = graph.config.coords[m].x,
                            fy = graph.config.coords[m].y,
                            tx = graph.config.coords[n].x,
                            ty = graph.config.coords[n].y;
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
                            arrow: graph.config.orientired,
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

                        const linesArray = line(from, to);

                        let labelIndex = Math.floor(linesArray.length / 2);
                        let index = 0;
                        for (const l of linesArray) {
                            this.line(l.from, l.to);
                            if (index === labelIndex) {
                                if (linesArray.length % 2 === 0) {
                                    this.lable(l.from.x, l.from.y, graph.w_matrix[m][n]);
                                } else {
                                    this.lable(l.to.x, l.to.y, graph.w_matrix[m][n]);
                                }
                            }
                            index++;
                        }
                        if (flags) {
                            if (flags.arrow) {
                                const cross = Collision.lineCrossNode(linesArray[linesArray.length - 1].from, to, to, nodes_radius);
                                this.arrow(linesArray[linesArray.length - 1].from, cross);
                            }
                        }
                    }
                }
            }
        }

        const nodes = (colors) => {
            let i = 0;
            for (const { x, y } of graph.config.coords) {
                this.node(x, y, nodes_radius, colors[i]);
                i++;
            }
        }

        const numbers = () => {
            const font_spacing = 4;
            for (const index in graph.config.coords) {
                this.lable(graph.config.coords[index].x - font_spacing, graph.config.coords[index].y + font_spacing, Number(index) + 1);
            }
        }

        const labels = (labels) => {
            for (const label of labels) {
                this.lable(graph.config.coords[label.i].x + nodes_radius, graph.config.coords[label.i].y - nodes_radius, label.text);
            }
        }

        

        ribs();
        nodes(nodesColor);
        numbers();
        if (labelsInfo)
            labels(labelsInfo);
        return this;
    }
}
