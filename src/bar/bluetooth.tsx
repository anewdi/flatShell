import Bluetooth from "gi://AstalBluetooth";
import { createBinding } from "gnim";
import { togglePopup } from "../lib/common";

const blue = Bluetooth.get_default();

const iName = createBinding(blue, "isConnected")((b: boolean) => b ? "bluetooth-active-symbolic" : "bluetooth-disconnected-symbolic");

const show = createBinding(blue, "isPowered")((b: boolean) => b);

export const bluetooth = (): JSX.Element =>
    <button visible={show} onClicked={() => togglePopup("bluetoothWindow")}>
        <image iconName={iName} />
    </button>

