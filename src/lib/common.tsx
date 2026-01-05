import { toggleWindow } from "ags/app";
import { Astal } from "ags/gtk4";
import app from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland"

const hyprland = Hyprland.get_default();
const monitors: number[] = [];
let openWindow: string = "";

export function togglePopup(name: string) {
    let mon = 0;
    hyprland.monitors.forEach((monitor) => {
        if (monitor.focused == true) {
            mon = monitors.indexOf(monitor.id);
        }
    });

    if (openWindow != "" && openWindow == name + mon) {
        toggleWindow("ags", "windowCloser" + mon)
        toggleWindow("ags", openWindow)
        openWindow = "";
    } else if (openWindow != "") {
        toggleWindow("ags", openWindow)
        toggleWindow("ags", name + mon)
        openWindow = name + mon;
    } else {
        toggleWindow("ags", "windowCloser" + mon)
        toggleWindow("ags", name + mon)
        openWindow = name + mon;
    }
};

export function populateMon(population) {
    hyprland.monitors.forEach((mon) => {
        monitors.push(mon.id);
        population.forEach((win) => app.add_window(win(monitors.length - 1)));
    });
}


export function refreshMon(population) {
    monitors.length = 0;
    app.windows.forEach((window) => {
        app.remove_window(window);
    });
    populateMon(population);
}

export const closer = (monitor: number): JSX.Element =>
    <window
        visible={false}
        layer={Astal.Layer.TOP}
        anchor={Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.TOP}
        monitor={monitor}
        name={"windowCloser" + monitor}
        class={"windowCloser"}
    >
        <button
            onClicked={() => {
                if (openWindow) {
                    toggleWindow("ags", openWindow);
                    openWindow = "";
                }
                toggleWindow("ags", "windowCloser" + monitor);
            }}
        />
    </window>



