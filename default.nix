{ pkgs ? import <nixpkgs> {} }:
let
in
  pkgs.mkShell {
    buildInputs = [
      pkgs.nodejs_20
    ];

  shellHook = ''
    alias db='docker build . -f Dockerfile -t fridgy:dev'
  '';
  # environment.interactiveShellInit = ''
  #   alias gs='git status'
  # '';
}
