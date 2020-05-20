'use strict';

class BFS {
    constructor(matrix, node) {
        this.colored = [];
        this.labelsInfo = [];
        this.bfslevel = 2;
        this.bfs = matrix;
        this.nodesColor = new Array(this.bfs.length).fill(BFS.DEFAULT_NODE_COLOR);
        this.visited = new Array(this.bfs.length).fill(false);
        this.visited[node] = true;
        this.queqe = new Array();
        this.queqe.push(node);
        
        this.nodesColor[node] = BFS.ACTIVE_NODE_COLOR;
        this.colored.push(node);

        this.labelsInfo.push({ i: node, text: 1 });
    }

    static DEFAULT_NODE_COLOR = Settings.vertex.color.default;
    static ACTIVE_NODE_COLOR = Settings.vertex.color.active;
    static VISITED_NODE_COLOR = Settings.vertex.color.visited;

    step() {
        this.nodesColor = new Array(this.bfs.length).fill(BFS.DEFAULT_NODE_COLOR);
        for (const i of this.colored) {
            this.nodesColor[i] = BFS.VISITED_NODE_COLOR;
        }
        if (this.queqe.length) {

            let isEmptyRow = true;
            const row = this.bfs[this.queqe[0]];
            for (let u = 0; u < row.length; u++) {
                if (row[u] && !this.visited[u]) {
                    this.visited[u] = true;
                    this.queqe.push(u);
                    this.bfs[this.queqe[0]][u] = 1;

                    this.nodesColor[u] = BFS.ACTIVE_NODE_COLOR;
                    this.colored.push(u);

                    this.labelsInfo.push({ i: u, text: this.bfslevel });

                    this.bfslevel++;
                    isEmptyRow = false;
                }
            }
            this.queqe.shift();

            if (isEmptyRow) {
                return this.step();
            }

            return true;
        } else {
            return false;
        }
    }
};
