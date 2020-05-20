'use strict';

class Settings {

    static vertex = {
        color: "#ffffff",
        radius: 20,
        spacing: 2
    }
    
    static SetVertexBorderColor(newColor) {
        Settings.vertex.border.color = newColor;
    }
    static SetVertexColor(newColor) {
        Settings.vertex.color = newColor;
    }
    static SetVertexRadius(r) {
        Settings.vertex.radius = r;
    }
    static SetVertexSpacing(s) {
        Settings.vertex.spacing = s;
    }

    static ribs = {
        color: "#000000",
        width: 1
    }
    static SetRibsColor(newColor) {
        Settings.ribs.color = newColor;
    }
    static SetRibsWidth(newWidth) {
        Settings.ribs.width = newWidth;
    }


    static background = {
        color: "#ffffff"
    }
    
    static SetBackgroundColor(newColor) {
        Settings.background.color = newColor;
    }
};

