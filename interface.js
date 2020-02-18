'use strict';

let isMenuShowed = false;

const showMenu = () => {
  isMenuShowed = !isMenuShowed;
  if(isMenuShowed){
    const width = document.getElementById('scrollable').offsetWidth;
    const height = document.getElementById('scrollable').offsetHeight;

    document.getElementById('menu-panel').style.width = `${width}px`;
    document.getElementById('menu-panel').style.height = `${height}px`;
    document.getElementById('menu-panel').style.display = "inherit";
  } else {
    document.getElementById('menu-panel').style.display = "none";
  }
}
