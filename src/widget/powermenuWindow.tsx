import { exec } from "ags/process";
import { Gtk } from "ags/gtk4";
import { Accessor } from "gnim";
import { togglePopup } from "../lib/common";
import { Popup } from "./components/Popup";

const pmenu = (monitor: number, name: string, align: Gtk.Align) =>
    <Popup
        name={name}
        monitor={monitor}
        halign={align}
        overrideClass="powermenuWindow"
        orientation={Gtk.Orientation.HORIZONTAL}
        forceWidth={false}
    >
        <button onClicked={() => { exec(`bash -c "loginctl lock-session"`); togglePopup(name) }}>
            <image iconName={"system-lock-screen-symbolic"} />
        </button>
        <button onClicked={() => { exec(`bash -c "systemctl suspend"`); togglePopup(name) }}>
            <image iconName={"media-playback-pause-symbolic"} />
        </button>
        <button onClicked={() => { exec(`bash -c "reboot"`); togglePopup(name) }}>
            <image iconName={"system-reboot-symbolic"} />
        </button>
        <button onClicked={() => { exec(`bash -c "loginctl terminate-user $USER"`); togglePopup(name) }}>
            <image iconName={"system-log-out-symbolic"} />
        </button>
        <button onClicked={() => { exec(`bash -c "shutdown -h now"`); togglePopup(name) }}>
            <image iconName={"system-shutdown-symbolic"} />
        </button>
    </Popup>

export const powermenuWindow = (monitor: number = 0) => {
    return pmenu(monitor, "powermenuWindow", Gtk.Align.CENTER);
}

export const powermenuRightWindow = (monitor: number = 0) => {
    return pmenu(monitor, "powermenuRightWindow", Gtk.Align.END);
}

