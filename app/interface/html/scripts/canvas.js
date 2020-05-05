'use strict';

class Canvas {
    constructor(canvasId) {
        this.domElem = document.getElementById(canvasId);
        this.ctx = this.domElem.getContext('2d');
    }

    setSize(size) {
        this.domElem.setAttribute("width", `${size.x}px`);
        this.domElem.setAttribute("height", `${size.y}px`);
        return this;
    }
    
    clear(ctx) {
        this.domElem.getContext(ctx).clearRect(0, 0, this.domElem.width, this.domElem.height);
        return this;
    }

    begin() {
        this.ctx.beginPath();
    }

    end(option) {
        switch (option) {
            case 'stroke':
                this.ctx.stroke();
                break;
            case 'fill':
                this.ctx.fill();
                break;
        }
    }

    node(x, y, radius, color) {
        this.begin();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.end('fill');

        // border
        this.begin();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.end('stroke');
    }

    lable(x, y, n) {
        this.ctx.font = '12px serif';
        this.ctx.fillStyle = "black";
        this.ctx.fillText(n, x, y);
    }

    line(from, to) {
        this.begin();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }

    arrow(from, to) {
        const fx = from.x,
            fy = from.y,
            tx = to.x,
            ty = to.y;
        const headlen = 10; // длина в px "головы" стрелки
        const dx = tx - fx;
        const dy = ty - fy;
        const angle = Math.atan2(dy, dx);
        this.begin();
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }
}
