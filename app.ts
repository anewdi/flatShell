import app from "ags/gtk4/app"
import style from "./src/style/default.scss"
import { bar } from "./src/bar/main";
import { bluetoothWindow } from "./src/widget/bluetoothWindow";
import Hyprland from "gi://AstalHyprland"
import { closer, populateMon, refreshMon, togglePopup } from "./src/lib/common";
import { soundWindow } from "./src/widget/soundWindow";
import { networkWindow } from "./src/widget/networkWindow";
import { powerWindow } from "./src/widget/powerWindow";
import { powermenuRightWindow, powermenuWindow } from "./src/widget/powermenuWindow";
import { controlcenterWindow } from "./src/widget/controlcenterWindow";

const hyprland = Hyprland.get_default();

const windows = [
    bar,
    bluetoothWindow,
    soundWindow,
    networkWindow,
    powerWindow,
    powermenuWindow,
    powermenuRightWindow,
    controlcenterWindow,
    closer,
];

hyprland.connect("monitor-added", () => refreshMon(windows));
hyprland.connect("monitor-removed", () => refreshMon(windows));

app.start({
    css: style, main() { populateMon(windows); },
    requestHandler(argv: string[], res: (response: string) => void) {
        const [cmd, arg, ...rest] = argv;
        if (cmd == "togglePopup") {
            togglePopup(arg);
            res("sucess");
        }
        res("unknown command")
    }
})
