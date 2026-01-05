import { Gtk } from "ags/gtk4";
import Mpris from "gi://AstalMpris";
import { createBinding, For } from "gnim";

const mpris = Mpris.get_default();

const FALLBACK_ICON = "audio-x-generic-symbolic";
const PLAY_ICON = "media-playback-start-symbolic";
const PAUSE_ICON = "media-playback-pause-symbolic";
const PREV_ICON = "media-skip-backward-symbolic";
const NEXT_ICON = "media-skip-forward-symbolic";


function lengthStr(length: number) {
    const min = Math.floor(length / 60);
    const sec = Math.floor(length % 60);
    const sec0 = sec < 10 ? "0" : "";
    return `${min}:${sec0}${sec}`;
}

const mplayer = (player: Mpris.Player) =>
    <box orientation={Gtk.Orientation.VERTICAL} height_request={160}>
        <overlay>
            <overlay>
                <box
                    vexpand={true}
                    class="coverArt"
                    css={createBinding(player, "coverArt")(path => `background-image: url("file://${path}");`)} />
                <box
                    $type="overlay"
                    vexpand={true}
                    class={"cover"}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <centerbox >
                        <label $type="start" class={"title"} label={createBinding(player, "title")} />
                        <image $type="end" iconName={createBinding(player, "entry")(e => e + "-symbolic")} />
                    </centerbox>
                    <box>
                        <label halign={Gtk.Align.START} class={"artist"} label={createBinding(player, "artist")} />
                    </box>
                    <box vexpand={true}></box>
                    <centerbox valign={Gtk.Align.END}>
                        <label $type="start" label={createBinding(player, "position")(p => lengthStr(p))} />
                        <label $type="end" label={createBinding(player, "length")(l => lengthStr(l))} />
                    </centerbox>
                </box>

            </overlay>
            <box $type="overlay" homogeneous={true} class={"hoverControls"}>
                <button onClicked={() => player.previous()}><image iconName={PREV_ICON} /></button>
                <button onClicked={() => player.play_pause()}>
                    <image iconName={createBinding(player, "playbackStatus")(s => s == Mpris.PlaybackStatus.PLAYING ? PAUSE_ICON : PLAY_ICON)} />
                </button>
                <button onClicked={() => player.next()}><image iconName={NEXT_ICON} /></button>
            </box>
        </overlay>
        <slider
            class={"position"}
            onChangeValue={({ value }) => { player.position = value * player.length }}
            visible={createBinding(player, "length")(l => l > 0)}
            value={createBinding(player, "position")(p => p / player.length > 0 ? p / player.length : 0)}
        />
    </box>

const players = createBinding(mpris, "players");

export const mediaplayer = () =>
    <box class={"mediaplayer"} spacing={8} orientation={Gtk.Orientation.VERTICAL} >
        <For each={players}>
            {(item, index) => mplayer(item)}
        </For>
    </box>

