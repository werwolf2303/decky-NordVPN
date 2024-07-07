steamos-readonly disable
pacman --noconfirm -U nordvpn.pkg.tar.zst
steamos-readonly enable
systemctl enable --now nordvpnd