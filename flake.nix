{
  outputs =
    {
      self,
      nixpkgs,
      ags,
      astal,
      gtksave,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
      commonPkgs = with astal.packages.${system}; [
        hyprland
        io
        battery
        network
        wireplumber
        bluetooth
        powerprofiles
        notifd
        mpris
        astal4
        pkgs.libadwaita
      ];
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        version = "2.0.0";
        pname = "flatShell";
        src = ./.;

        nativeBuildInputs = with pkgs; [
          wrapGAppsHook3
          gobject-introspection
          ags.packages.${system}.default
        ];

        buildInputs = [
          pkgs.gjs
          pkgs.glib
        ]
        ++ commonPkgs;

        installPhase = ''
          mkdir -p $out/bin
          ags bundle -g 4 app.tsx $out/bin/flatShell 
        '';

        preFixup = ''
          gappsWrapperArgs+=(
            --prefix PATH : ${
              pkgs.lib.makeBinPath (
                with pkgs;
                [
                  gtksave.packages.${system}.default
                  jq
                  wf-recorder
                  networkmanagerapplet
                  playerctl
                ]
              )
            }
          )
        '';
      };

      devShells.${system} = {
        default = pkgs.mkShell {
          buildInputs = [
            (ags.packages.${system}.default.override {
              extraPackages = commonPkgs;
            })
            pkgs.prettierd
            pkgs.typescript-language-server
          ];
        };
      };
    };

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:Aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    astal = {
      url = "github:Aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    gtksave = {
      url = "github:anewdi/gtksave";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
}
