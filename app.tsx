import app from "ags/gtk4/app"
import style from "./src/style/default.scss"
import { bar } from "./src/bar/main";
import { bluetoothWindow } from "./src/popup/bluetoothWindow";
import { toggleAll } from "./src/lib/common";
import { soundWindow } from "./src/popup/soundWindow";
import { networkWindow } from "./src/popup/networkWindow";
import { powerWindow } from "./src/popup/powerWindow";
import { powermenuRightWindow, powermenuWindow } from "./src/popup/powermenuWindow";
import { controlcenterWindow } from "./src/popup/controlcenter/controlcenterWindow";
import { For, This, createBinding } from "gnim";
import { volumeOverlay } from "./src/overlay/volumeOverlay";
import { notificationOverlay } from "./src/overlay/notificationOverlay";
import { Gdk } from "ags/gtk4";

// is saved throughout to know which monitor they windows are instantiated on
// then they can toggle exact widgets on same monitor
export let currentMon = -1;

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
        if (cmd == "toggleAll") {
            toggleAll(arg);
            res("sucess");
        }
        res("unknown command")
    }
})
