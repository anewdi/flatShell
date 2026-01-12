import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import PoweProfiles from "gi://AstalPowerProfiles";
import Batt from "gi://AstalBattery";
import { createBinding } from "gnim";
import { Separator } from "./components/separator";
import { Popup } from "./components/Popup";

const powerprofiles = PoweProfiles.get_default();
const batt = Batt.get_default();


const nameMap: Record<string, string> = {
    "power-saver": "Power Saver",
    balanced: "Balanced",
    performance: "Performance",
};


const powerbox = (profile: PoweProfiles.Profile) => {
    let modename = nameMap[profile.profile];
    const active = createBinding(powerprofiles, "active_profile")((activeProfile) => profile.profile == activeProfile);

    return <button
        class={active(b => b ? "activeButton" : "")}
        onClicked={() => powerprofiles.active_profile = profile.profile}
    >
        <box spacing={8}>
            <image iconName={`power-profile-${profile.profile}-symbolic`} />
            <label label={modename} />
        </box>
    </button>
}

const percentage = createBinding(batt, "percentage");
const rate = createBinding(batt, "energy_rate");


export const powerWindow = (monitor: number = 0): JSX.Element =>
    <Popup
        name={`powerWindow`}
        monitor={monitor}
    >
        <centerbox class="header">
            <label $type="start" label="Power" />
            <box $type="end">
                <button
                    onClicked={() => {
                        execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center power");
                    }}>
                    <image iconName={"applications-system-symbolic"} />
                </button>
            </box>
        </centerbox>
        <box orientation={Gtk.Orientation.VERTICAL} class={"batterybar"}>
            <levelbar hexpand={true}
                value={createBinding(batt, "percentage")}
                orientation={Gtk.Orientation.HORIZONTAL} />
            <Separator height={10} />
            <box>
                <label halign={Gtk.Align.START} label={rate(pull => {
                    if (pull > 0) {
                        return "Discharging - " + Math.round(pull) + "W";
                    }
                    else if (pull == 0) {
                        return "External Power";
                    } else {
                        return "Charging - " + -Math.round(pull) + "W"
                    }
                })} />
                <label hexpand={true} halign={Gtk.Align.END} label={percentage(p => (Math.floor(p * 100)).toString() + "%")} />
            </box>
        </box>
        <Separator />
        <box orientation={Gtk.Orientation.VERTICAL} class={"body"}>
            {powerprofiles.get_profiles().map(powerbox)}
        </box>
    </Popup >
