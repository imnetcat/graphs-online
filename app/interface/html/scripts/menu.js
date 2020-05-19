'use strict';

class Menu {
    constructor(id) {
        this.id = id;
        this.menu = DOM.getById(id);
    }

    Show() {
        this.element.show();
    }
    Hide() {
        this.element.hide();
    }
};

