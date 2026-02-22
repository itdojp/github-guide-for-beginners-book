#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import subprocess
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path


# NOTE:
# GitHub の diff で警告対象になりやすい bidi 制御文字を検出します。
# 参考: https://www.unicode.org/reports/tr9/
BIDI_CONTROL_CHARS: dict[str, str] = {
    "\u061c": "ARABIC LETTER MARK",
    "\u200e": "LEFT-TO-RIGHT MARK",
    "\u200f": "RIGHT-TO-LEFT MARK",
    "\u202a": "LEFT-TO-RIGHT EMBEDDING",
    "\u202b": "RIGHT-TO-LEFT EMBEDDING",
    "\u202c": "POP DIRECTIONAL FORMATTING",
    "\u202d": "LEFT-TO-RIGHT OVERRIDE",
    "\u202e": "RIGHT-TO-LEFT OVERRIDE",
    "\u2066": "LEFT-TO-RIGHT ISOLATE",
    "\u2067": "RIGHT-TO-LEFT ISOLATE",
    "\u2068": "FIRST STRONG ISOLATE",
    "\u2069": "POP DIRECTIONAL ISOLATE",
}


@dataclass(frozen=True)
class Finding:
    file: Path
    line: int
    col: int
    codepoint: str
    name: str


def _repo_root() -> Path:
    out = subprocess.check_output(["git", "rev-parse", "--show-toplevel"], text=True).strip()
    return Path(out).resolve()


def _tracked_files(repo_root: Path) -> list[Path]:
    out = subprocess.check_output(["git", "-C", str(repo_root), "ls-files", "-z"])
    items = [p for p in out.split(b"\0") if p]
    return [repo_root / Path(p.decode("utf-8")) for p in items]


def _iter_candidate_files(repo_root: Path, paths: list[str]) -> list[Path]:
    if not paths:
        return _tracked_files(repo_root)

    candidates: list[Path] = []
    for p in paths:
        path = (Path(p) if Path(p).is_absolute() else (Path.cwd() / p)).resolve()
        if not path.exists():
            continue
        if path.is_dir():
            for child in sorted(path.rglob("*")):
                if child.is_file():
                    candidates.append(child)
            continue
        if path.is_file():
            candidates.append(path)

    # De-dup while keeping order
    seen: set[Path] = set()
    uniq: list[Path] = []
    for c in candidates:
        if c in seen:
            continue
        seen.add(c)
        uniq.append(c)
    return uniq


def scan_file(path: Path) -> list[Finding]:
    try:
        with path.open("rb") as f:
            head = f.read(8192)
            if b"\0" in head:
                return []
    except OSError:
        return []

    findings: list[Finding] = []
    try:
        with path.open("r", encoding="utf-8") as f:
            for line_no, line in enumerate(f, start=1):
                for col_no, ch in enumerate(line, start=1):
                    desc = BIDI_CONTROL_CHARS.get(ch)
                    if desc is None:
                        continue
                    codepoint = f"U+{ord(ch):04X}"
                    name = unicodedata.name(ch, desc)
                    findings.append(
                        Finding(
                            file=path,
                            line=line_no,
                            col=col_no,
                            codepoint=codepoint,
                            name=name,
                        )
                    )
    except (UnicodeDecodeError, OSError):
        return []

    return findings


def _print_finding(repo_root: Path, finding: Finding, github_actions: bool) -> None:
    try:
        rel = finding.file.resolve().relative_to(repo_root)
    except ValueError:
        rel = finding.file

    message = f"bidi control character detected: {finding.codepoint} ({finding.name})"
    if github_actions:
        # https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message
        print(f"::error file={rel},line={finding.line},col={finding.col}::{message}")
        return
    print(f"{rel}:{finding.line}:{finding.col}: {message}", file=sys.stderr)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Fail if tracked files contain hidden/bidirectional Unicode control characters."
    )
    parser.add_argument("paths", nargs="*", help="Optional files/dirs to scan (default: tracked files)")
    args = parser.parse_args()

    repo_root = _repo_root()
    candidates = _iter_candidate_files(repo_root, args.paths)

    github_actions = os.getenv("GITHUB_ACTIONS", "").lower() == "true"
    all_findings: list[Finding] = []

    for path in candidates:
        all_findings.extend(scan_file(path))

    if not all_findings:
        return 0

    for f in all_findings:
        _print_finding(repo_root, f, github_actions=github_actions)

    print(
        f"Found {len(all_findings)} bidi control character(s). Remove them and retry.",
        file=sys.stderr,
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())

