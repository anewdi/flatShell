import { Gdk, Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import Pango from "gi://Pango?version=1.0";
import { createBinding, createState } from "gnim";

const display = Gdk.Display.get_default();
const theme = display ? Gtk.IconTheme.get_for_display(display) : null;

function calcTime(oldTime: number): string {
    const now = Date.now();
    const timeSinceMinutes = Math.floor((now / 1000 - oldTime) / 60);
    if (timeSinceMinutes < 1) {
        return "Just now";
    }

    if (timeSinceMinutes < 60) {
        return Math.floor(timeSinceMinutes) + " minutes ago";
    }

    if (timeSinceMinutes < 180) {
        return "1 hour ago";
    }

    if (timeSinceMinutes / 60 < 24) {
        return Math.floor(timeSinceMinutes / 60) + " hours ago"
    }

    if (timeSinceMinutes / 60 / 24 < 7) {
        return Math.floor(timeSinceMinutes / 60 / 24) + " days ago"
    }

    if (timeSinceMinutes / 60 / 24 < 14) {
        return "1 week ago"
    }

    return timeSinceMinutes / 60 / 24 / 7 + " weeks ago";
}

const determineIsIcon = (image: string): boolean => (theme != null && theme.has_icon(image + "-symbolic"));


export const notification = (n: Notifd.Notification, onClick: () => void): JSX.Element => {
    const [timeString, setTimeString] = createState(calcTime(n.time));
    setTimeout(() => { setTimeString(calcTime(n.time)) }, 1000 * 60);

    let image;
    if (n.image.at(0) == "/") {
        image = n.image;
    } else if (determineIsIcon(n.image)) {
        image = n.image + "-symbolic";
    } else if (n.app_icon.at(0) == "/") {
        image = n.app_icon;
    } else if (determineIsIcon(n.app_icon)) {
        image = n.app_icon + "-symbolic";
    } else {
        image = "dialog-information-symbolic";
    }

    const summary = createBinding(n, "summary");
    const body = createBinding(n, "body");

    return <box class={"notification"}>
        {
            image.at(0) == "/"
                ? <box class={"cover"} valign={Gtk.Align.CENTER} css={`background-image: url("file://${image}");`} />
                : <image class={"cover"} valign={Gtk.Align.CENTER} icon-name={image} />
        }
        <box class="info" orientation={Gtk.Orientation.VERTICAL} >
            <box class={"header"} spacing={8}>
                <label
                    halign={Gtk.Align.START}
                    valign={Gtk.Align.CENTER}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={summary}
                />
                <label
                    name={"time"}
                    valign={Gtk.Align.CENTER}
                    label={timeString}
                />
                <button
                    onClicked={onClick}
                    hexpand={true}
                    halign={Gtk.Align.END}
                >
                    <image icon_name={"window-close-symbolic"} />
                </button>
            </box>
            <label
                name={"paragraph"}
                hexpand={true}
                halign={Gtk.Align.START}
                wrap={true}
                label={body}
            />
        </box>
    </box >
}
