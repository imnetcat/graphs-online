'use strict';

// класс описывающий вершину графа
class Vertex {
    constructor(id, coords, w) {
        this._id = id;
        this._coords = { x: coords.x, y: coords.y };
        this._wieght = w;
    }

    get coords() {
        return this._coords;
    }
    set coords(c) {
        this._coords.x = c.x;
        this._coords.y = c.y;
        return this;
    }

    get id() {
        return this._id;
    }

    get wieght() {
        return this._wieght;
    }
    set wieght(w) {
        this._wieght = w;
        return this;
    }
};
