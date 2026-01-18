import { exec } from "ags/process";
import { Gdk, Gtk } from "ags/gtk4";
import { Accessor } from "gnim";
import { Popup } from "./Popup";
import { hideAll } from "../lib/common";


const pmenu = (monitor: Gdk.Monitor, name: string, align: Gtk.Align) => {
    return <Popup
        name={name}
        gdkmonitor={monitor}
        halign={align}
        margin_end={align == Gtk.Align.CENTER ? 0 : 10}
        cssClasses={["powermenuWindow"]}
        orientation={Gtk.Orientation.HORIZONTAL}
        width={340}
    >
        <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} hexpand={true}>
            <button onClicked={() => { exec(`bash -c "loginctl lock-session"`); hideAll(); }}>
                <image iconName={"system-lock-screen-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "systemctl suspend"`); hideAll(); }}>
                <image iconName={"media-playback-pause-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "reboot"`); hideAll(); }}>
                <image iconName={"system-reboot-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "loginctl terminate-user $USER"`); hideAll(); }}>
                <image iconName={"system-log-out-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "shutdown -h now"`); hideAll(); }}>
                <image iconName={"system-shutdown-symbolic"} />
            </button>
        </box>
    </Popup >
}

export const powermenuWindow = (monitor: Gdk.Monitor) => pmenu(monitor, "powermenuWindow", Gtk.Align.CENTER);
export const powermenuRightWindow = (monitor: Gdk.Monitor) => pmenu(monitor, "powermenuRightWindow", Gtk.Align.END);

