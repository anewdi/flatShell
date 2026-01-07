import Bluetooth from "gi://AstalBluetooth";
import { createBinding } from "gnim";
const bluetooth = Bluetooth.get_default();

export const bluetoothButton = () =>
    <button
        class={createBinding(bluetooth, "is_powered")(b => b ? "activeButton" : "")}
        onClicked={() => bluetooth.toggle()}>
        <box spacing={8}>
            <image
                iconName={createBinding(bluetooth, "is_connected")(b => b ? "bluetooth-active-symbolic" : "bluetooth-disconnected-symbolic")} />
            <label label={createBinding(bluetooth, "is_connected")((devs) => {
                let cand = bluetooth.devices.find(d => d.connected);
                return cand ? cand.name : "Bluetooth"
            })} />
        </box>
    </button>
