import { exec } from "ags/process";
import { createState } from "gnim";

function checkState() {
    try {
        exec(`bash -c "systemctl --user is-active nightlight"`);
    } catch (e) {
        return false;
    }
    return true;
}

const [active, setActive] = createState(checkState());
export const nightlightButton = () =>
    <button
        class={active(b => b ? "activeButton" : "")}
        onClicked={() => {
            if (active()) {
                exec(`bash -c "systemctl --user stop nightlight"`);
                setActive(false);
            } else {
                exec(`bash -c "systemctl --user start nightlight"`);
                setActive(true);
            }
        }}>
        <box spacing={8}>
            <image iconName={active(b => b ? "night-light-symbolic" : "night-light-disabled-symbolic")} />
            <label label={"Night Light"} />
        </box>
    </button >
