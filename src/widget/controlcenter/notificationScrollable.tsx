import { Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import { createBinding, createEffect, createState, For } from "gnim";
import { notification } from "../components/notification";
import Adw from "gi://Adw?version=1";

type tProps = {
    height?: number;
    width?: number;
    transition_type?: Gtk.RevealerTransitionType;
    forceHeight?: boolean;
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


export const notificationScrollable = ({
    height = 400,
    width = 300,
    transition_type = Gtk.RevealerTransitionType.SLIDE_LEFT,
    forceHeight = false,
}: tProps
) => <revealer
    reveal_child={revealed}
    transition_type={transition_type}
    transition_duration={100}
>
        <Adw.Clamp maximum_size={width} css={`min-width: ${width}px; min-height: ${forceHeight ? height : 0}px;`}>
            <box>
                <scrolledwindow
                    maxContentHeight={height}
                    propagate_natural_width={true}
                    propagate_natural_height={true}
                    vscrollbar_policy={Gtk.PolicyType.EXTERNAL}
                    hscrollbar_policy={Gtk.PolicyType.NEVER} >
                    <box orientation={Gtk.Orientation.VERTICAL} class={"notifications"} spacing={8}>
                        <For each={notifications}>
                            {(item, _) => notification(item, () => item.dismiss())}
                        </For>
                    </box>
                </scrolledwindow>
                <Gtk.Separator orientation={Gtk.Orientation.VERTICAL} />
            </box>
        </Adw.Clamp>
    </revealer>

