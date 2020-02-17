'use strict';

const n1 = 9;
const n2 = 5;
const n3 = 0;
const n4 = 5;

const plot_x = 1000;
const plot_y = 500;
const plot_x_offfset = 40;
const plot_y_offfset = 40;

const nodes_spacing = 40;
const nodes_radius = 20;

const nodes = 10 + n3;

const matrixNa = [
  [ 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 1, 1, 0, 0, 0, 0, 1, 0, 0, 0 ],
  [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0 ],
  [ 0, 1, 0, 0, 0, 0, 1, 1, 1, 0 ],
  [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ],
];

const matrixNe = [
  [ 0, 0, 1, 0, 0, 1, 0, 0, 0, 0 ],
  [ 0, 0, 1, 1, 0, 0, 0, 1, 1, 0 ],
  [ 1, 1, 0, 0, 0, 0, 1, 0, 0, 1 ],
  [ 0, 1, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 1, 1, 1, 0, 0 ],
  [ 1, 0, 0, 0, 1, 0, 1, 0, 0, 0 ],
  [ 0, 0, 1, 0, 1, 1, 1, 1, 0, 0 ],
  [ 0, 1, 0, 0, 1, 0, 1, 1, 1, 0 ],
  [ 0, 1, 0, 0, 0, 0, 0, 1, 0, 0 ],
  [ 0, 0, 1, 0, 0, 0, 0, 0, 0, 0 ]
];

const showPlot = (x, y) => {
  const canvas = document.getElementById("canv");
  canvas.setAttribute("width", `${x}px`);
  canvas.setAttribute("height", `${y}px`);
}

const getContext = () => {
 const canvas = document.getElementById("canv");
 const ctx = canvas.getContext('2d');
 return ctx;
}

const beginDrawing = ctx => {
 ctx.beginPath();
}

const endDrawing = (ctx, option) => {
 const options = {
   'stroke': () => ctx.stroke(),
   'fill': () => ctx.fill()
 };
 options[option]();
}

const drawNode = (ctx, x, y) => {
 beginDrawing(ctx);
 ctx.arc(x, y, nodes_radius, 0, 2*Math.PI);
 endDrawing(ctx, 'stroke');
}

const drawNumber = (ctx, x, y, n) => {
  ctx.font = '12px serif';
  ctx.fillText(n.toString(), x, y);
}

const coords = [];

const generateCoords = (radius, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset) => {
  coords.push({
    x: (plot_x/2),
    y: plot_y_offfset
  });
  coords.push({
    x: (plot_x/2)-nodes_spacing,
    y: plot_y_offfset*3
  });
  coords.push({
    x: (plot_x/2)+nodes_spacing,
    y: plot_y_offfset*3
  });
  coords.push({
    x: (plot_x/2)-plot_y_offfset*2,
    y: plot_y_offfset*5
  });
  coords.push({
    x: (plot_x/2),
    y: plot_y_offfset*5
  });
  coords.push({
    x: (plot_x/2)+plot_y_offfset*2,
    y: plot_y_offfset*5
  });
  coords.push({
    x: (plot_x/2)-plot_y_offfset*3,
    y: plot_y_offfset*7
  });
  coords.push({
    x: (plot_x/2)-nodes_spacing,
    y: plot_y_offfset*7
  });
  coords.push({
    x: (plot_x/2)+nodes_spacing,
    y: plot_y_offfset*7
  });
  coords.push({
    x: (plot_x/2)+plot_y_offfset*3,
    y: plot_y_offfset*7
  });
}

const drawArrow = (ctx, fromx, fromy, tox, toy) => {
  const headlen = 10; // length of head in pixels
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}
const drawLine = (ctx, from, to) => {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

const drawNodes = (ctx) => {
  for(const {x, y} of coords){
    drawNode(ctx, x, y);
  }
}


const drawNumbers = (ctx, nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset) => {
  const font_spacing = 4;
  for(const index in coords){
    drawNumber(ctx, coords[index].x - font_spacing, coords[index].y + font_spacing, Number(index)+1);
  }
}

const removeCollisions = () => {

}

const drawArrows = (ctx) => {
  for(const m in matrixNa){
    for(const n in matrixNa[m]){
      if(matrixNa[m][n]){
        let fromX = coords[m].x,
            fromY = coords[m].y,
            toX = coords[n].x,
            toY = coords[n].y;

            if(fromX < toX && fromY === toY){
              fromX += nodes_radius;
              toX -= nodes_radius;
            }
            if(fromX > toX && fromY === toY){
              fromX -= nodes_radius;
              toX += nodes_radius;
            }
            if(fromX === toX && fromY < toY) {
              fromY += nodes_radius;
              toY -= nodes_radius;
            }
            if(fromX === toX && fromY > toY) {
              fromY -= nodes_radius;
              toY += nodes_radius;
            }

            if(fromX > toX && fromY < toY) {
              fromY += nodes_radius;
              toY -= nodes_radius;
            }
            if(fromX < toX && fromY > toY) {
              fromY -= nodes_radius;
              toY += nodes_radius;
            }
            if(fromX > toX && fromY > toY) {
              fromY -= nodes_radius;
              toY += nodes_radius;
            }
            if(fromX < toX && fromY < toY) {
              fromY += nodes_radius;
              toY -= nodes_radius;
            }

        if(matrixNa[m][n] === matrixNa[n][m] && matrixNa[n][m] && matrixNa[m][n] && m > n){
          const lineFrom = {
            x: fromX,
            y: fromY
          };
          const lineTo = {
            x: toX + nodes_radius*1,
            y: toY + nodes_radius*1.5
          };
          drawLine(ctx, lineFrom, lineTo);
          lineFrom.x = lineTo.x;
          lineFrom.y = lineTo.y;
          lineTo.x = toX;
          lineTo.y = toY;
          drawLine(ctx, lineFrom, lineTo);
          fromX = lineFrom.x;
          fromY = lineFrom.y;
          toX = lineTo.x;
          toY = lineTo.y;


        }
        if(matrixNa[m][n] === matrixNa[n][m] && matrixNa[n][m] && matrixNa[m][n], n === m){
          const lineFrom = {
            x: fromX + nodes_radius,
            y: fromY
          };
          const lineTo = {
            x: toX + nodes_radius*2,
            y: toY + nodes_radius
          };

          drawLine(ctx, lineFrom, lineTo);
          lineFrom.x = lineTo.x;
          lineFrom.y = lineTo.y;
          lineTo.x -= nodes_radius;
          lineTo.y += nodes_radius;
          drawLine(ctx, lineFrom, lineTo);
          lineFrom.x = lineTo.x;
          lineFrom.y = lineTo.y;
          lineTo.x -= nodes_radius;
          lineTo.y -= nodes_radius;
          drawLine(ctx, lineFrom, lineTo);
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
        for(const node in coords){
          const {x, y} = coords[node];
          // если центр вершины между началом и концом линии
          if((toX > x && x > fromX && toY > y && y > fromY) ||
             (toX < x && x < fromX && toY > y && y > fromY) ||
             (toX < x && x < fromX && toY < y && y < fromY) ||
             (toX > x && x > fromX && toY < y && y < fromY)){
            // если центр лежит на линии
            if(formul(x, y)){
              //console.log(m, n, x, y, fromX, fromY, vector, Number(node)+1);
              const lineTo = {
                x: x - nodes_radius,
                y: y + nodes_radius
              };
              const lineFrom = {
                x: fromX,
                y: fromY
              }
              drawLine(ctx, lineFrom, lineTo);
              fromX = lineTo.x;
              fromY = lineTo.y;
            }
          }
        }

        drawArrow(ctx, fromX, fromY, toX, toY);
      }
    }
  }
}

const graphs = () => {
  showPlot(plot_x, plot_y);
  const ctx = getContext();

  generateCoords(nodes_radius, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);

  drawNodes(ctx, nodes_radius);

  drawNumbers(ctx, nodes_radius, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);

  drawArrows(ctx);

}


document.addEventListener("DOMContentLoaded", graphs);
