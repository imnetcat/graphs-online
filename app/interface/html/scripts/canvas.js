'use strict';

class Canvas {
    constructor(canvasId) {
        this.domElem = document.getElementById(canvasId);
        this.ctx = this.domElem.getContext('2d');
    }

    getSize() {
        const y = Number(this.domElem.getAttribute("height").replace('px', ''));
        const x = Number(this.domElem.getAttribute("width").replace('px', ''));
        return { x, y };
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
    lable(x, y, n, size, color) {
        this.ctx.font = String(size) + 'px serif';
        this.ctx.fillStyle = color;
        this.ctx.fillText(n, x, y);
    }
    line(from, to) {
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }
    rect(from, to, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(from.x, from.y, to.x, to.y);
    }
    setLineWidth(w) {
        this.ctx.lineWidth = w;
    }
    setLineColor(c) {
        this.ctx.strokeStyle = c;
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
        const backgroundColor = Settings.background.color;
        const ribsColor = Settings.ribs.color;
        const ribsWidth = Settings.ribs.width;
        const ribsLabelColor = Settings.ribs.label.color;
        const ribsLabelSize = Settings.ribs.label.size;
        const vertexLabelColor = Settings.vertex.label.color;
        const vertexLabelSize = Settings.vertex.label.size;
        const nodes_radius = Settings.vertex.radius;
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
                Collision.checkCollisionNodesRec(nodes_radius, linesArray, from, to, graph.config.orientired);
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
                                    this.lable(l.from.x, l.from.y, graph.w_matrix[m][n], ribsLabelSize, ribsLabelColor);
                                } else {
                                    this.lable(l.to.x, l.to.y, graph.w_matrix[m][n], ribsLabelSize, ribsLabelColor);
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

        const vertexLables = () => {
            const font_spacing = 4;
            for (const index in graph.config.coords) {
                const label = labelsInfo ? labelsInfo[index] : Number(index) + 1;
                this.lable(graph.config.coords[index].x - font_spacing, graph.config.coords[index].y + font_spacing, label, vertexLabelSize, vertexLabelColor);
            }
        }
        
        const background = () =>{
            const s = this.getSize();
            this.rect({ x: 0, y: 0 }, s, backgroundColor)
        }

        this.setLineWidth(ribsWidth);
        this.setLineColor(ribsColor);

        background();
        ribs();
        nodes(nodesColor);
        vertexLables();
        return this;
    }
}
