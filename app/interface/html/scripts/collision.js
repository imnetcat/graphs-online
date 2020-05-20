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
                    newTy = y - (nodes_radius + nodes_radius * Math.abs(dk) + randY);
                } else {
                    newTx = x + randX;
                    newTy = y + (nodes_radius + nodes_radius * Math.abs(dk) + randY);
                }
            }
            // Vertical lines
            else if (from.x === to.x && from.y != to.y) {
                if (from.y > to.y) {
                    newTx = x + (nodes_radius + nodes_radius * Math.abs(dk) + randX);
                    newTy = y + randY;
                } else {
                    newTx = x - (nodes_radius + nodes_radius * Math.abs(dk) + randX);
                    newTy = y + randY;
                }
            }
            // Diagonal lines
            else {
                // o
                //   V
                //     o
                if (from.x < to.x && from.y < to.y) {
                    newTx = x - (nodes_radius + nodes_radius * Math.abs(dk));
                    newTy = y + (nodes_radius + nodes_radius * Math.abs(dk));
                }
                // o
                //   ^
                //     o
                else if (from.x > to.x && from.y > to.y) {
                    newTx = x + (nodes_radius + nodes_radius *Math.abs(dk));
                    newTy = y - (nodes_radius + nodes_radius *Math.abs(dk));
                }
                //     o
                //   V
                // o
                else if (from.x > to.x && from.y < to.y) {
                    newTx = x - (nodes_radius + nodes_radius*Math.abs(dk));
                    newTy = y - (nodes_radius + nodes_radius*Math.abs(dk));
                }
                //     o
                //   ^
                // o
                else if (from.x < to.x && from.y > to.y) {
                    newTx = x + (nodes_radius + nodes_radius *Math.abs(dk));
                    newTy = y + (nodes_radius + nodes_radius *Math.abs(dk));
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
