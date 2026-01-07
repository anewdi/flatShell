import Network from "gi://AstalNetwork";
import { createBinding } from "gnim";

const net = Network.get_default();
const wifi = net.wifi;
const wired = net.wired;

export const networkButton = () =>
    <stack visibleChildName={createBinding(net, "primary")(p => p == Network.Primary.WIRED ? "wired" : "wifi")}>
        <button
            $type="named"
            name="wired"
            class="activeButton"
        >
            <box spacing={8}>
                <image
                    iconName={createBinding(wired, "iconName")} />
                <label label={"Connected"} />
            </box>
        </button>
        <button
            $type="named"
            name="wifi"
            class={createBinding(wifi, "enabled")(b => b ? "activeButton" : "")}
            onClicked={() => wifi.enabled = true}>
            <box spacing={8}>
                <image
                    iconName={createBinding(wifi, "iconName")} />
                <label label={createBinding(wifi, "internet")(a => a == Network.Internet.CONNECTED ? wifi.ssid : "Wifi")} />
            </box>
        </button>
    </stack >
