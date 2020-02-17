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
  const canvas = Canvas(canvId);
  const context = canvas.context('2d');

  const graph1 = Graph(matrixOrientired, context);

  graph1.generateCoords();
  canvas.setSize(graph1.getSize());
  graph1.orientired(true)
        .context(context)
        .draw();

}


document.addEventListener("DOMContentLoaded", drawGraphs);
