import { Astal, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import Adw from "gi://Adw?version=1";
import Network from "gi://AstalNetwork";
import { createBinding, createComputed, For, onCleanup } from "gnim";
import { Separator } from "./components/separator";

const wwfi = Network.get_default().wifi;


const apButton = (ap: Network.AccessPoint): JSX.Element => {
    const activeAp = createBinding(wwfi, "active_access_point");
    const state = createBinding(wwfi, "state");
    const connected = createComputed(() => activeAp() == ap && state() == 100);
    const connecting = createComputed(() => {
        let st = state();
        return st > 30 && st < 100 && activeAp() == ap
    });


    return <button
        class={connected(b => b ? "activeButton" : "")}
        onClicked={() => ap.activate(null, null)}>
        <centerbox>
            <box $type="start" class={"item"} spacing={8}>
                <image iconName={ap.icon_name} />
                <label label={ap.ssid} />
            </box>
            <stack $type="end" visibleChildName={connecting(b => b ? "connecting" : "status")}>
                <label $type="named" name="status" label={connected(b => b ? "Connected" : ap.requiresPassword ? "Secured" : "Open")} />
                <box $type="named" name="connecting" halign={Gtk.Align.END}>
                    <Adw.Spinner />
                </box>
            </stack>
        </centerbox>
    </button>
}

const aps = createBinding(wwfi, "accessPoints")(aps => {
    const ssids: Set<string> = new Set();

    return aps.sort((a, b) => b.strength - a.strength)
        .sort((a, b) => Number(b == wwfi.active_access_point) - Number(a == wwfi.active_access_point))
        .filter(ap => {
            const isDuplicate = ssids.has(ap.ssid);
            ssids.add(ap.ssid);
            return !isDuplicate;
        })
});

const discovering = createBinding(wwfi, "scanning");

export const networkWindow = (monitor: number = 0): JSX.Element =>
    <window
        name={`networkWindow` + monitor}
        class={"windowPopup"}
        monitor={monitor}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        marginRight={100}
        marginTop={5}
        $={(self) => onCleanup(() => self.destroy())}
    >
        <box orientation={Gtk.Orientation.VERTICAL}>
            <centerbox class={"header"}>
                <label $type="start" label="Wifi" />
                <box $type="end">
                    <stack visibleChildName={discovering((d) => d ? "scan" : "refresh")}>
                        <button $type="named" name="scan">
                            <Adw.Spinner />
                        </button>
                        <button $type="named" name="refresh" onClicked={() => wwfi.scan()} >
                            <image iconName={"view-refresh-symbolic"} />
                        </button>
                    </stack>
                    <button
                        onClicked={() => {
                            execAsync("env XDG_CURRENT_DESKTOP=gnome gnome-control-center wifi");
                        }} >
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
                    <For each={aps}>
                        {(item, index) => apButton(item)}
                    </For>
                </box>
            </scrolledwindow>
        </box >
    </window >
