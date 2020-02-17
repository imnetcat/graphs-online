'use strict';

const Graph = (matrix, ctx) => {
  const graph = {
    plot_x: 1000,
    plot_y: 500,
    matrix,
    nodes: matrix.length,
    config: {
      plot_x_offfset: 40,
      plot_y_offfset: 40,

      nodes_spacing: 40,
      nodes_radius: 20,

      orientired: true,

      coords: [],

      ctx: ctx || {}
    }
  }

  graph.getSize = function () {
    return {
      x: this.plot_x,
      y: this.plot_y
    }
  }

  graph.context = function (ctx) {
   this.config.ctx = ctx;
   return this;
  }

  graph.orientired = function(isOrientired) {
    this.config.orientired = isOrientired;
    return this;
  }

  graph.generateCoords = function () {
    this.config.coords.push({
      x: (this.plot_x/2),
      y: this.config.plot_y_offfset
    });
    this.config.coords.push({
      x: (this.plot_x/2)-this.config.nodes_spacing,
      y: this.config.plot_y_offfset*3
    });
    this.config.coords.push({
      x: (this.plot_x/2)+this.config.nodes_spacing,
      y: this.config.plot_y_offfset*3
    });
    this.config.coords.push({
      x: (this.plot_x/2)-this.config.plot_y_offfset*2,
      y: this.config.plot_y_offfset*5
    });
    this.config.coords.push({
      x: (this.plot_x/2),
      y: this.config.plot_y_offfset*5
    });
    this.config.coords.push({
      x: (this.plot_x/2)+this.config.plot_y_offfset*2,
      y: this.config.plot_y_offfset*5
    });
    this.config.coords.push({
      x: (this.plot_x/2)-this.config.plot_y_offfset*3,
      y: this.config.plot_y_offfset*7
    });
    this.config.coords.push({
      x: (this.plot_x/2)-this.config.nodes_spacing,
      y: this.config.plot_y_offfset*7
    });
    this.config.coords.push({
      x: (this.plot_x/2)+this.config.nodes_spacing,
      y: this.config.plot_y_offfset*7
    });
    this.config.coords.push({
      x: (this.plot_x/2)+this.config.plot_y_offfset*3,
      y: this.config.plot_y_offfset*7
    });
    return this;
  }

  graph.draw = function () {

    const beginDrawing = () => {
      this.config.ctx.beginPath();
    }

    const endDrawing = (option) => {
      switch (option) {
        case 'stroke':
        this.config.ctx.stroke();
        break;
        case 'stroke':
        this.config.ctx.fill();
        break;
      }
    }

    const drawNode = (x, y) => {
      beginDrawing();
      this.config.ctx.arc(x, y, this.config.nodes_radius, 0, 2*Math.PI);
      endDrawing('stroke');
    }

    const drawNumber = (x, y, n) => {
      this.config.ctx.font = '12px serif';
      this.config.ctx.fillText(n.toString(), x, y);
    }

    const drawArrow = (from, to) => {
      const fromx = from.x,
            fromy = from.y,
            tox = to.x,
            toy = to.y;
      const headlen = 10; // length of head in pixels
      const dx = tox - fromx;
      const dy = toy - fromy;
      const angle = Math.atan2(dy, dx);
      this.config.ctx.beginPath();
      this.config.ctx.moveTo(fromx, fromy);
      this.config.ctx.lineTo(tox, toy);
      this.config.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
      this.config.ctx.moveTo(tox, toy);
      this.config.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
      this.config.ctx.stroke();
    }

    const drawLine = (from, to) => {
      this.config.ctx.beginPath();
      this.config.ctx.moveTo(from.x, from.y);
      this.config.ctx.lineTo(to.x, to.y);
      this.config.ctx.stroke();
    }

    const drawNodes = () => {
      for(const {x, y} of this.config.coords){
        drawNode(x, y);
      }
    }

    const drawNumbers = () => {
      const font_spacing = 4;
      for(const index in this.config.coords){
        drawNumber(this.config.coords[index].x - font_spacing, this.config.coords[index].y + font_spacing, Number(index)+1);
      }
    }

    const removeCollisions = () => {
    }

    const drawRibs = () => {
      for(const m in this.matrix){
        for(const n in this.matrix[m]){
          if(this.matrix[m][n]){
            let fromX = this.config.coords[m].x,
            fromY = this.config.coords[m].y,
            toX = this.config.coords[n].x,
            toY = this.config.coords[n].y;

            if(fromX < toX && fromY === toY){
              fromX += this.config.nodes_radius;
              toX -= this.config.nodes_radius;
            }
            if(fromX > toX && fromY === toY){
              fromX -= this.config.nodes_radius;
              toX += this.config.nodes_radius;
            }
            if(fromX === toX && fromY < toY) {
              fromY += this.config.nodes_radius;
              toY -= this.config.nodes_radius;
            }
            if(fromX === toX && fromY > toY) {
              fromY -= this.config.nodes_radius;
              toY += this.config.nodes_radius;
            }

            if(fromX > toX && fromY < toY) {
              fromY += this.config.nodes_radius;
              toY -= this.config.nodes_radius;
            }
            if(fromX < toX && fromY > toY) {
              fromY -= this.config.nodes_radius;
              toY += this.config.nodes_radius;
            }
            if(fromX > toX && fromY > toY) {
              fromY -= this.config.nodes_radius;
              toY += this.config.nodes_radius;
            }
            if(fromX < toX && fromY < toY) {
              fromY += this.config.nodes_radius;
              toY -= this.config.nodes_radius;
            }

            if(this.matrix[m][n] === this.matrix[n][m] && this.matrix[n][m] && this.matrix[m][n] && m > n){
              const lineFrom = {
                x: fromX,
                y: fromY
              };
              const lineTo = {
                x: toX + this.config.nodes_radius*1,
                y: toY + this.config.nodes_radius*1.5
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
                x: fromX + this.config.nodes_radius,
                y: fromY
              };
              const lineTo = {
                x: toX + this.config.nodes_radius*2,
                y: toY + this.config.nodes_radius
              };

              drawLine(lineFrom, lineTo);
              lineFrom.x = lineTo.x;
              lineFrom.y = lineTo.y;
              lineTo.x -= this.config.nodes_radius;
              lineTo.y += this.config.nodes_radius;
              drawLine(lineFrom, lineTo);
              lineFrom.x = lineTo.x;
              lineFrom.y = lineTo.y;
              lineTo.x -= this.config.nodes_radius;
              lineTo.y -= this.config.nodes_radius;
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
            for(const node in this.config.coords){
              const {x, y} = this.config.coords[node];
              // если центр вершины между началом и концом линии
              if((toX > x && x > fromX && toY > y && y > fromY) ||
              (toX < x && x < fromX && toY > y && y > fromY) ||
              (toX < x && x < fromX && toY < y && y < fromY) ||
              (toX > x && x > fromX && toY < y && y < fromY)){
                // если центр лежит на линии
                if(formul(x, y)){
                  //console.log(m, n, x, y, fromX, fromY, vector, Number(node)+1);
                  const lineTo = {
                    x: x - this.config.nodes_radius,
                    y: y + this.config.nodes_radius
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
            const lineTo = {
              x: toX,
              y: toY
            };
            const lineFrom = {
              x: fromX,
              y: fromY
            }
            if(this.config.orientired){
              drawArrow(lineFrom, lineTo);
            } else {
              drawLine(lineFrom, lineTo);
            }
          }
        }
      }
    }
    drawNodes();
    drawNumbers();
    drawRibs();
    return this;
  }

  return graph;
}
