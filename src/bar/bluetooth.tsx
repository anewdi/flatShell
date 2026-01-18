import Bluetooth from "gi://AstalBluetooth";
import { createBinding } from "gnim";
import { togglePopup } from "../lib/common";
import { currentMon } from "../../app";

const blue = Bluetooth.get_default();

const iName = createBinding(blue, "isConnected")((b: boolean) => b ? "bluetooth-active-symbolic" : "bluetooth-disconnected-symbolic");

const show = createBinding(blue, "isPowered")((b: boolean) => b);

export const bluetooth = (): JSX.Element => {
    const tempmon = currentMon;
    return <button visible={show} onClicked={() => togglePopup("bluetoothWindow" + tempmon)}>
        <image iconName={iName} />
    </button>
}

