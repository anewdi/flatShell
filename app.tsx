import app from "ags/gtk4/app"
import style from "./src/style/default.scss"
import { bar } from "./src/bar/main";
import { bluetoothWindow } from "./src/widget/bluetoothWindow";
import { togglePopup } from "./src/lib/common";
import { soundWindow } from "./src/widget/soundWindow";
import { networkWindow } from "./src/widget/networkWindow";
import { powerWindow } from "./src/widget/powerWindow";
import { powermenuRightWindow, powermenuWindow } from "./src/widget/powermenuWindow";
import { controlcenterWindow } from "./src/widget/controlcenterWindow";
import { For, This, createBinding } from "gnim";
import { volumeOverlay } from "./src/widget/volumeOverlay";
import { notificationOverlay } from "./src/widget/notificationOverlay";
import { Gdk } from "ags/gtk4";

export let currentMon = 3;

function main() {
    < For each={createBinding(app, "monitors")} >
        {(monitor: Gdk.Monitor) => {
            currentMon++;
            return <This this={app} >
                {bar(monitor)}
                {bluetoothWindow(monitor)}
                {soundWindow(monitor)}
                {networkWindow(monitor)}
                {powerWindow(monitor)}
                {powermenuWindow(monitor)}
                {powermenuRightWindow(monitor)}
                {controlcenterWindow(monitor)}
                {volumeOverlay(monitor)}
                {notificationOverlay(monitor)}
            </This>
        }}
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
