import app from "ags/gtk4/app"
import style from "./src/style/default.scss"
import { bar } from "./src/bar/main";
import { bluetoothWindow } from "./src/widget/bluetoothWindow";
import Hyprland from "gi://AstalHyprland"
import { togglePopup } from "./src/lib/common";
import { soundWindow } from "./src/widget/soundWindow";
import { networkWindow } from "./src/widget/networkWindow";
import { powerWindow } from "./src/widget/powerWindow";
import { powermenuRightWindow, powermenuWindow } from "./src/widget/powermenuWindow";
import { controlcenterWindow } from "./src/widget/controlcenterWindow";
import { For, This, createBinding } from "gnim";

function main() {
    < For each={createBinding(Hyprland.get_default(), "monitors")} >
        {(monitor: Hyprland.Monitor) => {
            return (
                <This this={app} >
                    {bar(monitor.id)}
                    {bluetoothWindow(monitor.id)}
                    {soundWindow(monitor.id)}
                    {networkWindow(monitor.id)}
                    {powerWindow(monitor.id)}
                    {powermenuWindow(monitor.id)}
                    {powermenuRightWindow(monitor.id)}
                    {controlcenterWindow(monitor.id)}
                </This>
            )
        }
        }
    </For >
}

app.start({
    css: style, main,
    requestHandler(argv: string[], res: (response: string) => void) {
        const [cmd, arg, ...rest] = argv;
        if (cmd == "togglePopup") {
            togglePopup(arg);
            res("sucess");
        }
        res("unknown command")
    }
})
