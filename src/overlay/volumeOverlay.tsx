import { Astal, Gdk, Gtk } from "ags/gtk4";
import { volumeSlider } from "../components/volumeSlider"
import Wp from "gi://AstalWp";
import GLib from "gi://GLib?version=2.0";
import { createState, onCleanup } from "gnim";

const speaker = Wp.get_default().default_speaker;
const [revealed, setRevealed] = createState(false);
const [visible, setVisible] = createState(false);
const show = () => { setVisible(true); setRevealed(true); }
const hide = () => { setRevealed(false); }

let timeout: GLib.Source;
let lastValue = speaker.volume;

export const volumeOverlay = (monitor: Gdk.Monitor) => {
    speaker.connect("notify::volume", () => {
        if (Math.abs(speaker.volume - lastValue) > 1) {
            return;
        }
        lastValue = speaker.volume;
        if (timeout) {
            clearTimeout(timeout);
        }
        show();
        timeout = setTimeout(() => hide(), 1500)
    })

    return <window
        gdkmonitor={monitor}
        anchor={Astal.WindowAnchor.TOP}
        visible={visible}
        $={(self) => { Object.assign(self, { hide, show }); onCleanup(() => self.destroy()); }}
    >
        <revealer
            reveal_child={revealed}
            onNotifyChildRevealed={({ child_revealed }) => setVisible(child_revealed)}
            transition_type={Gtk.RevealerTransitionType.SLIDE_DOWN}
            transition_duration={100}
        >
            <box
                class={"windowPopup"}
                css={"min-width: 250px;"}
                margin_top={5}
            >
                {volumeSlider()}
            </box>
        </revealer>
    </window >
}
