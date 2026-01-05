import Brightness from "../../lib/brightness";

import { Accessor, createBinding } from "gnim";

const brightness = Brightness.get_default();

const enabled = createBinding(brightness, "enabled")
const bvalue = createBinding(brightness, "screenValue")

export const brightnessSlider = (): JSX.Element =>
    <box class={"slider"}>
        <button><image iconName={"display-brightness-symbolic"} /></button>
        <slider
            sensitive={enabled}
            hexpand={true}
            value={bvalue}
            min={0}
            max={1}
            onChangeValue={({ value }) => { brightness.screenValue = value; }}
        />
    </box>;
