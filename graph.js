'use strict';

const Graph = (matrix, options, context) => {
  const graph = {
    plot_x: 1000,
    plot_y: 500,
    plot_x_offfset: 40,
    plot_y_offfset: 40,

    nodes_spacing: 40,
    nodes_radius: 20,

    matrix,

    nodes: matrix.length,

    coords: [],

    context: context || {}
  }

  graph.getPlotSize = function () {
    return {
      x: this.plot_x,
      y: this.plot_y
    }
  }

  graph.context = function (canvasId) {
   this.context = document.getElementById(canvasId).getContext('2d');
   return this;
  }


  graph.generateCoords = function () {
    this.coords.push({
      x: (this.plot_x/2),
      y: this.plot_y_offfset
    });
    this.coords.push({
      x: (this.plot_x/2)-this.nodes_spacing,
      y: this.plot_y_offfset*3
    });
    this.coords.push({
      x: (this.plot_x/2)+this.nodes_spacing,
      y: this.plot_y_offfset*3
    });
    this.coords.push({
      x: (this.plot_x/2)-this.plot_y_offfset*2,
      y: this.plot_y_offfset*5
    });
    this.coords.push({
      x: (this.plot_x/2),
      y: this.plot_y_offfset*5
    });
    this.coords.push({
      x: (this.plot_x/2)+this.plot_y_offfset*2,
      y: this.plot_y_offfset*5
    });
    this.coords.push({
      x: (this.plot_x/2)-this.plot_y_offfset*3,
      y: this.plot_y_offfset*7
    });
    this.coords.push({
      x: (this.plot_x/2)-this.nodes_spacing,
      y: this.plot_y_offfset*7
    });
    this.coords.push({
      x: (this.plot_x/2)+this.nodes_spacing,
      y: this.plot_y_offfset*7
    });
    this.coords.push({
      x: (this.plot_x/2)+this.plot_y_offfset*3,
      y: this.plot_y_offfset*7
    });
    return this;
  }

  graph.draw = function () {

    const beginDrawing = () => {
     this.context.beginPath();
    }

    const endDrawing = option => {
     const options = {
       'stroke': () => this.context.stroke(),
       'fill': () => this.context.fill()
     };
     options[option]();
    }

    const drawNode = (x, y) => {
     beginDrawing();
     this.context.arc(x, y, this.nodes_radius, 0, 2*Math.PI);
     endDrawing('stroke');
    }

    const drawNumber = (x, y, n) => {
      this.context.font = '12px serif';
      this.context.fillText(n.toString(), x, y);
    }

    const drawArrow = (fromx, fromy, tox, toy) => {
      const headlen = 10; // length of head in pixels
      const dx = tox - fromx;
      const dy = toy - fromy;
      const angle = Math.atan2(dy, dx);
      this.context.beginPath();
      this.context.moveTo(fromx, fromy);
      this.context.lineTo(tox, toy);
      this.context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
      this.context.moveTo(tox, toy);
      this.context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
      this.context.stroke();
    }

    const drawLine = (from, to) => {
      this.context.beginPath();
      this.context.moveTo(from.x, from.y);
      this.context.lineTo(to.x, to.y);
      this.context.stroke();
    }

    const drawNodes = () => {
      for(const {x, y} of this.coords){
        drawNode(x, y);
      }
    }


    const drawNumbers = () => {
      const font_spacing = 4;
      for(const index in this.coords){
        drawNumber(this.coords[index].x - font_spacing, this.coords[index].y + font_spacing, Number(index)+1);
      }
    }

    const removeCollisions = () => {
    }

    const drawArrows = () => {
      for(const m in this.matrix){
        for(const n in this.matrix[m]){
          if(this.matrix[m][n]){
            let fromX = this.coords[m].x,
                fromY = this.coords[m].y,
                toX = this.coords[n].x,
                toY = this.coords[n].y;

                if(fromX < toX && fromY === toY){
                  fromX += this.nodes_radius;
                  toX -= this.nodes_radius;
                }
                if(fromX > toX && fromY === toY){
                  fromX -= this.nodes_radius;
                  toX += this.nodes_radius;
                }
                if(fromX === toX && fromY < toY) {
                  fromY += this.nodes_radius;
                  toY -= this.nodes_radius;
                }
                if(fromX === toX && fromY > toY) {
                  fromY -= this.nodes_radius;
                  toY += this.nodes_radius;
                }

                if(fromX > toX && fromY < toY) {
                  fromY += this.nodes_radius;
                  toY -= this.nodes_radius;
                }
                if(fromX < toX && fromY > toY) {
                  fromY -= this.nodes_radius;
                  toY += this.nodes_radius;
                }
                if(fromX > toX && fromY > toY) {
                  fromY -= this.nodes_radius;
                  toY += this.nodes_radius;
                }
                if(fromX < toX && fromY < toY) {
                  fromY += this.nodes_radius;
                  toY -= this.nodes_radius;
                }

            if(this.matrix[m][n] === this.matrix[n][m] && this.matrix[n][m] && this.matrix[m][n] && m > n){
              const lineFrom = {
                x: fromX,
                y: fromY
              };
              const lineTo = {
                x: toX + this.nodes_radius*1,
                y: toY + this.nodes_radius*1.5
              };
              drawLine(lineFrom, lineTo);
              lineFrom.x = lineTo.x;
              lineFrom.y = lineTo.y;
              lineTo.x = toX;
              lineTo.y = toY;
              drawLine(lineFrom, lineTo);
              fromX = lineFrom.x;
              fromY = lineFrom.y;
              toX = lineTo.x;
              toY = lineTo.y;


            }
            if(this.matrix[m][n] === this.matrix[n][m] && this.matrix[n][m] && this.matrix[m][n], n === m){
              const lineFrom = {
                x: fromX + this.nodes_radius,
                y: fromY
              };
              const lineTo = {
                x: toX + this.nodes_radius*2,
                y: toY + this.nodes_radius
              };

              drawLine(lineFrom, lineTo);
              lineFrom.x = lineTo.x;
              lineFrom.y = lineTo.y;
              lineTo.x -= this.nodes_radius;
              lineTo.y += this.nodes_radius;
              drawLine(lineFrom, lineTo);
              lineFrom.x = lineTo.x;
              lineFrom.y = lineTo.y;
              lineTo.x -= this.nodes_radius;
              lineTo.y -= this.nodes_radius;
              drawLine(lineFrom, lineTo);
              fromX = lineFrom.x;
              fromY = lineFrom.y;
              toX = lineTo.x;
              toY = lineTo.y;
            }



            // проходит ли стрелка через вершину
            // находим вектор линии
            const vector = {
              x: toX - fromX,
              y: toY - fromY
            };
            // Составляем уравнение прямой линии
            const formul = (x, y) => !((((x - fromX)*vector.y) - ((y - fromY)*vector.x))/(vector.y*vector.x));
            // и проверяем все вершины
            for(const node in this.coords){
              const {x, y} = this.coords[node];
              // если центр вершины между началом и концом линии
              if((toX > x && x > fromX && toY > y && y > fromY) ||
                 (toX < x && x < fromX && toY > y && y > fromY) ||
                 (toX < x && x < fromX && toY < y && y < fromY) ||
                 (toX > x && x > fromX && toY < y && y < fromY)){
                // если центр лежит на линии
                if(formul(x, y)){
                  //console.log(m, n, x, y, fromX, fromY, vector, Number(node)+1);
                  const lineTo = {
                    x: x - this.nodes_radius,
                    y: y + this.nodes_radius
                  };
                  const lineFrom = {
                    x: fromX,
                    y: fromY
                  }
                  drawLine(lineFrom, lineTo);
                  fromX = lineTo.x;
                  fromY = lineTo.y;
                }
              }
            }

            drawArrow(fromX, fromY, toX, toY);
          }
        }
      }
    }
    drawNodes();
    drawNumbers();
    drawArrows();
  }

  return graph;
}
