import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland"

const hyprland = Hyprland.get_default();
let openWindow: Gtk.Window | undefined;

export function togglePopup(name: string) {
    const monitor = hyprland.monitors.find((monitor) => monitor.focused == true);
    if (!monitor) {
        return;
    }
    const mon = monitor.id;
    const newWindow: Gtk.Window | undefined = app.get_window(name + mon);

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

