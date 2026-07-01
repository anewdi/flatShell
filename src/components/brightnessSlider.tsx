import Brightness from "gi://AstalBrightness";
import { Accessor, createBinding, } from "gnim";

const screen = Brightness.get_default().get_screen();

const bvalue = createBinding(screen, "brightness")

export const brightnessSlider = (): JSX.Element =>
    <box class={"slider"} sensitive={true}>
        <button><image iconName={"display-brightness-symbolic"} /></button>
        <slider
            sensitive={true}
            hexpand={true}
            value={bvalue}
            min={0}
            max={1}
            onChangeValue={({ value }) => { screen.brightness = value; }}
        />
    </box>;
