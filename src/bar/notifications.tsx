import Notifd from "gi://AstalNotifd"
import { createBinding } from "gnim";

const notifd = Notifd.get_default();
const iName = createBinding(notifd, "dont_disturb")((b: boolean) => b ? "notifications-disabled-symbolic" : "preferences-system-notifications-symbolic");

export const notifications = (): JSX.Element =>
    <button>
        <image iconName={iName} />
    </button>;

