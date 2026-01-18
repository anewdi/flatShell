<img width="1920" height="1200" alt="preview" src="https://github.com/user-attachments/assets/f77258d8-6a44-4953-ad5b-ead728459ec4" />

Bar and widgets made with ags. 

Wallpaper can be found [here](https://github.com/anewdi/wallz) (mtfuji.png)

The dark mode and accent colors work through gsettings. If you have gnome control center you can change them from there.

## Nix
The project is packaged for nix. You can run the shell with `nix run github:anewdi/flatShell`.
NOTE: Independent programs(`wf-recorder`, `jq`, etc) are included, but you must ensure that the required *services* are avaliable(`networkmanager`, `bluez`, `wireplumber`, etc).

To use it in your system you should first add it to your `flake.nix`, for example: 
```
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    # add flatShell flake
    flatshell{
      url = "github:anewdi/flatShell";
      inputs.nixpkgs.follows = "nixpkgs";
    }
  };

  outputs = { home-manager, nixpkgs, ... }@inputs:
  let
    system = "x86_64-linux";
  in
  {
    homeConfigurations."${username}" = home-manager.lib.homeManagerConfiguration {
      pkgs = import nixpkgs { inherit system; };

      # pass inputs as specialArgs
      extraSpecialArgs = { inherit inputs; };

      # import your home.nix
      modules = [ ./home-manager/home.nix ];
    };
  };
}
```
Then you can either add it to your packages or setup a systemd service: 
```
{ inputs, pkgs, ... }:
{
  #Just add package
  home.packages = [inputs.flatShell.packages.${pkgs.stdenv.hostPlatform.system}.default];

  #Systemd service
  systemd.user.services.nightlight = {
    Unit = {
      Description = "flatShell service";
    };
    Service = {
      ExecStart = "${lib.getExe inputs.flatShell.packages.${pkgs.stdenv.hostPlatform.system}.default}";
      Restart = "on-failure";
    };
    Install.WantedBy = [ "graphical-session.target" ];
  };
}
```

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
* Recorder: `wf-recorder` ([gtksave](https://github.com/anewdi/gtksave) is optional. I just gives fileDialog instead of predefined save location)
* Nightlight: Should work with (stop/start/status) any systemd user service named "nightlight". Obviously you can also change this in the code.
* DarkMode: `gsettings-dekstop-scemas`

### Gnome control center
`gnome-control-center` is neccessary for settings icon to work. On any given widget it tries to open gnome control center at the section corresponding to the widget function(bluetooth widget -> gnome bluetooth page). 

To use gnome-control-center with a windowmanager like `hyprland` you should modify it's desktop entry such that it launches with `env XDG_CURRENT_DESKTOP=gnome` set. This is manually done in the code for the widgets(iow the buttons will work as long as gnome-control-center is installed).

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
