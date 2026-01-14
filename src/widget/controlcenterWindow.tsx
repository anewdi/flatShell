import { Gdk, Gtk } from "ags/gtk4";
import { execAsync, } from "ags/process";
import { volumeSlider } from "./components/volumeSlider.js";
import { bluetoothButton } from "./controlcenter/bluetoothButton.js";
import { batteryButton } from "./controlcenter/batteryButton.js";
import { recorderButton } from "./controlcenter/recorderButton.js";
import { nightlightButton } from "./controlcenter/nightlightButton.js";
import { darkmodeButton } from "./controlcenter/darkmodeButton.js";
import { mediaplayer } from "./components/mediaplayer.js";
import { brightnessSlider } from "./components/brightnessSlider.js";
import { Separator } from "./components/separator.js";
import { togglePopup } from "../lib/common.js";
import { Popup } from "./components/Popup.js";
import { dndButton } from "./controlcenter/dndButton.js";
import { notificationScrollable } from "./controlcenter/notificationScrollable.js";

const notificationWidth = 300;

export const controlcenterWindow = (monitor: Gdk.Monitor): JSX.Element =>
    <Popup
        name={`controlcenterWindow`}
        gdkmonitor={monitor}
        margin_end={10}
        width={notificationWidth + 360}
        forceWidth={false}
    >
        <box>
            {notificationScrollable({ width: notificationWidth, height: 400, forceHeight: true, })}
            <box orientation={Gtk.Orientation.VERTICAL} hexpand={true}>
                <box class={"header controlcenterHeader"}>
                    <box halign={Gtk.Align.START}>
                        {batteryButton()}
                    </box>
                    <box halign={Gtk.Align.END} hexpand={true}>
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
                </box>
                {volumeSlider()}
                <Separator height={2} />
                {brightnessSlider()}
                <Separator />
                <box orientation={Gtk.Orientation.VERTICAL} spacing={8} class={"switchToggles"}>
                    <box homogeneous={true} spacing={8}>
                        {dndButton()}
                        {bluetoothButton()}
                    </box>
                    <box homogeneous={true} spacing={8}>
                        {nightlightButton()}
                        {darkmodeButton()}
                    </box>
                </box>
                <Separator height={20} />
                {mediaplayer()}
            </box>
        </box>
    </Popup >
