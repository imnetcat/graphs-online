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

    const ribsVectors = [];

    const begin = () => {
      this.config.ctx.beginPath();
    }

    const end = (option) => {
      switch (option) {
        case 'stroke':
        this.config.ctx.stroke();
        break;
        case 'stroke':
        this.config.ctx.fill();
        break;
      }
    }

    const node = (x, y) => {
      begin();
      this.config.ctx.arc(x, y, this.config.nodes_radius, 0, 2*Math.PI);
      end('stroke');
    }

    const number = (x, y, n) => {
      this.config.ctx.font = '12px serif';
      this.config.ctx.fillText(n.toString(), x, y);
    }

    const arrow = (from, to) => {
      const fx = from.x,
            fy = from.y,
            tx = to.x,
            ty = to.y;
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
    const checkCollision = (from, to) => {
      // находим вектор линии
      const vector = {
        x: to.x - from.x,
        y: to.y - from.y
      };
      // Составляем уравнение прямой линии
      const formul = (x, y) => !((((x - from.x)*vector.y) - ((y - from.y)*vector.x))/(vector.y*vector.x));
      // и проверяем все вершины
      for(const node in this.config.coords){
        const {x, y} = this.config.coords[node];
        // если центр вершины между началом и концом линии
        if((to.x > x && x > from.x && to.y > y && y > from.y) ||
        (to.x < x && x < from.x && to.y > y && y > from.y) ||
        (to.x < x && x < from.x && to.y < y && y < from.y) ||
        (to.x > x && x > from.x && to.y < y && y < from.y)){
          // если центр лежит на линии
          if(formul(x, y)){
            // исправляем коллизию
            //repearCollision(from, to);
            let newTy = 0;
            let newTx = 0;
            // Horizontal lines
            // o < o
            if(from.x < to.x && from.y === to.y){
              newTx = -(to.x-from.x)/2;
              newTy = -((to.y-from.y)/2);
            }
            // o > o
            if(from.x > to.x && from.y === to.y){
              newTx = -(to.x-from.x)/2;
              newTy = -((to.y-from.y)/2);
            }
            // Vertical lines
            // o
            // ^
            // o
            if(from.x === to.x && from.y < to.y) {
              newTx = -(to.x-from.x)/2;
              newTy = -((to.y-from.y)/2);
            }
            // o
            // V
            // o
            if(from.x === to.x && from.y > to.y) {
              newTx = -(to.x-from.x)/2;
              newTy = -((to.y-from.y)/2);
            }

            // Diagonal lines
            //     o
            //   V
            // o
            if(from.x > to.x && from.y < to.y) {
              newTx = -(to.x-from.x)/4;
              newTy = -((to.y-from.y)/1.5);
            }
            //     o
            //   ^
            // o
            if(from.x < to.x && from.y > to.y) {
              newTx = -(to.x-from.x)/4;
              newTy = -((to.y-from.y)/1.5);
            }
            // o
            //  ^
            //    o
            if(from.x > to.x && from.y > to.y) {
              newTx = -(to.x-from.x)/4;
              newTy = -((to.y-from.y)/1.5);
            }
            // o
            //  V
            //    o
            if(from.x < to.x && from.y < to.y) {
              newTx = -(to.x-from.x)/4;
              newTy = -((to.y-from.y)/1.5);
            }
            to.x += newTx;
            to.y += newTy;
            line(from, to);
            from.x = to.x;
            from.y = to.y;
            to.x -= newTx;
            to.y -= newTy;
          }
        }
      }
    }
    const line = (from, to) => {
      checkCollision(from, to);
      this.config.ctx.beginPath();
      this.config.ctx.moveTo(from.x, from.y);
      this.config.ctx.lineTo(to.x, to.y);
      this.config.ctx.stroke();
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
      //    ^
      // <  o  >
      //    V
      const indents = (from, to) => {
        // Horizontal lines
        // o < o
        if(from.x < to.x && from.y === to.y){
          from.x += this.config.nodes_radius;
          to.x -= this.config.nodes_radius;
        }
        // o > o
        if(from.x > to.x && from.y === to.y){
          from.x -= this.config.nodes_radius;
          to.x += this.config.nodes_radius;
        }
        // Vertical lines
        // o
        // ^
        // o
        if(from.x === to.x && from.y < to.y) {
          from.y += this.config.nodes_radius;
          to.y -= this.config.nodes_radius;
        }
        // o
        // V
        // o
        if(from.x === to.x && from.y > to.y) {
          from.y -= this.config.nodes_radius;
          to.y += this.config.nodes_radius;
        }

        // Diagonal lines
        //     o
        //   V
        // o
        if(from.x > to.x && from.y < to.y) {
          from.y += this.config.nodes_radius;
          to.y -= this.config.nodes_radius;
        }
        //     o
        //   ^
        // o
        if(from.x < to.x && from.y > to.y) {
          from.y -= this.config.nodes_radius;
          to.y += this.config.nodes_radius;
        }
        // o
        //  ^
        //    o
        if(from.x > to.x && from.y > to.y) {
          from.y -= this.config.nodes_radius;
          to.y += this.config.nodes_radius;
        }
        // o
        //  V
        //    o
        if(from.x < to.x && from.y < to.y) {
          from.y += this.config.nodes_radius;
          to.y -= this.config.nodes_radius;
        }

        //  o > V
        //  ^   V
        //  ^ < <
        if(from.x === to.x && from.y === to.y) {
          from.x += this.config.nodes_radius;
          to.x += this.config.nodes_radius*2;
          to.y += this.config.nodes_radius;
        }
      };

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

            // отступы конца и начала рёбер от вершин графа
            indents(from, to);

            //
            if(this.matrix[m][n] === this.matrix[n][m] && this.matrix[n][m] && this.matrix[m][n] && n !== m){
              console.log(m, n);
              let newTx = 0;
              let newTy = 0;

              if(from.x !== to.x && from.y === to.y) {      // Horizontal lines
                newTx = -(to.x-from.x)/2;
                newTy = (newTx/Math.abs(newTx))*(this.config.nodes_radius/2);
              } else if(from.x === to.x && from.y !== to.y) { // Vertical lines
                newTx = (newTy/Math.abs(newTy))*(this.config.nodes_radius/2);
                newTY = -(to.y-from.y)/2;
              } else {                                        // Diagonal lines
                newTx = -(to.x-from.x)/4;
                newTy = -((to.y-from.y)/1.5);
              }
              console.log(from, to, newTx, newTy);
              to.x += newTx;
              to.y += newTy;
              console.log(from, to);
              line(from, to);
              from.x = to.x;
              from.y = to.y;
              to.x -= newTx;
              to.y -= newTy;
              console.log(from, to);
            }

            //
            if(this.matrix[m][n] === this.matrix[n][m] && this.matrix[n][m] && this.matrix[m][n] && n === m){
              line(from, to);
              from.x = to.x;
              from.y = to.y;
              to.x -= this.config.nodes_radius;
              to.y += this.config.nodes_radius;
              line(from, to);
              from.x = to.x;
              from.y = to.y;
              to.x -= this.config.nodes_radius;
              to.y -= this.config.nodes_radius;
            }

            // проходит ли стрелка через вершину

            if(this.config.orientired){
              line(from, to);
              arrow(from, to);
            } else {
              line(from, to);
            }
          }
        }
      }
    }
    nodes();
    numbers();
    ribs();
    return this;
  }

  return graph;
}
