import Wp from "gi://AstalWp";
import { Accessor, createBinding, createComputed, createState } from "gnim";

const speaker = Wp.get_default().get_default_speaker();

const icons: Record<number, string> = {
    101: "overamplified",
    67: "high",
    34: "medium",
    1: "low",
    0: "muted",
};

const muted = createBinding(speaker, "mute");
const vol = createBinding(speaker, "volume");

function getIcon(v: number) {
    let icon: number | undefined = [101, 67, 34, 1, 0].find(
        (threshold) => threshold <= v * 100,
    );
    icon = icon ? icon : 0;
    return `audio-volume-${icons[icon]}-symbolic`;
}

const iName = createComputed(() => muted() ? `audio-volume-${icons[0]}-symbolic` : getIcon(vol()));

const [volVal, setvolVal] = createState(vol.peek());

export const volumeSlider = (): JSX.Element =>
    <box class={"slider"}>
        <button onClicked={() => speaker.mute = !speaker.mute}><image iconName={iName} /></button>
        <slider
            hexpand={true}
            value={vol}
            min={0}
            max={1}
            onChangeValue={({ value }) => { speaker.volume = value; }}
        />
    </box>;

