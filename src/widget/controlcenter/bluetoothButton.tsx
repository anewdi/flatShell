import Bluetooth from "gi://AstalBluetooth";
import { createBinding } from "gnim";
const bluetooth = Bluetooth.get_default();

const className = createBinding(bluetooth, "is_powered")(b => b ? "activeButton" : "");
const iconName = createBinding(bluetooth, "is_connected")(b => b ? "bluetooth-active-symbolic" : "bluetooth-disconnected-symbolic");
const labelContent = createBinding(bluetooth, "is_connected")((devs) => {
    let cand = bluetooth.devices.find(d => d.connected);
    return cand ? cand.name : "Bluetooth"
});
export const bluetoothButton = () =>
    <button
        class={className}
        onClicked={() => bluetooth.toggle()}>
        <box spacing={8}>
            <image
                iconName={iconName} />
            <label label={labelContent} />
        </box>
    </button>
