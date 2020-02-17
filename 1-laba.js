'use strict';

const matrixOrientired = [
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

const matrixNonOrientired = [
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

const drawGraphs = () => {
  const canvId = "canv";

  const graph1 = Graph(matrixOrientired, { orientired: true });
  const graph2 = Graph(matrixNonOrientired, { orientired: false });

  const canvasSize = graph1.getPlotSize();
  const canvas = document.getElementById(canvId);
  canvas.setAttribute("width", `${canvasSize.x}px`);
  canvas.setAttribute("height", `${canvasSize.y}px`);

  graph1.context("canv")
        .generateCoords()
        .draw();

}


document.addEventListener("DOMContentLoaded", drawGraphs);
