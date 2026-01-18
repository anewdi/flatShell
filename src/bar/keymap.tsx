import { exec, execAsync } from "ags/process";
import Hyprland from "gi://AstalHyprland";
import { createConnection } from "gnim";

const hyprland = Hyprland.get_default();

const init = exec(`bash -c "hyprctl devices -j | jq -r -c '.keyboards.[] | select(.main == true)| .active_keymap'"`).substring(0, 2).toUpperCase();


const lang = createConnection(init, [hyprland, "keyboard-layout", (k, l) => l.substring(0, 2).toUpperCase()])

export const keymap = (): JSX.Element =>
    <button name="keymapButton" onClicked={() => { execAsync(`bash -c "hyprctl switchxkblayout all next"`) }}>
        <label label={lang} />
    </button>

