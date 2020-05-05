'use strict';

// класс описывающий ребро графа
class Rib {
    constructor(id, lines, w) {
        this._id = id;
        this._lines = lines;
        this._wieght = w;
    }

    get lines() {
        return this._lines;
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
