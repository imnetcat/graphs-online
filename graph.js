'use strict';

const Graph = (matrix, ctx) => {
  const graph = {
    plot_x: 1000,
    plot_y: 500,
    matrix,
    nodes: matrix.length,
    config: {
      plot_x_offfset: 10,
      plot_y_offfset: 100,

      nodes_radius: 20,
      nodes_spacing: 40,

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
      x: this.config.plot_x_offfset+(this.plot_x/2),
      y: this.config.plot_y_offfset
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)-this.config.nodes_spacing,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*2
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)+this.config.nodes_spacing,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*2
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)-this.config.nodes_spacing*2,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*4
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2),
      y: this.config.plot_y_offfset+this.config.nodes_spacing*4
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)+this.config.nodes_spacing*2,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*4
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)-this.config.nodes_spacing*3,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*6
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)-this.config.nodes_spacing,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*6
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)+this.config.nodes_spacing,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*6
    });
    this.config.coords.push({
      x: this.config.plot_x_offfset+(this.plot_x/2)+this.config.nodes_spacing*3,
      y: this.config.plot_y_offfset+this.config.nodes_spacing*6
    });
    return this;
  }

  graph.draw = function () {

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
      this.config.ctx.arc(x, y, this.config.nodes_radius, 0, 2*Math.PI);
      end('fill');

      // border
      begin();
      this.config.ctx.arc(x, y, this.config.nodes_radius, 0, 2*Math.PI);
      end('stroke');
    }

    const number = (x, y, n) => {
      this.config.ctx.font = '12px serif';
      this.config.ctx.fillStyle = "black";
      this.config.ctx.fillText(n.toString(), x, y);
    }

    // intersection of a segment with a circle
    const lineCrossNode = (from, to, circle, radius) => {
      const a =  Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2);
      const b =  2* ( (to.x - from.x)*(from.x - circle.x) + (to.y - from.y)*(from.y - circle.y) ) ;
      const c =  Math.pow(circle.x, 2) + Math.pow(circle.y, 2) + Math.pow(from.x, 2) + Math.pow(from.y, 2) - 2* ( circle.x*from.x + circle.y*from.y ) - Math.pow(radius, 2) ;

      // descreminant
      const d =  Math.pow(b, 2) - 4 * a * c;

      if ( d < 0 ) {
        // no intersection
      	return undefined;
      }

      // found parameters  t1 & t2
      const t1 = (-b - Math.sqrt(d))/(2*a);
      const t2 = (-b + Math.sqrt(d))/(2*a);

      let x, y;
      // check segment of line
      if(t1 >= 0 && t1 <= 1){
        x = from.x * (1 - t1) + to.x * t1;
        y = from.y * (1 - t1) + to.y * t1;
      } else if(t2 >= 0 && t2 <= 1) {
        x = from.x * (1 - t2) + to.x * t2;
        y = from.y * (1 - t2) + to.y * t2;
      } else {
        return undefined;
      }

      return {x, y};
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
    const checkCollision = (linesArray, from, to, fromNode, toNode) => {
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
        let a = y2-y1;
        let b = x1-x2;
        let c = -x1*(y2-y1)+y1*(x2-x1);
        const t = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        if (c>0) {
          a = -a;
          b = -b;
          c = -c;
        }
        return (a*x0+b*y0+c)/t;
      }
      // и проверяем все вершины
      for(const node in this.config.coords){
        const {x, y} = this.config.coords[node];

        // пропускаем точки начала и конца линии
        if((x === fromNode.x &&
            y === fromNode.y) ||
            (x === toNode.x &&
            y === toNode.y)){
            console.log({x, y}, fromNode, toNode);
          continue;
        }
        // если центр вершины между началом и концом линии
        if((to.x >= x && x >= from.x && to.y >= y && y >= from.y) ||
          (to.x <= x && x <= from.x && to.y >= y && y >= from.y) ||
          (to.x <= x && x <= from.x && to.y <= y && y <= from.y) ||
          (to.x >= x && x >= from.x && to.y <= y && y <= from.y)){
          // если линия пересекает вершины графа
          const pointCoords = {x, y};
          const lineCoords = {from, to}
          const distance = distanceFromPointToLine(pointCoords, lineCoords);
          //console.log(distance, node);
          if(Math.abs(distance) < this.config.nodes_radius){
            // исправляем коллизию
            let newTy = 0;
            let newTx = 0;
            // Horizontal lines
            // o < o
            if(from.x < to.x && from.y === to.y){
              newTx = to.x-(to.x-from.x)/2;
              newTy = from.y-this.config.nodes_radius*2;

            }
            // o > o
            if(from.x > to.x && from.y === to.y){
              newTx = to.x-(to.x-from.x)/2;
              newTy = from.y-this.config.nodes_radius*2;
            }
            // Vertical lines
            // o
            // ^
            // o
            if(from.x === to.x && from.y < to.y) {
              newTx = from.x/2;
              newTy = to.y-((to.y-from.y)/2);
            }
            // o
            // V
            // o
            if(from.x === to.x && from.y > to.y) {
              newTx = from.x/2;
              newTy = to.y-((to.y-from.y)/2);
            }

            // Diagonal lines
            //     o
            //   V
            // o
            if(from.x > to.x && from.y < to.y) {
              newTx = to.x-(to.x-from.x)/4;
              newTy = to.y-((to.y-from.y)/1.5);
            }
            //     o
            //   ^
            // o
            if(from.x < to.x && from.y > to.y) {
              newTx = to.x-(to.x-from.x)/4;
              newTy = to.y-((to.y-from.y)/1.5);
            }
            // o
            //  ^
            //    o
            if(from.x > to.x && from.y > to.y) {
              newTx = to.x-(to.x-from.x)/4;
              newTy = to.y-((to.y-from.y)/1.5);
            }
            // o
            //  V
            //    o
            if(from.x < to.x && from.y < to.y) {
              newTx = to.x-(to.x-from.x)/4;
              newTy = to.y-((to.y-from.y)/1.5);
            }
            //console.log(from, to, newTx, newTy);
            linesArray.push({
              from,
              to: {
                x: newTx,
                y: newTy
              }
            });
            from = {
              x: newTx,
              y: newTy
            };
            //return linesArray;
            return checkCollision(linesArray, from, to, fromNode, toNode);
          }
        }
      }
      linesArray.push({from, to});
      return linesArray;
    }
    const line = (from, to, flags) => {
      let linesArray = [];
      linesArray = checkCollision(linesArray, from, to, from, to);
      for(const l of linesArray){
        this.config.ctx.beginPath();
        this.config.ctx.moveTo(l.from.x, l.from.y);
        this.config.ctx.lineTo(l.to.x, l.to.y);
        this.config.ctx.stroke();
      }
      if(flags){
        if(flags.arrow){
          arrow(linesArray[linesArray.length-1].from, to);
        }
      }
    }


    const nodes = () => {
      for(const {x, y} of this.config.coords){
        node(x, y);
      }
    }

    const numbers = () => {
      const font_spacing = 4;
      for(const index in this.config.coords){
        number(this.config.coords[index].x - font_spacing, this.config.coords[index].y + font_spacing, Number(index)+1);
      }
    }

    const ribs = () => {
      for(const m in this.matrix){
        for(const n in this.matrix[m]){
          if(this.matrix[m][n]){
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
              arrow: this.config.orientired
            }
            //
            if(this.matrix[m][n] === this.matrix[n][m] && this.matrix[n][m] && this.matrix[m][n] && n !== m){
              let newTx = 0;
              let newTy = 0;
              if(from.x !== to.x && from.y === to.y) {      // Horizontal lines
                if(to.x > from.x){
                  newTx = to.x-(to.x-from.x)/2;
                  newTy = from.y -(this.config.nodes_radius);
                } else {
                  newTx = from.x-(from.x-to.x)/2;
                  newTy = from.y + (this.config.nodes_radius);
                }
              } else if(from.x === to.x && from.y !== to.y) { // Vertical lines
                if(to.y > from.y){
                  newTx = from.x -(this.config.nodes_radius);
                  newTy = to.y-(to.y-from.y)/2;
                } else {
                  newTx = from.x + (this.config.nodes_radius);
                  newTy = from.y-(from.y-to.y)/2;
                }
              } else {                                        // Diagonal line
                //     o
                //   V
                // o
                if(from.x > to.x && from.y < to.y) {
                  newTx = from.x;
                  newTy = to.y-(to.y-from.y)/2;
                }
                //     o
                //   ^
                // o
                if(from.x < to.x && from.y > to.y) {
                  newTx = from.x;
                  newTy = from.y-(from.y-to.y)/2;
                }
                // o
                //  ^
                //    o
                if(from.x > to.x && from.y > to.y) {
                  newTx = from.x;
                  newTy = from.y-(from.y-to.y)/2;
                }
                // o
                //  V
                //    o
                if(from.x < to.x && from.y < to.y) {
                  newTx = from.x;
                  newTy = to.y-(to.y-from.y)/2;
                }
              }
              const newTo = {
                x: newTx,
                y: newTy
              };
              line(from, newTo);
              from.x = newTx;
              from.y = newTy;
            }

            //
            if(this.matrix[m][n] === this.matrix[n][m] && this.matrix[n][m] && this.matrix[m][n] && n === m){
              to.x += this.config.nodes_radius*2;
              to.y += this.config.nodes_radius/2;
              line(from, to);
              from.x = to.x;
              from.y = to.y;
              to.x -= this.config.nodes_radius*1.5;
              to.y += this.config.nodes_radius*1.5;
              line(from, to);
              from.x = to.x;
              from.y = to.y;
              to.x -= this.config.nodes_radius/2;
              to.y -= this.config.nodes_radius*2;
            }

            line(from, to, flags);
          }
        }
      }
    }
    ribs();
    nodes();
    numbers();
    return this;
  }

  return graph;
}
