import { toggleWindow } from "ags/app";
import { Astal } from "ags/gtk4";
import Hyprland from "gi://AstalHyprland"
import { onCleanup } from "gnim";

const hyprland = Hyprland.get_default();
let openWindow: string = "";

export function togglePopup(name: string) {
    const monitor = hyprland.monitors.find((monitor) => monitor.focused == true);
    if (!monitor) {
        return;
    }

    const mon = monitor.id;

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

export const closer = (monitor: number): JSX.Element =>
    <window
        visible={false}
        layer={Astal.Layer.TOP}
        anchor={Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.TOP}
        monitor={monitor}
        name={"windowCloser" + monitor}
        class={"windowCloser"}
        $={(self) => onCleanup(() => self.destroy())}
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
