'use strict';

// Класс который рисует на канвасе
class Draw {
    constructor(ctx) {
        this.ctx = ctx;
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
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
    }
    arrow(from, to) {
        const fx = from.x,
            fy = from.y,
            tx = to.x,
            ty = to.y;
        const headlen = 10; // length of head in pixels
        const dx = tx - fx;
        const dy = ty - fy;
        const angle = Math.atan2(dy, dx);
        this.ctx.beginPath();
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(tx, ty);
        this.ctx.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }
};
