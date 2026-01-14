import { execAsync } from "ags/process";
import Network from "gi://AstalNetwork"
import { createBinding } from "gnim";
import { togglePopup } from "../lib/common";
import { currentMon } from "../../app";

const net = Network.get_default();

const iNameEth = createBinding(net.wired, "icon_name")((n) => n);
const visibleEth = createBinding(net.wired, "state")((s) => s == 100);

const iNameWifi = createBinding(net.wifi, "icon_name")((n) => n);
const visibleWifi = createBinding(net.wifi, "enabled")((b: boolean) => b);

export const wifi = (): JSX.Element => {
    const tempmon = currentMon;

    return <button
        visible={visibleWifi}
        onClicked={() => togglePopup("networkWindow" + tempmon)}>
        <image iconName={iNameWifi} />
    </button>;
}
export const eth = (): JSX.Element =>
    <button visible={visibleEth}
        onClicked={() => execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center network")}>
        <image iconName={iNameEth} />
    </button>;

