'use strict';

const SetUpPaletes = () => {
    const paletes = [];
    paletes.push(new Palete('background', Settings.background.color, Settings.SetBackgroundColor));
    paletes.push(new Palete('vertex', Settings.vertex.color, Settings.SetVertexColor));
    paletes.push(new Palete('lines_color', Settings.ribs.color, Settings.SetRibsColor));
    paletes.push(new Palete('vertex_label', Settings.vertex.label.color, Settings.SetVertexLabelColor));
    paletes.push(new Palete('ribs_label', Settings.ribs.label.color, Settings.SetRibsLabelColor));

    // инициализируем все палитры
    ColorPalete.Init(paletes);
    // по умолчанию закрываем первую палитру
    ColorPalete.Close('background');
    ColorPalete.Close('vertex');
    ColorPalete.Close('lines_color');
    ColorPalete.Close('vertex_label');
    ColorPalete.Close('ribs_label');
}

// настраиваем интерфейс по дефолтным значениям после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    // инициализируем цветовые палитры
    SetUpPaletes();

	// добавляем все меню
	Interface.menus.push(new Menu('settings'));
	Interface.menus.push(new Menu('properties'));
	Interface.menus.push(new Menu('algorithms'));
	Interface.menus.push(new Menu('definition'));

	// устанавливаем меню видимое по умолчанию
	Interface.Show('definition');

	// загружаем пример графа
	Interface.refreshCanvas();
});

