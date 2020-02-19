'use strict';

let isMenuShowed = false;

const drawGraphs = (matrix, options) => {
  const canvId = "canv";
  const canvas = Canvas(canvId).clear('2d');
  const context = canvas.context('2d');

  const graph1 = Graph(matrix, context);

  graph1.generateCoords();
  canvas.setSize(graph1.getSize());
  graph1.orientired(options.orientired)
        .context(context)
        .draw();
}

const showMenu = () => {
  isMenuShowed = !isMenuShowed;
  if(isMenuShowed){
    const width = document.getElementById('scrollable').offsetWidth;
    const height = document.getElementById('scrollable').offsetHeight;

    document.getElementById('menu-panel').style.width = `${width-30}px`;
    document.getElementById('menu-panel').style.height = `${height-30}px`;
    document.getElementById('menu-panel').style.display = "inherit";
  } else {
    document.getElementById('menu-panel').style.display = "none";
  }
}

const refreshCanvas = () => {
  const form = new FormData(document.forms.menu);
  const matrixStr = document.getElementById('matrix-input').value.split('\n');

  const matrix = [];
  for(const row of matrixStr){
    matrix.push([]);
    const elems = row.split(' ');
    for(const elem of elems){
      matrix[matrix.length-1].push(Number(elem));
    }
  }

  const orientired = form.get('orientired');

  const options = {
    orientired: orientired === 'on' ? true : false
  };

  drawGraphs(matrix, options);
}

document.addEventListener('DOMContentLoaded', refreshCanvas)
