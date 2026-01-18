import { Gtk } from "ags/gtk4";
import Mpris from "gi://AstalMpris";
import Pango from "gi://Pango?version=1.0";
import { createBinding, For } from "gnim";

const mpris = Mpris.get_default();

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
    <box orientation={Gtk.Orientation.VERTICAL} class={"singlePlayer"}>
        <overlay>
            <overlay>
                <box
                    vexpand={true}
                    class="coverArt"
                    css={createBinding(player, "coverArt")(path => `background-image: url("file://${path}");`)}
                />
                <box
                    $type="overlay"
                    class={"coverDesc"}
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    <box >
                        <label
                            halign={Gtk.Align.START}
                            class={"title"}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={createBinding(player, "title")}
                        />
                        <image
                            halign={Gtk.Align.END}
                            hexpand={true}
                            iconName={createBinding(player, "entry")(e => e == "zen" ? "firefox-symbolic" : e + "-symbolic")}
                        />
                    </box>
                    <box>
                        <label
                            halign={Gtk.Align.START}
                            class={"artist"}
                            label={createBinding(player, "artist")}
                            wrap={true}
                        />
                    </box>
                    <centerbox vexpand={true} valign={Gtk.Align.END}>
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
            onChangeValue={({ value }) => { player.position = value * player.length }}
            visible={createBinding(player, "length")(l => l > 0)}
            value={createBinding(player, "position")(p => p / player.length > 0 ? p / player.length : 0)}
        />
    </box>

const players = createBinding(mpris, "players");
const visible = players(p => p.length > 0);

export const mediaplayer = (showWhenNotPlaying: boolean = false) =>
    <Gtk.Stack
        visible={showWhenNotPlaying || visible}
        visible_child_name={visible(v => v ? "playing" : "nothingPlaying")}
        transition_type={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
        transition_duration={100}
        class={"mediaplayer"}
    >
        <box $type="named" name={"nothingPlaying"}>
            <box
                vexpand={true}
                hexpand={true}
                orientation={Gtk.Orientation.VERTICAL}
                valign={Gtk.Align.CENTER}
                halign={Gtk.Align.CENTER}
                spacing={5}
            >
                <image icon_name={"audio-x-generic-symbolic"} />
                <label label={"Nothing playing"} />
            </box>
        </box>
        <box
            $type="named"
            name={"playing"}
            orientation={Gtk.Orientation.VERTICAL}
            spacing={8}
            hexpand={true}
        >
            <For each={players}>
                {(item, _) => mplayer(item)}
            </For>
        </box>
    </Gtk.Stack>

