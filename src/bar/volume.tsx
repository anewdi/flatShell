import Wp from "gi://AstalWp"
import { createBinding, createComputed } from "gnim"
import { togglePopup } from "../lib/common";

const default_speaker = Wp.get_default().audio.default_speaker;

const icons: Record<number, string> = {
    101: "overamplified",
    67: "high",
    34: "medium",
    1: "low",
    0: "muted",
};

const muted = createBinding(default_speaker, "mute");
const vol = createBinding(default_speaker, "volume");

function getIcon(v: number) {
    let icon: number | undefined = [101, 67, 34, 1, 0].find(
        (threshold) => threshold <= v * 100,
    );
    icon = icon ? icon : 0;
    return `audio-volume-${icons[icon]}-symbolic`;
}

const iName = createComputed(() => muted() ? `audio-volume-${icons[0]}-symbolic` : getIcon(vol()));

export const volume = (): JSX.Element =>
    <button onClicked={() => togglePopup("soundWindow")}>
        <image iconName={iName} />
    </button>;

