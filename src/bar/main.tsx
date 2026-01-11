import { Astal, Gtk } from "ags/gtk4"
import { workspaces } from "./workspaces"
import { clock } from "./clock"
import { battery } from "./battery"
import { volume } from "./volume"
import { eth, wifi } from "./network"
import { bluetooth } from "./bluetooth"
import { keymap } from "./keymap"
import { onCleanup } from "gnim"

const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;


export const bar = (monitor: number = 0): JSX.Element =>
    < window
        name={"bar" + monitor}
        cssClasses={["bar"]}
        monitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        visible={true}
        anchor={LEFT | TOP | RIGHT}
        $={(self) => onCleanup(() => self.destroy())}
    >
        <box hexpand={true}>
            <box>
                {workspaces()}
            </box>
            <box
                name={"rightContainerBar"}
                hexpand={true}
                halign={Gtk.Align.END}>
                {keymap()}
                {bluetooth()}
                {wifi()}
                {eth()}
                {volume()}
                {battery()}
                {clock()}
            </box>
        </box>
    </window >;
