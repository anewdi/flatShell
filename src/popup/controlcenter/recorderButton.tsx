import { Gtk } from "ags/gtk4";
import { exec, execAsync, subprocess } from "ags/process";
import { createState } from "gnim";

const [active, setActive] = createState(false);
const [time, setTime] = createState(0);

function counter() {
    if (active.peek()) {
        setTime(t => t + 1);
        setTimeout(counter, 1000);
    } else {
        setTime(0);
    }
}


export const recorderButton = () =>
    <box class={active(b => b ? "rec" : "")}>
        <revealer
            revealChild={active}
            transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}>
            <label label={time(t => `Recording: ${t}s`)} css="color: grey; font-weight: bold;" />
        </revealer>

        <button onClicked={() => {
            if (!active.peek()) {
                execAsync(`wf-recorder -f /tmp/recording.mkv`).then(() => {
                    setActive(false);
                    execAsync(`bash -c "cat /tmp/recording.mkv | gtksave"`);
                });
                setActive(true);
                counter();
            } else {
                exec(`bash -c "killall wf-recorder"`)
            }
        }}
        >
            <image iconName={"media-record-symbolic"} css="color: coral;" />
        </button>
    </box >
