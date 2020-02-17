'use strict';

const Canvas = (canvasId) => {
  const canvas = {
    domElem: document.getElementById(canvasId)
  };

  canvas.setSize = function (size) {
    this.domElem.setAttribute("width", `${size.x}px`);
    this.domElem.setAttribute("height", `${size.y}px`);
    return this;
  }

  canvas.context = function (ctx) {
    return this.domElem.getContext(ctx);
  }


  return canvas;
}
