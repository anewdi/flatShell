<img width="1920" height="1200" alt="preview" src="https://github.com/user-attachments/assets/f77258d8-6a44-4953-ad5b-ead728459ec4" />

Bar and widgets made with ags. 

Wallpaper can be found [here](https://github.com/anewdi/wallz) (mtfuji.png)

## Requirements

Below is a list of requirements for the specific widgets/functions to work as intended
* *: [moreWaita](https://github.com/somepaulo/MoreWaita) icons is pretty nice for stuff like spotify icon.
* Wifi: `networkmanager`, `nm-applet`(for authentication window)
* Workspaces: `hyprland`
* Keymap: `jq`, `hyprland` - reacts to external changes automatically and cycles on click.
* Notifications: No other notification daemon running
* Bluetooth: `bluez`
* Sound: `playerctl`, `wireplumber` as audio backend on system
* Powerprofiles: `power-profiles-daemon`
* Recorder: `wf-recorder`
* Nightlight: Should work with (stop/start/status) any systemd user service named "nightlight". Obviously you can also change this in the code.

### Gnome control center
`gnome-control-center` is neccessary for settings icon to work. On any given widget it tries to open gnome control center at the section corresponding to the widget function(bluetooth widget -> gnome bluetooth page). 

#### Gnome control center bluetooh
For gnome bluetooth to work you need to have `gsd-rfkill` running. It is a part of `gnome-settings-daemon`. Personally, I have a systemd user service that launches it along with my graphical environement: 
```
[Install]
WantedBy=graphical-session.target

[Service]
BusName=org.gnome.SettingsDaemon.Rfkill
ExecStart=/nix/store/ra1chwq2ipg109gqsh7vgm8wfrmh6v6s-gnome-settings-daemon-47.2/libexec/gsd-rfkill #Replace with correct path for your package manager/distro
Restart=on-failure
TimeoutStopSec=5
Type=dbus

[Unit]
Description=Gnome RFKill support service
```

## Widgets
* `./src/popup`: The interactable windows are toggled by buttons on bar.
* `./src/overlays`: Windows that are automatically overlaid on certain signals. May be interactable.

I have two types of powermenu, `powermenuwindow` and `powermenuRightWindow`. On my setup i use both. One on the right for activation from the control center, and one centered which i activate with a keybind(hyprland): `$mainMod, ESCAPE, exec, ags -r "togglePopup('powermenu')"'`

If you do not want firefox to show in media playing widget (and dont want to change the code), you can set the following setting in firefox(about:config): `media.hardwaremediakeys.enabled = false`

## Video preview
https://github.com/user-attachments/assets/ad95d2f4-4b5b-40ff-baf3-4bbbffe0ca25
