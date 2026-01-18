import { Astal, Gdk, Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import Notifd from "gi://AstalNotifd";
import { Accessor, createBinding, createComputed, createState, For, onCleanup } from "gnim";
import { notification } from "../components/notification";

const notifd = Notifd.get_default();
notifd.default_timeout = 4000;

const notifications = createBinding(notifd, "notifications");
//Instead of dismissing notifications when clicking "x" we just dont show them on overlay anymore
//They can be removed completely from controlcenter
const [seen, setSeen] = createState([new Notifd.Notification])

const notificationsFiltered = createComputed(() => {
    const notificationsLocal = notifications().filter((n) => !seen().includes(n));

    if (notificationsLocal.length == 0 || notifd.dont_disturb) {
        hide();
        return notificationsLocal;
    }

    show();
    return [notificationsLocal.sort((a: Notifd.Notification, b: Notifd.Notification) => b.time - a.time)[0]];
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
                    <For each={notificationsFiltered}>
                        {(item, _) => notification(item, () => {
                            item.connect("resolved", () => setSeen(s => {
                                s.splice(s.indexOf(item), 1)
                                return s; // We return same refrence so it wont issue update. This is fine
                            }));
                            setSeen(s => s.concat(item));
                        })}
                    </For>
                </box>
            </Adw.Clamp>
        </revealer>
    </window >
