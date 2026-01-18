import { Gtk } from "ags/gtk4";
import { exec, execAsync } from "ags/process";
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
                const recordPath = "/tmp/recording.mkv"
                execAsync(`wf-recorder -f ${recordPath} -y`).then(() => {
                    setActive(false);
                    execAsync(`bash -c "cat /tmp/recording.mkv | gtksave"`).catch(() => {
                        console.warn(`Recoding avaliable at ${recordPath}`);
                        console.warn("Could not open gtksave, is it avaliable on path?");
                    });
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
