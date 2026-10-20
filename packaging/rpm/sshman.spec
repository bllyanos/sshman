# Built on COPR with "Enable internet access during builds": npm packages
# and Go modules are downloaded in %%build.

# stripped Go binary, nothing for debuginfo to extract
%global debug_package %{nil}

# Fedora's Go defaults to GOTOOLCHAIN=local; allow fetching the version go.mod asks for
%global go_env GOTOOLCHAIN=auto CGO_ENABLED=1

Name:           sshman
Version:        0.1.0
Release:        1%{?dist}
Summary:        Neo-brutalist desktop app for managing ~/.ssh/config

License:        MIT
URL:            https://github.com/bllyanos/sshman
Source0:        %{name}-%{version}.tar.gz

ExclusiveArch:  x86_64 aarch64

BuildRequires:  golang
BuildRequires:  nodejs >= 20
BuildRequires:  npm
BuildRequires:  gcc
BuildRequires:  pkgconfig(gtk4)
BuildRequires:  pkgconfig(webkitgtk-6.0)
BuildRequires:  desktop-file-utils

Recommends:     openssh-clients

%description
sshman lists, searches, creates, edits and deletes Host entries in
~/.ssh/config, copies the ssh command and opens connections in an external
terminal (kitty, konsole, ghostty, alacritty, wezterm, foot, ptyxis,
gnome-terminal or xterm). Untouched lines of the config are preserved
byte-for-byte and the previous file is kept as ~/.ssh/config.bak.

%prep
%autosetup

%build
pushd frontend
npm ci --no-audit --no-fund
npm run build
popd
%{go_env} CGO_CFLAGS="%{optflags}" CGO_LDFLAGS="%{build_ldflags}" \
  go build -tags production -trimpath -buildvcs=false -buildmode=pie \
  -ldflags "-s -w" -o %{name} .

%check
%{go_env} go test ./internal/... ./services/...

%install
install -Dpm 0755 %{name} %{buildroot}%{_bindir}/%{name}
install -Dpm 0644 build/appicon.svg %{buildroot}%{_datadir}/icons/hicolor/scalable/apps/%{name}.svg
cp build/linux/desktop %{name}.desktop
desktop-file-install --dir=%{buildroot}%{_datadir}/applications \
  --set-key=Exec --set-value=%{name} %{name}.desktop

%files
%license LICENSE
%doc README.md
%{_bindir}/%{name}
%{_datadir}/applications/%{name}.desktop
%{_datadir}/icons/hicolor/scalable/apps/%{name}.svg

%changelog
* Tue Oct 20 2026 Billy Editiano <bllyanos@gmail.com> - 0.1.0-1
- Initial package
