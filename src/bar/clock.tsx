import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"
import { togglePopup } from "../lib/common";
import { currentMon } from "../../app";

const time = createPoll("", 1000, () => {
    return GLib.DateTime.new_now_local().format("%a %d %b %H:%M") + " ";
})

export const clock = (): JSX.Element => {
    const tempmon = currentMon;
    return <button onClicked={() => togglePopup("controlcenterWindow" + tempmon)}>
        <label label={time} />
    </button>

}
