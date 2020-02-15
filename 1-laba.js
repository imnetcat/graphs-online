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

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

const getMatrix = (nodes, n1, n2, n3, n4) => {
	const n1_str = n1.toString();
	const n2_str = n2.toString();
	const n3_str = n3.toString();
	const n4_str = n4.toString();
	const n = n1_str + n2_str + n3_str + n4_str;
  Math.seedrandom(n);
	const T = getRandomInt(nodes, nodes) + getRandomInt(nodes, nodes);
	const matrix = Math.floor((1.0 - n3*0.02 - n4*0.005 - 0.25)*T);
  return matrix;
}

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
    };
    options[option]();
}

const drawNode = (ctx, x, y, radius) => {
    beginDrawing(ctx);
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    endDrawing(ctx, 'stroke');
}

const drawNodes = (ctx, radius, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset) => {

  drawNode(ctx, (plot_x/2), plot_y_offfset, radius, 0, 2*Math.PI);

  drawNode(ctx, (plot_x/2)-nodes_spacing, plot_y_offfset*3, radius, 0, 2*Math.PI);
  drawNode(ctx, (plot_x/2)+nodes_spacing, plot_y_offfset*3, radius, 0, 2*Math.PI);

  drawNode(ctx, (plot_x/2), plot_y_offfset*5, radius, 0, 2*Math.PI);
  drawNode(ctx, (plot_x/2)+plot_y_offfset*2, plot_y_offfset*5, radius, 0, 2*Math.PI);
  drawNode(ctx, (plot_x/2)-plot_y_offfset*2, plot_y_offfset*5, radius, 0, 2*Math.PI);

  drawNode(ctx, (plot_x/2)-plot_y_offfset*3, plot_y_offfset*7, radius, 0, 2*Math.PI);
  drawNode(ctx, (plot_x/2)-nodes_spacing, plot_y_offfset*7, radius, 0, 2*Math.PI);
  drawNode(ctx, (plot_x/2)+nodes_spacing, plot_y_offfset*7, radius, 0, 2*Math.PI);
  drawNode(ctx, (plot_x/2)+plot_y_offfset*3, plot_y_offfset*7, radius, 0, 2*Math.PI);
}


const drawNumbers = (ctx, nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset) => {
    xnumb((plot_x/2)+plot_x_offfset+nodes_diameter/2.5, plot_y-nodes_diameter/1.5, 1);

    xnumb((plot_x/2)-nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*2-nodes_diameter/1.5, 2);
    xnumb((plot_x/2)+nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*2-nodes_diameter/1.5, 3);

    xnumb((plot_x/2)+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*4-nodes_diameter/1.5, 4);
    xnumb((plot_x/2)+plot_y_offfset*2+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*4-nodes_diameter/1.5, 5);
    xnumb((plot_x/2)-plot_y_offfset*2+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*4-nodes_diameter/1.5, 6);

    xnumb((plot_x/2)-plot_y_offfset*3+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*6-nodes_diameter/1.5, 7);
    xnumb((plot_x/2)-nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*6-nodes_diameter/1.5, 8);
    xnumb((plot_x/2)+nodes_spacing+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*6-nodes_diameter/1.5, 9);
    xnumb((plot_x/2)+plot_y_offfset*3+plot_x_offfset+nodes_diameter/2.5, plot_y-plot_y_offfset*6-nodes_diameter/1.5, 10);
}

const drawArrows = (ctx, nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset) => {
  //  xarrows([(plot_x/2)+nodes_spacing+plot_x_offfset;(plot_x/2)+plot_x_offfset], [(plot_x/2)+plot_x_offfset;plot_y-plot_y_offfset*1.5], 50, 1);
}

const graphs = () => {
  showPlot(plot_x, plot_y);
  const ctx = getContext();

  beginDrawing(ctx);
  drawNodes(ctx, nodes_radius, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);
  endDrawing(ctx, 'stroke');
/*
  beginDrawing(ctx);
  drawNumbers(ctx, nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);
  endDrawing(ctx, 'stroke');

  drawArrows(ctx, nodes_diameter, nodes_spacing, plot_x, plot_y, plot_x_offfset, plot_y_offfset);
*/
}


document.addEventListener("DOMContentLoaded", graphs);
