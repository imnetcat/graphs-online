'use strict';

class Settings {

    static vertex = {
        color: "#ffffff",
        radius: 20,
        spacing: 2,
        label: {
            size: 12,
            color: "#000000"
        }
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
    static SetVertexLabelColor(newColor) {
        Settings.vertex.label.color = newColor;
    }
    static SetVertexLabelSize(newSize) {
        Settings.vertex.label.size = newSize;
    }

    static ribs = {
        color: "#000000",
        width: 1,
        label: {
            size: 12,
            color: "#000000"
        }
    }
    static SetRibsColor(newColor) {
        Settings.ribs.color = newColor;
    }
    static SetRibsWidth(newWidth) {
        Settings.ribs.width = newWidth;
    }
    static SetRibsLabelColor(newColor) {
        Settings.ribs.label.color = newColor;
    }
    static SetRibsLabelSize(newSize) {
        Settings.ribs.label.size = newSize;
    }


    static background = {
        color: "#ffffff"
    }
    
    static SetBackgroundColor(newColor) {
        Settings.background.color = newColor;
    }
};

