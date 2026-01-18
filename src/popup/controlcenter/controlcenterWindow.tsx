import { Gdk, Gtk } from "ags/gtk4";
import { execAsync, } from "ags/process";
import { volumeSlider } from "../../components/volumeSlider.js";
import { bluetoothButton } from "./bluetoothButton.js";
import { recorderButton } from "./recorderButton.js";
import { nightlightButton } from "./nightlightButton.js";
import { darkmodeButton } from "./darkmodeButton.js";
import { mediaplayer } from "../../components/mediaplayer.js";
import { brightnessSlider } from "../../components/brightnessSlider.js";
import { Separator } from "../../components/separator.js";
import { togglePopup } from "../../lib/common.js";
import { Popup } from "../Popup.js";
import { dndButton } from "./dndButton.js";
import { NotificationScrollable } from "./NotificationScrollable.js";
import { batteryLabel } from "./batteryLabel.js";
import Adw from "gi://Adw?version=1";
import { Accessor } from "gnim";
import { currentMon } from "../../../app.js";

const notificationWidth = 340;
const notificationsHeight = 420;

const controlcenterWidth = 340;

let notificationsRevealed: Accessor<boolean>;

export const controlcenterWindow = (monitor: Gdk.Monitor): JSX.Element => {
    const tempMon = currentMon;
    return <Popup
        name={`controlcenterWindow`}
        gdkmonitor={monitor}
        margin_end={10}
        cssClasses={["windowPopup", "controlcenterWindow"]}
        orientation={Gtk.Orientation.HORIZONTAL}
    >
        <NotificationScrollable
            forceHeight={true}
            scrollableHeight={notificationsHeight}
            transition_type={Gtk.RevealerTransitionType.SLIDE_LEFT}
            width={notificationWidth}
            getRevealed={(revealed: Accessor<boolean>) => { notificationsRevealed = revealed; }}
        />
        <Gtk.Separator visible={notificationsRevealed} />
        <Adw.Clamp
            maximum_size={controlcenterWidth}
            css={`min-width: ${controlcenterWidth}px;`}
            unit={Adw.LengthUnit.PX}
        >
            <box orientation={Gtk.Orientation.VERTICAL}>
                <box class={"header"}>
                    <box halign={Gtk.Align.START}>
                        {batteryLabel()}
                    </box>
                    <box halign={Gtk.Align.END} hexpand={true}>
                        {recorderButton()}
                        <button
                            onClicked={() => { execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center"); }}>
                            <image iconName={"applications-system-symbolic"} />
                        </button>
                        <button onClicked={() => togglePopup("powermenuRightWindow" + tempMon)} >
                            <image iconName={"system-shutdown-symbolic"} />
                        </button>
                    </box>
                </box>
                {volumeSlider()}
                <Separator size={2} />
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
                <Separator size={20} />
                {mediaplayer(true)}
            </box>
        </Adw.Clamp>
    </Popup >
}
