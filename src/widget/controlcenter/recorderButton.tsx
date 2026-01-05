import { Gtk } from "ags/gtk4";
import { exec, subprocess } from "ags/process";
import { createState } from "gnim";

const [active, setActive] = createState(false);
const [time, setTime] = createState(0);

function counter() {
    if (active.peek()) {
        setTime(t => t + 1);
        setTimeout(counter, 1000);
    }
}
export const recorderButton = () =>
    <box class={active(b => b ? "rec" : "norec")}>
        <revealer
            revealChild={active}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}>
            <label label={time(t => `Recording: ${t}s`)} css="color: grey; font-weight: bold;" />
        </revealer>

        <button onClicked={() => {
            if (!active()) {
                subprocess(`bash -c "wf-recorder -c libx264rgb -f ~/temp.mkv"`, (out) => setActive(b => false), (err) => setActive(b => false))
                setActive(b => true);
                counter();
            } else {
                exec(`bash -c "pkill wf-recorder"`)
            }
        }}
        >
            <image iconName={"media-record-symbolic"} css="color: coral;" />
        </button>
    </box >
