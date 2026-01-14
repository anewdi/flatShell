import { Gdk, Gtk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import Pango from "gi://Pango?version=1.0";
import { createBinding } from "gnim";

const display = Gdk.Display.get_default();
const theme = display ? Gtk.IconTheme.get_for_display(display) : null;

function incTime(timeSince: number, oldTime: number): string {
    if (timeSince < 60) {
        return timeSince * 1000 * 60 + "minutes ago"
    }
    const timeDate = new Date(oldTime * 1000);
    return timeDate.getHours() + ":" + timeDate.getMinutes();
}

const determineIsIcon = (image: string): boolean => (theme != null && theme.has_icon(image + "-symbolic"));


export const notification = (n: Notifd.Notification, onClick: () => void): JSX.Element => {
    let timeSince = 0;
    let timeString = "Just now";
    setTimeout(() => { timeSince++; timeString = incTime(n.time, timeSince) }, 1000 * 60);

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
                <label halign={Gtk.Align.START} label={summary} valign={Gtk.Align.CENTER} ellipsize={Pango.EllipsizeMode.END} />
                <label name={"time"} valign={Gtk.Align.CENTER} label={timeString} />
                <button onClicked={onClick} hexpand={true} halign={Gtk.Align.END}>
                    <image icon_name={"window-close-symbolic"} />
                </button>
            </box>
            <label name={"paragraph"} hexpand={true} halign={Gtk.Align.START} label={body} wrap={true} />
        </box>
    </box >
}
