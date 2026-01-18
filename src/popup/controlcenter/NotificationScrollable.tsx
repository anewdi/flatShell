import { Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import { Accessor, createBinding, createEffect, createState, For } from "gnim";
import { notification } from "../../components/notification";
import Adw from "gi://Adw?version=1";

type tProps = {
    scrollableHeight?: number;
    width?: number;
    transition_type?: Gtk.RevealerTransitionType;
    forceHeight?: boolean;
    forceWidth?: boolean;
    getRevealed?: (revealed: Accessor<boolean>) => void;
}

const notifd = Notifd.get_default();

const notifications = createBinding(notifd, "notifications")(n => {
    n = n.filter(nn => nn.expire_timeout > 5000);
    if (n.length == 0 || notifd.dont_disturb) {
        setRevealed(false);
        return n;
    }
    setRevealed(true)
    return n.sort((a, b) => b.time - a.time);
});

const [revealed, setRevealed] = createState(false);
const dnd = createBinding(notifd, "dont_disturb");
createEffect(() => { setRevealed(!dnd() && notifications.peek().length != 0) });

export function NotificationScrollable({
    scrollableHeight = 400,
    width = 300,
    transition_type = Gtk.RevealerTransitionType.SLIDE_DOWN,
    forceHeight = false,
    forceWidth = true,
    getRevealed = () => { },
}: tProps): JSX.Element {
    getRevealed(revealed)
    return <revealer
        reveal_child={revealed}
        transition_type={transition_type}
        transition_duration={100}
    >
        <Adw.Clamp
            maximum_size={width}
            css={`min-width: ${forceWidth ? width : 0}px;`}
            class={"notifications"}
        >
            <box orientation={Gtk.Orientation.VERTICAL}>
                <box class={"header"}>
                    <label label={"Notifications"} />
                    <button
                        hexpand={true}
                        halign={Gtk.Align.END}
                        onClicked={() => notifd.notifications.forEach(n => n.dismiss())}
                    >
                        <image icon_name={"user-trash-symbolic"} />
                    </button>
                </box>
                <scrolledwindow
                    css={`min-height: ${forceHeight ? scrollableHeight : 0}px;`}
                    maxContentHeight={scrollableHeight}
                    propagate_natural_width={true}
                    propagate_natural_height={true}
                    vscrollbar_policy={Gtk.PolicyType.EXTERNAL}
                    hscrollbar_policy={Gtk.PolicyType.NEVER}
                >
                    <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                        <For each={notifications}>
                            {(item, _) => notification(item, () => item.dismiss())}
                        </For>
                    </box>
                </scrolledwindow>
            </box>
        </Adw.Clamp>
    </revealer>
}
