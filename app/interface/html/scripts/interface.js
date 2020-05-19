'use strict';

class Interface {
    
    static graph;

    static menus = [];

    static Show(id) {
        for (const menu of Interface.menus) {
            if (menu.id === id) {
                menu.Show();
            } else {
                menu.Hide();
            }
        }
    }
    
    static setInfo(info) {
        DOM.GetById("unified").setHTML((info.uni === -1) ? "false" : info.uni.toString());

        const infoTable = DOM.GetById("nodes-props");

        infoTable.delAllRows(1);

        for (let i = 0; i < info.degrees.length; i++) {
            const row = infoTable.addRow(i + 1);
            row.addCell(0).setHTML(`<b>${(i + 1).toString()}</b>`);
            if (info.isOrientired) {
                row.addCell(1).setHTML(`+ ${info.degrees[i].from.toString()}<br>- ${info.degrees[i].to.toString()}`);
            } else {
                row.addCell(1).setHTML(info.degrees[i].sum().toString());
            }
            row.addCell(2).setHTML((info.hangingNodes[i]) ? "Yes" : "");
            row.addCell(3).setHTML((info.isolatedNodes[i]) ? "Yes" : "");
        }

        const weightTable = DOM.GetById("ribs-weight");
        weightTable.setHTML('');
        let row = weightTable.addRow(0);
        for (let i = 0; i < info.weight.length; i++) {
            row.addCell(i).setText(i+1);
        }
        row.addCell(0).setText('');
        for (let i = 1; i <= info.weight.length; i++) {
           row = weightTable.addRow(i);
           row.addCell(0).setText(i);
        }

        for (let i = 0; i < info.weight.length; i++) {
            row = weightTable.row(i+1);
            for (let j = 0; j < info.weight[i].length; j++) {
                row.addCell(j+1).setText(info.weight[i][j]);
            }
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
    
    static drawGraphs(adj_matrix, w_matrix, options) {
        const canvId = "canv";
        const canvas = new Canvas(canvId).clear('2d');

        this.graph = new Graph(adj_matrix);

        if (w_matrix) {
            this.graph.weight(w_matrix)
        }

        this.graph.orientired(options.orientired)
            .displayForm(options.form)
            .generateCoords();

        canvas.setSize(this.graph.getSize())
            .draw(this.graph, options.nodesColor, options.labelsInfo);

        const degrees = this.graph.degrees();
        const uni = this.graph.isUni();
        const hangingNodes = this.graph.hangingNodes();
        const isolatedNodes = this.graph.isolatedNodes();
        const isOrientired = this.graph.isOrientired();
        const weight = this.graph.w_matrix;
        this.setInfo({
            uni,
            degrees,
            hangingNodes,
            weight,
            isolatedNodes,
            isOrientired
        });
    }
    static refreshCanvas(nodesColor, labelsInfo) {

        const form = new FormData(document.forms.menu);
        const adj_matrixStr = DOM.GetById('adj-matrix').value.split('\n');
        let w_matrixStr = DOM.GetById('weight-matrix').value;
        const w_matrix = [];
        
        const adj_matrix = [];
        for (const row of adj_matrixStr) {
            adj_matrix.push([]);
            const elems = row.split(' ');
            for (const elem of elems) {
                adj_matrix[adj_matrix.length - 1].push(Number(elem));
            }
        }

        if (!this.isMatrixCorrect(adj_matrix)) {
            alert('You entered the wrong adjacency matrix');
            return;
        }

        if (w_matrixStr) {
            w_matrixStr = w_matrixStr.split('\n');
            for (const row of w_matrixStr) {
                w_matrix.push([]);
                const elems = row.split(' ');
                for (const elem of elems) {
                    w_matrix[w_matrix.length - 1].push(Number(elem));
                }
            }
            if (adj_matrix.length != w_matrix.length || adj_matrix[0].length != w_matrix[0].length) {
                alert('You entered the wrong weight matrix');
                return;
            }
        }

        nodesColor = nodesColor || new Array(adj_matrix.length).fill("#ffffff")
        const orientired = form.get('orientiation');
        const displayForm = form.get('display-form');
        const options = {
            orientired: orientired === 'orientired' ? true : false,
            form: displayForm,
            nodesColor,
            labelsInfo
        }

        this.drawGraphs(adj_matrix, w_matrix, options);
    }
};

// настраиваем интерфейс по дефолтным значиниям после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // добавляем все меню
    Interface.menus.push(new Menu('settings'));
    Interface.menus.push(new Menu('properties'));
    Interface.menus.push(new Menu('algorithms'));
    Interface.menus.push(new Menu('definition'));

    // устанавливаем меню видимое по умолчанию
    Interface.Show('definition');

    // загружаем пример графа
    Interface.refreshCanvas();
})
