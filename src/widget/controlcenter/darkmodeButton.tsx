import { createBinding } from "gnim";
import Adw from "gi://Adw?version=1"
import { exec } from "ags/process";

const adw = Adw.StyleManager.get_default();
const darkmode = createBinding(adw, "dark")


export const darkmodeButton = () =>
    <button
        class={darkmode(b => b ? "activeButton" : "")}
        onClicked={() => {
            if (darkmode()) {
                exec(`dconf write /org/gnome/desktop/interface/color-scheme '"prefer-light"'`)
            } else {
                exec(`dconf write /org/gnome/desktop/interface/color-scheme '"prefer-dark"'`)
            }
        }}>
        <box spacing={8}>
            <image iconName={"daytime-sunset-symbolic"} />
            <label label={"Dark Mode"} />
        </box>
    </button >

