import { Astal, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import Wp from "gi://AstalWp";
import { Accessor, createBinding, For } from "gnim";
import { volumeSlider } from "./components/volumeSlider";
import { Separator } from "./components/separator";

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
        onClicked={() => endpoint.set_is_default(true)}>

        <centerbox>
            <box $type="start" spacing={8}>
                <image iconName={iconstring} />
                <label label={device.description} />
            </box>
            <stack $type="end">
                <label label={createBinding(endpoint, "volume")((v) => Math.round(v * 100) + "%")} />
            </stack>
        </centerbox >
    </button >;
};

const speakers = createBinding(wp.audio, "speakers")(speakers => speakers.filter(speaker => speaker.get_device()));

export const soundWindow = (monitor: number = 0): JSX.Element =>
    <window
        name={`soundWindow` + monitor}
        class={"windowPopup"}
        monitor={monitor}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        marginRight={70}
        marginTop={5}
    >
        <box orientation={Gtk.Orientation.VERTICAL}>
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
                    {(item, index) => speakerButton(item)}
                </For>
            </box>
        </box>
    </window >
