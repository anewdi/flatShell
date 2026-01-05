import { exec } from "ags/process";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import { Accessor } from "gnim";
import { togglePopup } from "../lib/common";


const pmenu = (monitor: number, name: string, anchor?: Accessor<NonNullable<Astal.WindowAnchor | undefined>> | Astal.WindowAnchor | undefined) =>
    <window
        margin={7}
        name={name + monitor}
        keymode={Astal.Keymode.ON_DEMAND}
        anchor={anchor}
        class={"powermenu"}
    >
        <Gtk.EventControllerKey onKeyPressed={({ widget }, keyval: number) => {
            if (keyval == Gdk.KEY_Escape) {
                togglePopup(name);
            }
        }} />
        <box spacing={8}>
            <button onClicked={() => { exec(`bash -c "loginctl lock-session"`); }}>
                <image iconName={"system-lock-screen-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "systemctl suspend"`); }}>
                <image iconName={"media-playback-pause-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "reboot"`); }}>
                <image iconName={"system-reboot-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "loginctl terminate-user $USER"`); }}>
                <image iconName={"system-log-out-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "shutdown -h now"`); }}>
                <image iconName={"system-shutdown-symbolic"} />
            </button>
        </box>

    </window>

export const powermenuWindow = (monitor: number = 0) => {
    return pmenu(monitor, "powermenuWindow", Astal.WindowAnchor.TOP);
}

export const powermenuRightWindow = (monitor: number = 0) => {
    return pmenu(monitor, "powermenuRightWindow", Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT);
}

