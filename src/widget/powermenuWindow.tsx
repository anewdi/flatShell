import { exec } from "ags/process";
import { Gdk, Gtk } from "ags/gtk4";
import { Accessor } from "gnim";
import { Popup } from "./components/Popup";


const pmenu = (monitor: Gdk.Monitor, name: string, align: Gtk.Align) => {
    let widget: Gtk.Window;
    return <Popup
        name={name}
        gdkmonitor={monitor}
        halign={align}
        margin_end={align == Gtk.Align.CENTER ? 0 : 10}
        cssClasses={["powermenuWindow"]}
        orientation={Gtk.Orientation.HORIZONTAL}
        width={360}
        $={(self) => widget = self}
    >
        <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} hexpand={true}>
            <button onClicked={() => { exec(`bash -c "loginctl lock-session"`); widget.hide() }}>
                <image iconName={"system-lock-screen-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "systemctl suspend"`); widget.hide() }}>
                <image iconName={"media-playback-pause-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "reboot"`); widget.hide() }}>
                <image iconName={"system-reboot-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "loginctl terminate-user $USER"`); widget.hide() }}>
                <image iconName={"system-log-out-symbolic"} />
            </button>
            <button onClicked={() => { exec(`bash -c "shutdown -h now"`); widget.hide() }}>
                <image iconName={"system-shutdown-symbolic"} />
            </button>
        </box>
    </Popup >
}

export const powermenuWindow = (monitor: Gdk.Monitor) => pmenu(monitor, "powermenuWindow", Gtk.Align.CENTER);
export const powermenuRightWindow = (monitor: Gdk.Monitor) => pmenu(monitor, "powermenuRightWindow", Gtk.Align.END);

