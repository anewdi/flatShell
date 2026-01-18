import { Astal, Gdk, Gtk } from "ags/gtk4"
import { workspaces } from "./workspaces"
import { clock } from "./clock"
import { battery } from "./battery"
import { volume } from "./volume"
import { eth, wifi } from "./network"
import { bluetooth } from "./bluetooth"
import { keymap } from "./keymap"
import { onCleanup } from "gnim"

const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

export const bar = (monitor: Gdk.Monitor): JSX.Element =>
    < window
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        visible={true}
        anchor={LEFT | TOP | RIGHT}
        $={(self) => onCleanup(() => self.destroy())}
    >
        <box cssClasses={["bar"]}>
            <box>
                {workspaces()}
            </box>
            <box
                name={"popupButtons"}
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
