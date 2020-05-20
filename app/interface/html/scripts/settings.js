'use strict';

class Settings {

    static vertex = {

        color: {
            default: "#ffffff",
            active: "#e43434",
            visited: "#8598df"
        },
        radius: 25,
        spacing: 4,
        label: {
            size: 20,
            color: "#ffa300"
        },
        num: {
            size: 20,
            color: "#000000"
        }
    }
    
    static SetVertexBorderColor(newColor) {
        Settings.vertex.border.color = newColor;
    }
    static SetVertexDefaultColor(newColor) {
        Settings.vertex.color.default = newColor;
    }
    static SetVertexActiveColor(newColor) {
        Settings.vertex.color.active = newColor;
    }
    static SetVertexNumSize(newSize) {
        Settings.vertex.num.size = newSize;
    }
    static SetVertexNumColor(newColor) {
        Settings.vertex.num.color = newColor;
    }
    static SetVertexVisitedColor(newColor) {
        Settings.vertex.color.visited = newColor;
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
        width: 2,
        label: {
            size: 20,
            color: "#ffffff"
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
        color: "#78777a"
    }
    
    static SetBackgroundColor(newColor) {
        Settings.background.color = newColor;
    }
};

