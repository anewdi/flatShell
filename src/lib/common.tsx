import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { currentMon } from "../../app";

const openWindow: Gtk.Window[] = [];

export function hideAll() {
    openWindow.forEach(w => w.hide());
    openWindow.length = 0;
}

// hide all and show only popup
export function togglePopup(name: string) {
    const newWindow: Gtk.Window | undefined = app.get_window(name);

    if (newWindow) {
        openWindow.forEach((w: Gtk.Window) => w.hide());

        if (openWindow.includes(newWindow) && newWindow.visible) {
            openWindow.length = 0;
        } else {
            openWindow.length = 0;
            newWindow.show();
            openWindow.push(newWindow);
        }
    }
};

// hide all and show all 
export function toggleAll(name: string) {
    let num = currentMon;

    for (let i = num; i >= 0; i--) {
        if (openWindow[0] && openWindow[0].name == name + i) {
            hideAll();
            return;
        }
    }

    hideAll();

    app.get_monitors().forEach(() => {
        const newWindow: Gtk.Window | undefined = app.get_window(name + num);
        if (newWindow) {
            newWindow.show();
            openWindow.push(newWindow);
        }
        num--;
    })
}

