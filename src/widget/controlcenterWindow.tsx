import { Astal, Gtk } from "ags/gtk4";
import { execAsync, } from "ags/process";
import { volumeSlider } from "./components/volumeSlider.js";
import { bluetoothButton } from "./controlcenter/bluetoothButton.js";
import { batteryButton } from "./controlcenter/batteryButton.js";
import { recorderButton } from "./controlcenter/recorderButton.js";
import { networkButton } from "./controlcenter/networkButton.js";
import { nightlightButton } from "./controlcenter/nightlightButton.js";
import { darkmodeButton } from "./controlcenter/darkmodeButton.js";
import { mediaplayer } from "./components/mediaplayer.js";
import { brightnessSlider } from "./components/brightnessSlider.js";
import Adw from "gi://Adw?version=1";
import { Separator } from "./components/separator.js";
import { togglePopup } from "../lib/common.js";

export const controlcenterWindow = (monitor: number = 0): JSX.Element =>
    <window
        name={`controlcenterWindow` + monitor}
        class={"windowPopup"}
        monitor={monitor}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        marginRight={10}
        marginTop={10}
    >
        <Adw.Clamp maximumSize={350}>
            <box orientation={Gtk.Orientation.VERTICAL} >
                <centerbox class={"header"}>
                    {batteryButton()}
                    <box $type="end">
                        {recorderButton()}
                        <button
                            onClicked={() => { execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center"); }}>
                            <image iconName={"applications-system-symbolic"} />
                        </button>
                        <button onClicked={() => {
                            togglePopup("powermenuRightWindow");
                        }}>
                            <image iconName={"system-shutdown-symbolic"} />
                        </button>
                    </box>
                </centerbox>
                <Separator />
                {volumeSlider()}
                <box css={"margin-top: 5px;"}></box>
                {brightnessSlider()}
                <Separator />
                <box orientation={Gtk.Orientation.VERTICAL} spacing={8} class={"switchToggles"}>
                    <box homogeneous={true} spacing={8}>
                        {networkButton()}
                        {bluetoothButton()}
                    </box>
                    <box homogeneous={true} spacing={8}>
                        {nightlightButton()}
                        {darkmodeButton()}
                    </box>
                </box>
                {mediaplayer()}
            </box>
        </Adw.Clamp>
    </window >
