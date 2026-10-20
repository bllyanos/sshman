package sshconfig

import (
	"errors"
	"fmt"
	"strings"
)

var (
	ErrNotFound  = errors.New("host not found")
	ErrDuplicate = errors.New("host alias already exists")
	ErrReadOnly  = errors.New("host is read-only")
)

// Create adds a new host before the first catch-all "Host *" block so its
// values take precedence (ssh uses the first value it finds).
func (d *Document) Create(h Host) error {
	if err := h.Validate(); err != nil {
		return err
	}
	if d.find(h.Alias) >= 0 {
		return fmt.Errorf("%w: %s", ErrDuplicate, h.Alias)
	}
	h = cloneHost(h)
	h.ReadOnly = false
	nb := &block{host: &h, dirty: true, lines: []string{"Host " + h.Alias}, trailing: []string{""}}

	at := d.catchAllIndex()
	if at < 0 {
		d.ensureSeparatorAtEnd()
		nb.trailing = nil
		d.blocks = append(d.blocks, nb)
		d.finalNewline = true
		return nil
	}
	d.blocks = append(d.blocks[:at], append([]*block{nb}, d.blocks[at:]...)...)
	return nil
}

// Update replaces the host currently named alias.
func (d *Document) Update(alias string, h Host) error {
	if err := h.Validate(); err != nil {
		return err
	}
	i := d.find(alias)
	if i < 0 {
		return fmt.Errorf("%w: %s", ErrNotFound, alias)
	}
	if d.blocks[i].host.ReadOnly {
		return fmt.Errorf("%w: %s", ErrReadOnly, alias)
	}
	if j := d.find(h.Alias); j >= 0 && j != i {
		return fmt.Errorf("%w: %s", ErrDuplicate, h.Alias)
	}
	h = cloneHost(h)
	h.ReadOnly = false
	d.blocks[i].host = &h
	d.blocks[i].dirty = true
	return nil
}

// Delete removes the host block named alias, keeping its trailing comments.
func (d *Document) Delete(alias string) error {
	i := d.find(alias)
	if i < 0 {
		return fmt.Errorf("%w: %s", ErrNotFound, alias)
	}
	if d.blocks[i].host.ReadOnly {
		return fmt.Errorf("%w: %s", ErrReadOnly, alias)
	}
	kept := commentsOnly(d.blocks[i].trailing)
	if i > 0 {
		d.blocks[i-1].trailing = append(d.blocks[i-1].trailing, kept...)
	} else {
		d.preamble = append(d.preamble, kept...)
	}
	d.blocks = append(d.blocks[:i], d.blocks[i+1:]...)
	if i == len(d.blocks) {
		d.trimTrailingBlank()
	}
	return nil
}

func (d *Document) trimTrailingBlank() {
	tail := &d.preamble
	if n := len(d.blocks); n > 0 {
		tail = &d.blocks[n-1].trailing
	}
	for len(*tail) > 0 && strings.TrimSpace((*tail)[len(*tail)-1]) == "" {
		*tail = (*tail)[:len(*tail)-1]
	}
}

// find returns the index of the Host block whose alias matches
// case-insensitively, as ssh does.
func (d *Document) find(alias string) int {
	for i, b := range d.blocks {
		if b.host != nil && strings.EqualFold(b.host.Alias, alias) {
			return i
		}
	}
	return -1
}

func (d *Document) catchAllIndex() int {
	for i, b := range d.blocks {
		if b.host != nil && strings.TrimSpace(b.host.Alias) == "*" {
			return i
		}
	}
	return -1
}

// ensureSeparatorAtEnd adds a blank line before an appended block.
func (d *Document) ensureSeparatorAtEnd() {
	tail := &d.preamble
	if n := len(d.blocks); n > 0 {
		tail = &d.blocks[n-1].trailing
		if len(*tail) == 0 || strings.TrimSpace((*tail)[len(*tail)-1]) != "" {
			*tail = append(*tail, "")
		}
		return
	}
	if len(*tail) > 0 && strings.TrimSpace((*tail)[len(*tail)-1]) != "" {
		*tail = append(*tail, "")
	}
}

func commentsOnly(lines []string) []string {
	var out []string
	for _, l := range lines {
		if strings.HasPrefix(strings.TrimSpace(l), "#") {
			out = append(out, l)
		}
	}
	return out
}
