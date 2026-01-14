import { Astal, Gdk, Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import Notifd from "gi://AstalNotifd";
import { createBinding, createState, For, onCleanup } from "gnim";
import { notification } from "./components/notification";

const notifd = Notifd.get_default();
notifd.default_timeout = 4000;

// array with only most recent notification
const notifications = createBinding(notifd, "notifications")(n => {
    if (n.length == 0 || notifd.dont_disturb) {
        hide();
        return n;
    }
    show();
    return [n.sort((a, b) => b.time - a.time)[0]];
});

const [visible, setVisible] = createState(false);
const [revealed, setRevealed] = createState(false);
const show = () => { setVisible(true); setRevealed(true); }
const hide = () => { setRevealed(false); }


export const notificationOverlay = (monitor: Gdk.Monitor) =>
    < window
        gdkmonitor={monitor}
        anchor={Astal.WindowAnchor.TOP}
        visible={visible}
        $={(self) => { Object.assign(self, { hide, show }); onCleanup(() => self.destroy()) }}
    >
        <revealer
            reveal_child={revealed}
            onNotifyChildRevealed={({ child_revealed }) => setVisible(child_revealed)}
            transition_type={Gtk.RevealerTransitionType.SLIDE_DOWN}
            transition_duration={100}
        >
            <Adw.Clamp
                maximum_size={350}
                css={"min-width: 350px;"}
                margin_top={5}
            >
                <box orientation={Gtk.Orientation.VERTICAL} hexpand={true} class={"notificationOverlay"}>
                    <For each={notifications}>
                        {(item, _) => notification(item, () => hide())}
                    </For>
                </box>
            </Adw.Clamp>
        </revealer>
    </window >
