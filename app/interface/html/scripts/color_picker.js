'use strict';

// обьект хранящий информацию об одной палитре
class Palete {
    constructor(n, d, c) {
        this.name = n;
        this.color = d;
        this.unsubmit = d;
        this.form = document.forms[n];
        // колбек вызывается при изменении цвета данной палитры
        this.callback = c;
    }

    GetColor() {
        return this.color;
    }

    GetUnsubmitColor() {
        return this.unsubmit;
    }

    SetColor(newColor) {
        this.color = newColor;
        this.callback(this.color);
    }

    SetUnsubmitColor(newColor) {
        this.unsubmit = newColor;
    }

    SubmitChanges() {
        this.SetColor(this.GetUnsubmitColor());
    }

    CancelChanges() {
        this.SetUnsubmitColor(this.GetColor());
    }
}

// обработчик палитр
class ColorPalete {

    // все палитры
    static paletes = [];

    // обработчик для текущих цветов
    static ChangesHandler(hex, hsv, rgb, palete) {
        palete.form.querySelector('.hex').innerHTML = hex;
        // для получения rgb
        //document.getElementById('rgb').innerHTML = 'rgb(' + rgb.r.toFixed() + ',' + rgb.g.toFixed() + ',' + rgb.b.toFixed() + ')';
        // для получения hsv
        //document.getElementById('hsv').innerHTML = 'hsv(' + hsv.h.toFixed() + ',' + hsv.s.toFixed(2) + ',' + hsv.v.toFixed(2) + ')';

        palete.form.querySelectorAll('.color-values')[0].style.backgroundColor = hex;
        palete.form.querySelectorAll('.color-values')[1].style.backgroundColor = hex;
        palete.unsubmit = hex;
    }

    // движок для обработки изменений палитры по клику
    // DO NOT CHANGE
    static PickerHandler(mousePicker, mousepcr, palete) {
        ColorPicker.positionIndicators(
            palete.form.querySelector('.pcr-wrapper > .pcr-indicator'),
            palete.form.querySelector('.picker-wrapper > .picker-indicator'),
            mousepcr, mousePicker);
    }

    static Init(paletes) {
        ColorPalete.paletes = paletes;
        for (const palete of ColorPalete.paletes) {

            const cp = ColorPicker(palete.form.querySelector('.pcr-wrapper > .pcr'), 
                palete.form.querySelector('.picker-wrapper > .picker'),
                (hex, hsv, rgb, mousePicker, mousepcr) => {
                    ColorPalete.PickerHandler(mousePicker, mousepcr, palete);
                    ColorPalete.ChangesHandler(hex, hsv, rgb, palete);
                });

            palete.form.querySelector('.submit-btn').addEventListener('click', (event) => {
                event.preventDefault();
                palete.SubmitChanges();
                cp.setHex(palete.color);
                ColorPalete.Close(palete.name);
            });
            palete.form.querySelector('.cancel-btn').addEventListener('click', (event) => {
                event.preventDefault();
                palete.CancelChanges();
                cp.setHex(palete.color);
                ColorPalete.Close(palete.name);
                palete.form.querySelectorAll('.color-values')[0].style.backgroundColor = palete.color;
                palete.form.querySelectorAll('.color-values')[1].style.backgroundColor = palete.color;
            });
            palete.form.querySelector('.pick-lable').addEventListener('click', (event) => {
                ColorPalete.Open(palete.name);
            });
            cp.setHex(palete.color);
        }
    }
    
    static GetPalete(name) {
        for (const palete of ColorPalete.paletes) {
            if (palete.name === name)
                return palete;
        }
    }

    // меняет цвет 
    static ChangeColor(name, color) {
        ColorPalete.GetPalete(name).SetUnsubmitColor(color);
    }
    
    // подтверждает изменения данной палитры
    static SubmitPalete(name) {
        ColorPalete.GetPalete(name).SubmitChanges();
    }

    // отменяет изменения данной палитры
    static CancelChanges(name) {
        ColorPalete.GetPalete(name).CancelChanges();
    }

    // открывает форму палитры
    static Open(name) {
        document.forms[name].querySelector('.pick-lable').hidden = true;
        document.forms[name].querySelector('.kat').style.marginTop = "0";
        document.forms[name].style.height = "250px";
    }

    // закрывает форму палитры
    static Close(name) {
        document.forms[name].querySelector('.pick-lable').hidden = false;
        document.forms[name].querySelector('.kat').style.marginTop = "-25000px";
        document.forms[name].style.height = "50px";
    }
};
