import { Astal, Gdk, Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import Graphene from "gi://Graphene?version=1.0";
import { createState, onCleanup } from "gnim";
import { togglePopup } from "../../lib/common";

type PopupProps = JSX.IntrinsicElements["window"] & {
    children: any;
    monitor: number;
    name: string;
    width?: number;
    valign?: Gtk.Align;
    halign?: Gtk.Align;
    margin_start?: number;
    orientation?: Gtk.Orientation;
    margin_end?: number;
    visibleCb?: (v: Gtk.Widget) => void;
    overrideClass?: string;
    forceWidth?: boolean;
};

export function Popup({
    children,
    name,
    monitor,
    width = 300,
    valign = Gtk.Align.START,
    halign = Gtk.Align.START,
    orientation = Gtk.Orientation.VERTICAL,
    margin_start = 0,
    margin_end = 0,
    forceWidth = true,
    overrideClass = "windowPopup",
    visibleCb = ((v) => { }),
    ...props
}: PopupProps): JSX.Element {

    const [revealed, setRevealed] = createState(false);
    const [visible, setVisible] = createState(false);

    const show = () => { setVisible(true); setRevealed(true); }
    const hide = () => { setRevealed(false); }
    const init = (self: Gtk.Window) => { Object.assign(self, { show, hide }) }

    let content: Adw.Clamp;

    return <window
        {...props}
        visible={visible}
        name={name + monitor}
        monitor={monitor}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
        onNotifyVisible={(v: Gtk.Widget) => {
            if (v.visible) {
                content.grab_focus();
                visibleCb(v);
            }
        }}
        $={(self) => { init(self); onCleanup(() => self.destroy()); }} >

        <Gtk.GestureClick onPressed={({ widget }, _, x, y) => {
            const [, rect] = content.compute_bounds(widget);
            if (!rect.contains_point(new Graphene.Point({ x, y }))) {
                setRevealed(false);
            };
        }} />

        <Gtk.EventControllerKey onKeyPressed={({ widget }, keyval: number) => {
            if (keyval == Gdk.KEY_Escape) {
                togglePopup(name);
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
                margin_end={margin_end}
                margin_start={margin_start}
                marginTop={5}
                $={(self) => { content = self }}
            >
                <box class={overrideClass}
                    orientation={orientation}
                    css={`min-width: ${forceWidth ? width : 0}px;`}
                >
                    {children}
                </box>
            </Adw.Clamp>
        </revealer>
    </window >
}
