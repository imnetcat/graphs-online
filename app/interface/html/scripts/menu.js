'use strict';

class Menu {
    constructor(id) {
        this.id = id;
        this.menu = DOM.GetById(id);
    }

    Show() {
        this.menu.show();
    }
    Hide() {
        this.menu.hide();
    }



};

