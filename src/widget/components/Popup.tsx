import { Astal, Gdk, Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import Graphene from "gi://Graphene?version=1.0";
import { createState, onCleanup } from "gnim";
import { currentMon } from "../../../app";

type PopupProps = JSX.IntrinsicElements["window"] & {
    name: string;
    children: any;
    width?: number;
    forceWidth?: boolean;
    orientation?: Gtk.Orientation;
    gdkmonitor: Gdk.Monitor;
};

export function Popup({
    width = 330,
    forceWidth = true,
    orientation = Gtk.Orientation.VERTICAL,
    halign = Gtk.Align.END,
    valign = Gtk.Align.START,
    margin_top = 5,
    margin_end = 40,
    cssClasses = ["windowPopup"],
    onNotifyVisible = (() => { }),
    ...props
}: PopupProps): JSX.Element {

    const [revealed, setRevealed] = createState(false);
    const [visible, setVisible] = createState(false);

    const show = () => { setVisible(true); setRevealed(true); }
    const hide = () => { setRevealed(false); }

    let content: Adw.Clamp;

    return <window
        {...props}
        visible={visible}
        name={props.name + currentMon}
        gdkmonitor={props.gdkmonitor}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
        onNotifyVisible={(v: Astal.Window, _) => {
            if (v.visible) {
                onNotifyVisible(v, _);
                content.grab_focus();
            }
        }}
        $={(self) => { Object.assign(self, { hide, show }); onCleanup(() => self.destroy()); }}
    >

        <Gtk.GestureClick onPressed={({ widget }, _, x, y) => {
            const [, rect] = content.compute_bounds(widget);
            if (!rect.contains_point(new Graphene.Point({ x, y }))) {
                setRevealed(false);
            };
        }} />

        <Gtk.EventControllerKey onKeyPressed={({ widget }, keyval: number) => {
            if (keyval == Gdk.KEY_Escape) {
                widget.hide()
            }
        }} />

        <revealer
            reveal_child={revealed}
            transition_type={Gtk.RevealerTransitionType.SLIDE_DOWN}
            transition_duration={100}
            valign={valign}
            halign={halign}
            onNotifyChildRevealed={({ childRevealed }) => { setVisible(childRevealed) }}
        >
            <Adw.Clamp
                focusable={true}
                maximum_size={width}
                margin_bottom={props.margin_bottom}
                margin_top={margin_top}
                margin_end={margin_end}
                margin_start={props.margin_start}
                unit={Adw.LengthUnit.PX}
                css={`min-width: ${forceWidth ? width : 0}px;`}
                $={(self) => { content = self }}
            >
                <box hexpand={true} cssClasses={cssClasses} orientation={orientation} >
                    {props.children}
                </box>
            </Adw.Clamp>
        </revealer>
    </window >
}
