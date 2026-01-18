import { Gtk } from "ags/gtk4";
import Hyprland from "gi://AstalHyprland"
import { createBinding, createComputed } from "gnim"

const hyprland = Hyprland.get_default()


function workspaceButton(n: number): JSX.Element {
    const active = createBinding(hyprland, "focused_workspace");
    const visible = createBinding(hyprland, "workspaces");

    const className = createComputed(() => {
        if (active() && n == active().get_id()) {
            return "focused";
        } else if (visible() && visible().map((w: Hyprland.Workspace) => w.get_id()).includes(n)) {
            return "visible";
        } else {
            return ""
        }
    })

    return (
        <button
            onClicked={() => { hyprland.message_async(`dispatch workspace ${n}`, () => { }) }}
            class={className}
        />
    )
}

export const workspaces = (): JSX.Element => <box cssClasses={["workspaces"]} children={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(workspaceButton)} />;
