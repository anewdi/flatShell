import Hyprland from "gi://AstalHyprland"
import { createState, onCleanup } from "gnim"

const hyprland = Hyprland.get_default()

function workspaceButton(n: number): JSX.Element {
    const [className, setClassName] = createState("");

    const i = hyprland.connect("event", (() => {
        setClassName((s) => n == hyprland.focused_workspace.get_id() ? "focused" : ((hyprland.workspaces).map((w: Hyprland.Workspace) => w.get_id()).includes(n) ? "visible" : ""))
    }))

    onCleanup(() => {
        hyprland.disconnect(i)
    })

    return (
        <button
            onClicked={() => { hyprland.message_async(`dispatch workspace ${n}`, () => { }) }}
            class={className}
        />
    )
}
export const workspaces = (): JSX.Element => <box cssClasses={["workspaces"]} children={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(workspaceButton)} />;
