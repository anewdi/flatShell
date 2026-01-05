import { Astal, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import Adw from "gi://Adw?version=1";
import Bluetooth from "gi://AstalBluetooth";
import { Accessor, createBinding, createComputed, For } from "gnim";
import { Separator } from "./components/separator";

const bluetooth = Bluetooth.get_default();

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const deviceButton = (device: Bluetooth.Device): JSX.Element => {
    const connecting = createBinding(device, "connecting")((c) => c);
    const percentage = createBinding(device, "batteryPercentage")((p) => p > 0 ? Math.floor(p * 100) : 0);
    const connected = createBinding(device, "connected");
    const state = createComputed(() => connected() ? percentage() ? "Connected(" + percentage().toString() + "%)" : "Connected" : "Disconnected");

    return <button
        class={connected(b => b ? "activeButton" : "")}
        onClicked={() => {
            if (connected.peek()) { device.disconnect_device(null); }
            else { device.connect_device(null); }
        }}>
        <centerbox>
            <label $type="start" label={device.name} />
            <stack $type="end" visibleChildName={connecting(b => b ? "connecting" : "state")}>
                <box $type="named" name={"connecting"} halign={Gtk.Align.END}>
                    <Adw.Spinner />
                </box>
                <label $type="named" name="state" label={state} />
            </stack>
        </centerbox>
    </button >;
};

const discovering = createBinding(bluetooth.adapter, "discovering");
const dev1 = createBinding(bluetooth, "devices")(dev => dev.filter((device) => device.paired).sort((a, b) => Number(b.connected) - Number(a.connected)));
const devs = createBinding(bluetooth, "is_connected")(() => dev1.peek());

export const bluetoothWindow = (monitor: number = 0): JSX.Element =>
    <window
        name={`bluetoothWindow` + monitor}
        class={"windowPopup"}
        monitor={monitor}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        marginRight={130}
        marginTop={5}
    >
        <box orientation={Gtk.Orientation.VERTICAL} >
            <centerbox class={"header"}>
                <label $type="start" label="Bluetooth" />
                <box $type="end">
                    <stack visibleChildName={discovering((d) => d ? "scan" : "refresh")}>
                        <button $type="named" name="scan" onClicked={() => bluetooth.adapter.stop_discovery()}>
                            <Adw.Spinner />
                        </button>
                        <button $type="named" name="refresh" onClicked={() => {
                            bluetooth.adapter.start_discovery();
                            sleep(15000).then(() => bluetooth.adapter.stop_discovery())
                        }}>
                            <image iconName={"view-refresh-symbolic"} />
                        </button>
                    </stack>
                    <button
                        onClicked={() => {
                            execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center bluetooth");
                        }}>
                        <image iconName={"applications-system-symbolic"} />
                    </button>
                </box>
            </centerbox>
            <box orientation={Gtk.Orientation.VERTICAL} class={"body"}>
                <For each={devs}>
                    {(item, index) => deviceButton(item)}
                </For>
            </box>
        </box>
    </window >


