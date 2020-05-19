'use strict';

class DOM {
    static wrapTable(tableElement) {
        tableElement.delRow = function(index) {
            this.getElementsByTagName('tr').deleteRow(index);
        }
        tableElement.delAllRows = function(from) {
            for (let i = from; i < this.getElementsByTagName('tr').length; i) {
                this.deleteRow(from);
            }
        }
        tableElement.row = function (index) {
            return DOM.wrap(this.getElementsByTagName('tr')[index]);
        }
        tableElement.delRows = function(from, count) {
            for (let i = 0; i < count; i++) {
                this.delRow(from);
            }
        }
        tableElement.addRow = function(index) {
            return DOM.wrap(this.insertRow(index));
        }
    }
    static wrapRow(rowElement) {
        rowElement.addCell = function(index) {
            return DOM.wrap(this.insertCell(index));
        }
    }

    static wrap(domElement) {
        domElement.show = function() {
            this.hidden = false;
        }
        domElement.hide = function() {
            this.hidden = true;
        }
        domElement.setHTML = function(html) {
            this.innerHTML = html;
        }
        domElement.addHTML = function(html) {
            this.innerHTML += html;
        }
        domElement.setText = function(text) {
            this.innerText = text;
        }
        domElement.addText = function(text) {
            this.innerText += text;
        }
        if (domElement.tagName === "TR") {
            DOM.wrapRow(domElement)
        }
        if (domElement.tagName === "TABLE") {
            DOM.wrapTable(domElement)
        }
        return domElement;
    }

    static wrapCollection(domElements) {
        for (let element of domElements) {
            element = DOM.wrap(element);
        }
        return domElements;
    }

    static getById(id) {
        return DOM.wrap(document.getElementById(id));
    }
    static getBySelector(query) {
        return DOM.wrap(document.querySelector(query));
    }
    static getByTag(tag) {
        return DOM.wrapCollection(document.getElementsByTagName(tag));
    }
};

