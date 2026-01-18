import Batt from "gi://AstalBattery";
import { createBinding, createComputed } from "gnim";
import Pango from "gi://Pango?version=1.0";
const batt = Batt.get_default();

const percent = createBinding(batt, "percentage")((p: number) => ` ${Math.floor(p * 100)}`);
const charging = createBinding(batt, "charging");

const iconName = createComputed(() => charging() ?
    (Number(percent()) == 100) ? `battery-level-${Math.floor(Number(percent()) / 10) * 10}-charged-symbolic` :
        `battery-level-${Math.floor(Number(percent()) / 10) * 10}-charging-symbolic` :
    `battery-level-${Math.floor(Number(percent()) / 10) * 10}-symbolic`);

export const batteryLabel = () =>
    <box spacing={5}>
        <box>
            <image iconName={iconName} />
            <label label={percent(p => p + "%")} />
        </box>
        <label
            ellipsize={Pango.EllipsizeMode.END}
            label={createBinding(batt, "time_to_empty")(time => {
                const mins = time / 60;
                const hours = Math.floor(mins / 60);
                const minutes = Math.round(mins % 60);
                if (hours >= 1) {
                    return `${hours}h ${minutes}m`;
                }
                if (minutes) {
                    return `${minutes}m`;
                }
                return "External Power";
            })}
            css={"color: grey;"}
        />
    </box>
