import { Astal, Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";
import Adw from "gi://Adw?version=1";
import Network from "gi://AstalNetwork";
import { createBinding, createComputed, For, onCleanup } from "gnim";

const wifi = Network.get_default().wifi;

const apButton = (ap: Network.AccessPoint): JSX.Element => {
    const activeAp = createBinding(wifi, "active_access_point");
    const state = createBinding(wifi, "state");
    const connected = createComputed(() => activeAp() == ap && state() == 100);
    const connecting = createComputed(() => {
        let st = state();
        return st > 30 && st < 100 && activeAp() == ap
    });


    return <button
        class={connected(b => b ? "activeButton" : "")}
        onClicked={() => connected() ? execAsync(`nmcli con down "${ap.ssid}"`) : ap.activate(null, null)}>
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

const discovering = createBinding(wifi, "scanning");
const internet = createBinding(wifi, "internet");
const apsBase = createBinding(wifi, "accessPoints")(aps => {
    const named = aps.filter(a => a.ssid);
    const ssids: Record<string, Network.AccessPoint> = {};

    named.forEach(s => {
        if (ssids[s.ssid] != undefined && ssids[s.ssid].last_seen > s.last_seen) {
            return;
        }
        ssids[s.ssid] = s
    });

    return named
        .filter(a => ssids[a.ssid] == a)
        .sort((a, b) => b.strength - a.strength);
});

const aps = createComputed(() => internet() != Network.Internet.CONNECTED ? apsBase() :
    apsBase().sort((a, b) => Number(b == wifi.active_access_point) - Number(a == wifi.active_access_point))
);


export const networkWindow = (monitor: number = 0): JSX.Element =>
    <window
        name={`networkWindow` + monitor}
        class={"windowPopup"}
        monitor={monitor}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        marginRight={100}
        marginTop={5}
        onNotifyVisible={(v) => { if (v.visible) wifi.scan() }}
        $={(self) => onCleanup(() => self.destroy())}
    >
        <Adw.Clamp maximum_size={330}>
            <box orientation={Gtk.Orientation.VERTICAL}>
                <centerbox class={"header"}>
                    <label $type="start" label="Wifi" />
                    <box $type="end">
                        <stack visibleChildName={discovering((d) => d ? "scan" : "refresh")}>
                            <button $type="named" name="scan">
                                <Adw.Spinner />
                            </button>
                            <button $type="named" name="refresh" onClicked={() => wifi.scan()} >
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
                            {(item, _) => apButton(item)}
                        </For>
                    </box>
                </scrolledwindow>
            </box >
        </Adw.Clamp>
    </window >
