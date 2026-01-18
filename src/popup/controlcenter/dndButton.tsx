import Notifd from "gi://AstalNotifd";
import { createBinding } from "gnim";

const notifd = Notifd.get_default();
const className = createBinding(notifd, "dont_disturb")(b => b ? "activeButton" : "");
const iName = createBinding(notifd, "dont_disturb")((b: boolean) => b ? "notifications-disabled-symbolic" : "preferences-system-notifications-symbolic");

export const dndButton = () =>
    <button
        class={className}
        onClicked={() => notifd.set_dont_disturb(!notifd.dont_disturb)}
    >
        <box spacing={8}>
            <image
                iconName={iName} />
            <label label={"Do not disturb"} />
        </box>
    </button >
