package sshconfig

// Document is a parsed ssh_config that can be rendered back with every
// untouched line preserved byte-for-byte.
type Document struct {
	preamble     []string // lines before the first Host/Match block
	blocks       []*block
	finalNewline bool
}

type block struct {
	lines    []string // header + body, as read from disk
	trailing []string // blank lines and comments after the last directive
	host     *Host    // nil for Match blocks
	dirty    bool     // host was changed and lines must be regenerated
}

// Hosts returns every Host block in file order.
func (d *Document) Hosts() []Host {
	hosts := make([]Host, 0, len(d.blocks))
	for _, b := range d.blocks {
		if b.host != nil {
			hosts = append(hosts, cloneHost(*b.host))
		}
	}
	return hosts
}

func cloneHost(h Host) Host {
	h.Options = append([]Option(nil), h.Options...)
	if h.Options == nil {
		h.Options = []Option{}
	}
	return h
}
