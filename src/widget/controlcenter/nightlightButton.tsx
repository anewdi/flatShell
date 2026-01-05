import { exec } from "ags/process";
import { createState } from "gnim";

const [active, setActive] = createState(exec(`bash -c "systemctl --user is-active nightlight"`) == "active");
export const nightlightButton = () =>
    <button
        class={active(b => b ? "activeButton" : "")}
        onClicked={() => {
            if (active()) {
                exec(`bash -c "systemctl --user stop nightlight"`);
                setActive(c => false);
            } else {
                exec(`bash -c "systemctl --user start nightlight"`);
                setActive(c => true);
            }
        }}>
        <box spacing={8}>
            <image iconName={active(b => b ? "night-light-symbolic" : "night-light-disabled-symbolic")} />
            <label label={"Night Light"} />
        </box>
    </button >
