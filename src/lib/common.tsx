import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

let openWindow: Gtk.Window | undefined;

export function togglePopup(name: string) {
    const newWindow: Gtk.Window | undefined = app.get_window(name);

    if (newWindow) {
        if (openWindow == newWindow) {
            openWindow.visible ? openWindow.hide() : openWindow.show();
            return;
        } else {
            if (openWindow) {
                openWindow.hide();
            }
            newWindow.show();
            openWindow = newWindow;
        }
    }
};

