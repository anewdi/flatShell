import { monitorFile } from "ags/file";
import { exec, execAsync } from "ags/process";
import GObject, { getter, register, setter, } from "gnim/gobject";
import Hyprland from "gi://AstalHyprland?version=0.1";

const get = (args: string) => Number(exec(`brightnessctl ${args}`))

@register()
export default class Brightness extends GObject.Object {
    static instance: Brightness;
    static get_default() {
        if (!this.instance) this.instance = new Brightness();
        return this.instance;
    }

    constructor() {
        super();

        // setup monitor
        const brightness = `/sys/class/backlight/${this.#interface}/brightness`;
        monitorFile(brightness, () => this.#changeBrightness());

        //We remove windows when monitor disabled.
        //Monitoring file does not work properly cause kernel does not modify metadata when changing conents of /device/enabled file.
        Hyprland.get_default().connect("monitor-removed", () => this.#changeEnabled());
        Hyprland.get_default().connect("monitor-added", () => this.#changeEnabled());

        this.#changeBrightness()
        this.#changeEnabled()
    }

    #interface = exec(`sh -c "ls  -w1 /sys/class/backlight | head -1"`);
    #max = get("max")
    #enabled = false;
    #screenValue = 0;


    @setter(Number)
    set screenValue(percent: number) {
        if (percent < 0) percent = 0;

        if (percent > 1) percent = 1;

        execAsync(`brightnessctl set ${percent * 100}% -q`);
    }

    @getter(Number)
    get screenValue() {
        return this.#screenValue;
    }

    @getter(Boolean)
    get enabled() {
        return this.#enabled;
    }

    #changeEnabled() {
        this.#enabled = exec(
            `cat /sys/class/backlight/${this.#interface}/device/enabled`,
        ) == "enabled";
    }

    #changeBrightness() {
        this.#screenValue = get("get") / this.#max;
    }
}
