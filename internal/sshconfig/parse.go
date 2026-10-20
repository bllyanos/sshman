package sshconfig

import "strings"

// Parse reads ssh_config text. It never fails: lines it does not
// understand are kept verbatim.
func Parse(text string) *Document {
	doc := &Document{finalNewline: strings.HasSuffix(text, "\n")}
	if text == "" {
		return doc
	}
	text = strings.TrimSuffix(text, "\n")

	var cur *block
	for _, line := range strings.Split(text, "\n") {
		key, _, ok := splitDirective(line)
		if ok && (strings.EqualFold(key, "Host") || strings.EqualFold(key, "Match")) {
			cur = &block{}
			doc.blocks = append(doc.blocks, cur)
		}
		if cur == nil {
			doc.preamble = append(doc.preamble, line)
			continue
		}
		cur.lines = append(cur.lines, line)
	}

	for _, b := range doc.blocks {
		b.splitTrailing()
		b.host = parseHost(b.lines)
	}
	return doc
}

func (b *block) splitTrailing() {
	end := len(b.lines)
	for end > 1 {
		if _, _, ok := splitDirective(b.lines[end-1]); ok {
			break
		}
		end--
	}
	b.trailing = append([]string(nil), b.lines[end:]...)
	b.lines = b.lines[:end]
}

func parseHost(lines []string) *Host {
	key, value, _ := splitDirective(lines[0])
	if !strings.EqualFold(key, "Host") {
		return nil
	}
	h := &Host{Alias: value, ReadOnly: isPattern(value), Options: []Option{}}
	seen := map[string]bool{}
	for _, line := range lines[1:] {
		k, v, ok := splitDirective(line)
		if !ok {
			continue
		}
		if isModeledKey(k) {
			if !seen[strings.ToLower(k)] { // ssh uses the first value
				seen[strings.ToLower(k)] = true
				setModeled(h, k, unquote(v))
			}
			continue
		}
		h.Options = append(h.Options, Option{Key: k, Value: v})
	}
	return h
}

func setModeled(h *Host, key, value string) {
	switch strings.ToLower(key) {
	case strings.ToLower(keyHostName):
		h.HostName = value
	case strings.ToLower(keyUser):
		h.User = value
	case strings.ToLower(keyPort):
		h.Port = value
	case strings.ToLower(keyIdentityFile):
		h.IdentityFile = value
	}
}
