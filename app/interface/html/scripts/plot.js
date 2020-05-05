'use strict';

// класс отвечающий за визуальное отображение графов
class Plot extends Canvas {
    constructor(canvasId) {
        super(canvasId);
        this.plot_x = 1000;
        this.plot_y = 500;
        this._shape = 'default';
        this.plot_x_offfset = 100;
        this.plot_y_offfset = 100;
        this.nodes_radius = 20;
        this.nodes_spacing = 2;
        this.coords = [];
    }
    
    get size() {
        return {
            x: this.plot_x,
            y: this.plot_y
        }
    }
    set size(s) {
        this.plot_x = s.x;
        this.plot_y = s.y;
    }

    get shape() {
        return this._shape;
    }
    set shape(s) {
        this._shape = s;
        return this;
    }

    min(a, b) {
        return a < b ? a : b
    }
    max(a, b) {
        return a > b ? a : b;
    }
    // Максимум не включается, минимум включается
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    //
    distanceFromPointToLine(x0, y0, from, to) {
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
    lineCrossNode(from, to, circle, radius) {
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

    line(from, to, flags) {
        let linesArray = [];

        // Если линия из вершины входит в эту же вершину
        if (from.x === to.x && from.y === to.y) {
            // o > V
            // ^   V
            // ^ < <
            const firstLine = {
                from,
                to: {
                    x: from.x + this.nodes_radius * 2,
                    y: from.y
                }
            }
            const secondLine = {
                from: firstLine.to,
                to: {
                    x: firstLine.to.x,
                    y: firstLine.to.y + this.nodes_radius * 2
                }
            }
            const thirdLine = {
                from: secondLine.to,
                to: {
                    x: secondLine.to.x - this.nodes_radius * 2,
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
            this.checkCollisionNodesRec(linesArray, from, to, (from.x - to.x), (from.y - to.y));
        }
        for (const l of linesArray) {
            this.line(l.from, l.to);
        }
        if (flags) {
            if (flags.arrow) {
                const cross = this.lineCrossNode(linesArray[linesArray.length - 1].from, to, to, this.nodes_radius);
                this.arrow(linesArray[linesArray.length - 1].from, cross);
            }
        }
    }
    
    checkCollisionNodes(from, to, x, y) {
        // если центр вершины между началом и концом линии тогда продолжаем, иначе return
        if (!((to.x >= x && x >= from.x && to.y >= y && y >= from.y) ||
            (to.x <= x && x <= from.x && to.y >= y && y >= from.y) ||
            (to.x <= x && x <= from.x && to.y <= y && y <= from.y) ||
            (to.x >= x && x >= from.x && to.y <= y && y <= from.y)))
            return;

        // если линия пересекает вершины графа
        const distance = this.distanceFromPointToLine(x, y, from, to);
        console.log(Math.abs(distance), this.nodes_radius)
        if (Math.abs(distance) < this.nodes_radius) {
            // исправляем коллизию
            let newTy = 0;
            let newTx = 0;

            const randX = this.getRandomInt(3, 10);
            const randY = this.getRandomInt(3, 10);

            let dk = distance == 0 ? 1 : distance;
            dk = Math.abs(dk) / (dk);

            // Horizontal lines
            if (from.x != to.x && from.y === to.y) {
                if (from.x > to.x) {
                    newTx = x + randX;
                    newTy = y - (this.nodes_radius + Math.abs(distance) + randY);
                } else {
                    newTx = x + randX;
                    newTy = y + (this.nodes_radius + Math.abs(distance) + randY);
                }
            }
            // Vertical lines
            else if (from.x === to.x && from.y != to.y) {
                if (from.y > to.y) {
                    newTx = x + (this.nodes_radius + Math.abs(distance) + randX);
                    newTy = y + randY;
                } else {
                    newTx = x - (this.nodes_radius + Math.abs(distance) + randX);
                    newTy = y + randY;
                }
            }
            // Diagonal lines
            else {
                // o
                //   V
                //     o
                if (from.x < to.x && from.y < to.y) {
                    newTx = x - (this.nodes_radius + Math.abs(distance));
                    newTy = y + (this.nodes_radius + Math.abs(distance));
                }
                // o
                //   ^
                //     o
                else if (from.x > to.x && from.y > to.y) {
                    newTx = x + (this.nodes_radius + Math.abs(distance));
                    newTy = y - (this.nodes_radius + Math.abs(distance));
                }
                //     o
                //   V
                // o
                else if (from.x > to.x && from.y < to.y) {
                    newTx = x - (this.nodes_radius + Math.abs(distance));
                    newTy = y - (this.nodes_radius + Math.abs(distance));
                }
                //     o
                //   ^
                // o
                else if (from.x < to.x && from.y > to.y) {
                    newTx = x + (this.nodes_radius + Math.abs(distance));
                    newTy = y + (this.nodes_radius + Math.abs(distance));
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
    checkCollisionNodesRec(linesArray, from, to, posx, posy) {
        let fracture;
        for (const { x, y } of this.coords) {
            // пропускаем точки начала и конца линии
            if ((x === from.x && y === from.y) ||
                (x === to.x && y === to.y)) {
                continue;
            }
            fracture = this.checkCollisionNodes(from, to, x, y);
            if (fracture) {
                break;
            }
        }
        if (fracture) {
            checkCollisionNodesRec(linesArray, fracture.first.from, fracture.first.to,
                (fracture.first.to.x - fracture.second.to.x), (fracture.first.to.y - fracture.second.to.y));
            checkCollisionNodesRec(linesArray, fracture.second.from, fracture.second.to,
                (fracture.first.to.x - fracture.second.to.x), (fracture.first.to.y - fracture.second.to.y));
        } else {
            // проверяем коллизии всех линий с линией
            this.checkCollisionLines(linesArray, from, to, posx, posy);
            // linesArray.push({ from, to });
        }
    }
    checkCollisionLines(linesArray, from, to, posx, posy) {
        let newTx = 0;
        let newTy = 0;

        const randX = this.getRandomInt(3, 10);
        const randY = this.getRandomInt(3, 10);

        const minx = this.min(from.x, to.x);
        const miny = this.min(from.y, to.y);
        const maxx = this.max(from.x, to.x);
        const maxy = this.max(from.y, to.y);

        // Horizontal lines
        if (from.x != to.x && from.y === to.y) {
            if (from.x > to.x) {
                newTx = minx + (maxx - minx) / 2 + randX;
                newTy = from.y + this.nodes_radius / 2 + randY;
            } else {
                newTx = minx + (maxx - minx) / 2 + randX;
                newTy = from.y - this.nodes_radius / 2 + randY;
            }
        }
        // Vertical lines
        else if (from.x === to.x && from.y != to.y) {
            if (from.y > to.y) {
                newTx = from.x + this.nodes_radius / 2 + randX;
                newTy = miny + (maxy - miny) / 2 + randY;
            } else {
                newTx = from.x - this.nodes_radius / 2 + randX;
                newTy = miny + (maxy - miny) / 2 + randY;
            }
        }
        // Diagonal lines
        else {
            // o
            //   V
            //     o
            if (from.x < to.x && from.y < to.y) {
                newTx = minx + (maxx - minx) / 2 - (this.nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 + (this.nodes_radius / 2 - randY);
            }
            // o
            //   ^
            //     o
            else if (from.x > to.x && from.y > to.y) {
                newTx = minx + (maxx - minx) / 2 + (this.nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 - (this.nodes_radius / 2 - randY);
            }
            //     o
            //   V
            // o
            else if (from.x > to.x && from.y < to.y) {
                newTx = minx + (maxx - minx) / 2 - (this.nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 - (this.nodes_radius / 2 - randY);
            }
            //     o
            //   ^
            // o
            else if (from.x < to.x && from.y > to.y) {
                newTx = minx + (maxx - minx) / 2 + (this.nodes_radius / 2 - randX);
                newTy = miny + (maxy - miny) / 2 + (this.nodes_radius / 2 - randY);
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
