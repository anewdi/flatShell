import { Gtk } from "ags/gtk4";
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
import { Separator } from "./components/separator.js";
import { togglePopup } from "../lib/common.js";
import { Popup } from "./components/Popup.js";

export const controlcenterWindow = (monitor: number = 0): JSX.Element =>
    <Popup
        name={`controlcenterWindow`}
        monitor={monitor}
        margin_end={10}
        width={330}
    >
        <centerbox class={"header controlcenterHeader"}>
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
        {volumeSlider()}
        <Separator height={2} />
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
        <Separator height={20} />
        {mediaplayer()}
    </Popup >
