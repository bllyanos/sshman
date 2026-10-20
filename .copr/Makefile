# COPR "make_srpm" entry point: make -f .copr/Makefile srpm outdir=<dir> spec=<spec>
# Packs HEAD into the Source0 tarball and builds the SRPM from it.

spec ?= packaging/rpm/sshman.spec
outdir ?= .
topdir := $(shell mktemp -d)

.PHONY: srpm
srpm:
	command -v git >/dev/null && command -v rpmbuild >/dev/null || dnf -y install git rpm-build
	version=$$(rpmspec -q --srpm --qf "%{version}" $(spec)) && \
	git -c safe.directory="*" archive --prefix=sshman-$$version/ -o $(topdir)/sshman-$$version.tar.gz HEAD && \
	rpmbuild -bs --define "_topdir $(topdir)" --define "_sourcedir $(topdir)" --define "_srcrpmdir $(outdir)" $(spec)
	rm -rf $(topdir)
