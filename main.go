package main

import (
	"embed"
	"log"
	"os"

	"github.com/wailsapp/wails/v3/pkg/application"

	"sshman/internal/sshconfig"
	"sshman/internal/terminal"
	"sshman/services"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	home, err := os.UserHomeDir()
	if err != nil {
		log.Fatal(err)
	}
	configPath, err := sshconfig.DefaultPath()
	if err != nil {
		log.Fatal(err)
	}

	app := application.New(application.Options{
		Name:        "sshman",
		Description: "SSH config manager",
		Services: []application.Service{
			application.NewService(services.NewHostService(sshconfig.Store{Path: configPath}, home)),
			application.NewService(services.NewTerminalService(terminal.Launcher{Dir: home})),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            "sshman",
		Width:            1120,
		Height:           720,
		MinWidth:         820,
		MinHeight:        520,
		BackgroundColour: application.NewRGB(255, 253, 245),
		URL:              "/",
	})

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
