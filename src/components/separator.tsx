import { Gtk } from "ags/gtk4";

type props = {
    size?: number;
    orientation?: Gtk.Orientation;
}
export function Separator({ size = 15, orientation = Gtk.Orientation.HORIZONTAL }: props) {
    return orientation == Gtk.Orientation.HORIZONTAL ? <box css={`min-height: ${size}px;`} /> : <box css={`min-width: ${size}px`} />
}
