package sshconfig

import "strings"

const defaultIndent = "    "

// Render turns the document back into ssh_config text.
func (d *Document) Render() string {
	var out []string
	out = append(out, d.preamble...)
	for _, b := range d.blocks {
		if b.dirty {
			out = append(out, renderHost(*b.host, indentOf(b.lines))...)
		} else {
			out = append(out, b.lines...)
		}
		out = append(out, b.trailing...)
	}
	text := strings.Join(out, "\n")
	if len(out) > 0 && d.finalNewline {
		text += "\n"
	}
	return text
}

func renderHost(h Host, indent string) []string {
	lines := []string{"Host " + h.Alias}
	add := func(k, v string) {
		if v != "" {
			lines = append(lines, indent+k+" "+v)
		}
	}
	add(keyHostName, h.HostName)
	add(keyUser, h.User)
	add(keyPort, h.Port)
	add(keyIdentityFile, quoteIfNeeded(h.IdentityFile))
	for _, o := range h.Options {
		add(o.Key, o.Value)
	}
	return lines
}

// indentOf reuses the indentation of an existing block body.
func indentOf(lines []string) string {
	for _, l := range lines[1:] {
		if _, _, ok := splitDirective(l); ok {
			if n := len(l) - len(strings.TrimLeft(l, " \t")); n > 0 {
				return l[:n]
			}
			return ""
		}
	}
	return defaultIndent
}
