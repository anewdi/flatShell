import { Astal, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import Adw from "gi://Adw?version=1";
import Bluetooth from "gi://AstalBluetooth";
import Pango from "gi://Pango?version=1.0";
import { Accessor, createBinding, createComputed, For, onCleanup } from "gnim";

const bluetooth = Bluetooth.get_default();

const deviceButton = (device: Bluetooth.Device): JSX.Element => {
    const connecting = createBinding(device, "connecting")((c) => c);
    const percentage = createBinding(device, "batteryPercentage")((p) => p > 0 ? Math.floor(p * 100) : 0);
    const connected = createBinding(device, "connected");
    const state = createComputed(() => connected() ? percentage() ? "Connected(" + percentage().toString() + "%)" : "Connected" : "Disconnected");

    return <button class={connected(b => b ? "activeButton" : "")}
        onClicked={() => {
            if (connected.peek()) { device.disconnect_device(null); }
            else { device.connect_device(null); }
        }}>
        <centerbox>
            <label $type="start" ellipsize={Pango.EllipsizeMode.END} label={device.alias} />
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
const conn = createBinding(bluetooth, "is_connected");
const deviceBase = createBinding(bluetooth, "devices")(dev => dev
    .filter(d => d.name)
    .sort((a, b) => Number(b.paired) - Number(a.paired)
    ));

const devices = createComputed(() => !conn() ? deviceBase :
    deviceBase().sort((a, b) => Number(b.connected) - Number(a.connected)))


export const bluetoothWindow = (monitor: number = 0): JSX.Element =>
    <window
        name={`bluetoothWindow` + monitor}
        class={"windowPopup"}
        monitor={monitor}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        marginRight={130}
        marginTop={5}
        onNotifyVisible={(v) => {
            if (v.visible) {
                bluetooth.adapter.start_discovery();
                setTimeout(() => bluetooth.adapter.stop_discovery(), 15000)
            }
        }}
        $={(self) => onCleanup(() => self.destroy())}
    >
        <Adw.Clamp maximum_size={330}>
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
                                setTimeout(() => bluetooth.adapter.stop_discovery(), 15000)
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
                <scrolledwindow
                    maxContentHeight={250}
                    propagate_natural_width={true}
                    overlay_scrolling={true}
                    propagate_natural_height={true}
                    vscrollbar_policy={Gtk.PolicyType.EXTERNAL}
                    hscrollbar_policy={Gtk.PolicyType.NEVER} >
                    <box orientation={Gtk.Orientation.VERTICAL} class={"body"}>
                        <For each={devices}>
                            {(item, _) => deviceButton(item)}
                        </For>
                    </box>
                </scrolledwindow>
            </box>
        </Adw.Clamp>
    </window >


