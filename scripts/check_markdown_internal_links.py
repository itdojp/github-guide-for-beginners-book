#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import re
import sys
from dataclasses import dataclass
from pathlib import Path


LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
FENCE_RE = re.compile(r"^```")


@dataclass(frozen=True)
class LinkFinding:
    source_file: Path
    line_number: int
    raw: str
    target: str


def _strip_title(link_target: str) -> str:
    # Examples:
    # - path/to/file.md
    # - path/to/file.md "title"
    # - <path/to/file.md>
    link_target = link_target.strip()
    if link_target.startswith("<") and link_target.endswith(">"):
        link_target = link_target[1:-1].strip()
    # Split by whitespace to drop optional title portion
    return link_target.split()[0].strip()


def _should_ignore(target: str) -> bool:
    if not target:
        return True
    if "{{" in target or "}}" in target:
        return True
    lowered = target.lower()
    if lowered.startswith("#"):
        return True
    if lowered.startswith("http://") or lowered.startswith("https://"):
        return True
    if lowered.startswith("mailto:") or lowered.startswith("tel:"):
        return True
    return False


def _is_probably_file_path(target: str) -> bool:
    # Only check paths that look like files (have an extension).
    # We intentionally do not try to resolve Jekyll permalinks like `/src/chapter/.../`.
    return bool(re.search(r"\.[a-zA-Z0-9]{1,6}$", target))


def find_links(markdown_file: Path) -> list[LinkFinding]:
    findings: list[LinkFinding] = []
    in_fence = False

    for index, line in enumerate(markdown_file.read_text(encoding="utf-8").splitlines(), start=1):
        if FENCE_RE.match(line.strip()):
            in_fence = not in_fence
            continue
        if in_fence:
            continue

        for match in LINK_RE.finditer(line):
            raw = match.group(0)
            target = _strip_title(match.group(1))
            if _should_ignore(target):
                continue
            if not _is_probably_file_path(target):
                continue

            # Drop fragment
            target = target.split("#", 1)[0]
            if not target:
                continue

            findings.append(
                LinkFinding(
                    source_file=markdown_file,
                    line_number=index,
                    raw=raw,
                    target=target,
                )
            )

    return findings


def resolve_target(source_file: Path, target: str) -> Path | None:
    # Absolute paths within repo are ambiguous for this checker; skip.
    if target.startswith("/"):
        return None
    return (source_file.parent / target).resolve()


def main() -> int:
    parser = argparse.ArgumentParser(description="Check internal file links in Markdown.")
    parser.add_argument("files", nargs="+", help="Markdown files to check")
    args = parser.parse_args()

    repo_root = Path(os.getcwd()).resolve()
    errors: list[str] = []

    for file_arg in args.files:
        md = Path(file_arg)
        if not md.exists():
            errors.append(f"[ERROR] file not found: {file_arg}")
            continue
        if md.suffix.lower() != ".md":
            continue

        for finding in find_links(md):
            resolved = resolve_target(finding.source_file, finding.target)
            if resolved is None:
                continue
            try:
                resolved.relative_to(repo_root)
            except ValueError:
                errors.append(
                    f"{finding.source_file}:{finding.line_number}: link escapes repo: {finding.raw} -> {finding.target}"
                )
                continue

            if not resolved.exists():
                errors.append(
                    f"{finding.source_file}:{finding.line_number}: missing link target: {finding.raw} -> {finding.target}"
                )

    if errors:
        for e in errors:
            print(e, file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
