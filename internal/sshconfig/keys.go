package sshconfig

import (
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// ListPrivateKeys returns "~/.ssh/<name>" for every file in dir that has a
// matching ".pub" next to it. Key contents are never read.
func ListPrivateKeys(dir, home string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		if os.IsNotExist(err) {
			return []string{}, nil
		}
		return nil, err
	}
	names := map[string]bool{}
	for _, e := range entries {
		names[e.Name()] = !e.IsDir()
	}
	keys := []string{}
	for name, isFile := range names {
		if isFile && !strings.HasSuffix(name, ".pub") && names[name+".pub"] {
			keys = append(keys, tildePath(filepath.Join(dir, name), home))
		}
	}
	sort.Strings(keys)
	return keys, nil
}

func tildePath(p, home string) string {
	if home != "" && strings.HasPrefix(p, home+string(filepath.Separator)) {
		return "~" + p[len(home):]
	}
	return p
}
