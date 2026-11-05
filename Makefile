.DEFAULT_GOAL := help
.PHONY: help install

help:
	@echo "Use make install, or pnpm run to list package scripts."

install:
	pnpm install --frozen-lockfile

.PHONY: dev
dev:
	pnpm run dev

.PHONY: build
build:
	pnpm run build

.PHONY: typecheck
typecheck:
	pnpm run typecheck

.PHONY: check
check:
	pnpm run check

.PHONY: setup status
setup:
	pnpm run setup

status:
	pnpm run status
