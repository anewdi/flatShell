import { Astal, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import Wp from "gi://AstalWp";
import { Accessor, createBinding, For, onCleanup } from "gnim";
import { volumeSlider } from "./components/volumeSlider";
import { Separator } from "./components/separator";
import Pango from "gi://Pango?version=1.0";
import Adw from "gi://Adw?version=1";
import { Popup } from "./components/Popup";

const wp = Wp.get_default();

const speakerButton = (endpoint: Wp.Endpoint): JSX.Element => {
    const device = endpoint.get_device();
    if (device == null) {
        return <box></box>;
    }
    const iconname = device.icon.split("-");
    const iconstring = iconname[0] + "-" + iconname[1] + "-symbolic";
    const active = createBinding(endpoint, "is_default");

    return <button
        class={active(b => b ? "activeButton" : "")}
        onClicked={() => endpoint.set_is_default(true)}
    >
        <box spacing={8}>
            <box halign={Gtk.Align.START} spacing={8}>
                <image iconName={iconstring} />
                <label ellipsize={Pango.EllipsizeMode.END} label={device.description} />
            </box>
            <stack halign={Gtk.Align.END} hexpand={true}>
                <label label={createBinding(endpoint, "volume")((v) => Math.round(v * 100) + "%")} />
            </stack>
        </box >
    </button >;
};

const speakers = createBinding(wp.audio, "speakers")(speakers => speakers.filter(speaker => speaker.get_device()));

export const soundWindow = (monitor: number = 0): JSX.Element =>
    <Popup
        name={"soundWindow"}
        monitor={monitor}
        margin_end={50}
        halign={Gtk.Align.END}
    >
        <centerbox class={"header"}>
            <label $type="start" label="Sound" />
            <box $type="end">
                <button
                    onClicked={() => {
                        execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center sound");
                    }}>
                    <image iconName={"applications-system-symbolic"} />
                </button>
            </box>
        </centerbox>
        {volumeSlider()}
        <Separator />
        <box orientation={Gtk.Orientation.VERTICAL} class={"body"}>
            <For each={speakers}>
                {(item, _) => speakerButton(item)}
            </For>
        </box>
    </Popup >
