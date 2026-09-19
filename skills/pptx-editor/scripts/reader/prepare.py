#!/usr/bin/env python3
"""Prepare all reader artefacts for one presentation.

Generates, by default (if missing):
- {stem}.md
- {stem}-thumbnails*.jpg
- {stem}-unpacked/_index.json

Usage:
    python prepare.py resources/template.pptx
    python prepare.py resources/template.pptx --force
"""

import argparse
import subprocess
import sys
from pathlib import Path

# Only these executables may be invoked by this script. sys.executable is
# always allowed since it re-enters our own trusted Python interpreter.
ALLOWED_BINARIES = {"markitdown"}


def _run(cmd: list[str], error_message: str) -> subprocess.CompletedProcess[str]:
    binary = cmd[0]
    if binary != sys.executable and Path(binary).stem not in ALLOWED_BINARIES and binary not in ALLOWED_BINARIES:
        raise ValueError(f"Refusing to run unapproved binary: {binary}")
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=False)
    if result.returncode != 0:
        # Truncate to keep error output bounded and avoid echoing unbounded
        # subprocess output; never reused to build further commands/paths.
        stderr = result.stderr.strip()[:2000]
        stdout = result.stdout.strip()[:2000]
        details = stderr or stdout or "No error output available."
        raise RuntimeError(f"{error_message}\n{details}")
    return result


def _generate_markdown(src: Path, output_md: Path, force: bool) -> str:
    if output_md.exists() and not force:
        return f"SKIP {output_md} [already existed]"

    result = _run(
        [sys.executable, "-m", "markitdown", str(src)],
        "markitdown extraction failed.",
    )
    output_md.write_text(result.stdout, encoding="utf-8")
    return f"OK   {output_md} [generated]"


def _generate_thumbnails(src: Path, thumbnail_script: Path, prefix: Path, force: bool) -> str:
    existing = sorted(prefix.parent.glob(f"{prefix.name}*.jpg"))
    if existing and not force:
        return f"SKIP {prefix}*.jpg [{len(existing)} file(s) already existed]"

    _run(
        [sys.executable, str(thumbnail_script), str(src), str(prefix)],
        "Thumbnail generation failed.",
    )
    generated = sorted(prefix.parent.glob(f"{prefix.name}*.jpg"))
    if not generated:
        raise RuntimeError(f"Thumbnail generation completed but no files were produced for {prefix}*.jpg")
    return f"OK   {prefix}*.jpg [{len(generated)} file(s) generated]"


def _generate_unpacked(src: Path, unpack_script: Path, unpack_dir: Path, force: bool) -> str:
    index_file = unpack_dir / "_index.json"
    if index_file.exists() and not force:
        return f"SKIP {index_file} [already existed]"

    if unpack_dir.exists() and force:
        for child in sorted(unpack_dir.rglob("*"), reverse=True):
            if child.is_file():
                child.unlink()
            else:
                child.rmdir()

    _run(
        [sys.executable, str(unpack_script), str(src), str(unpack_dir)],
        "Unpack failed.",
    )
    if not index_file.exists():
        raise RuntimeError(f"Unpack completed but inventory index was not created: {index_file}")
    return f"OK   {index_file} [generated]"


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Prepare markdown, thumbnails, and unpacked XML for a presentation."
    )
    parser.add_argument("input", help="Input .pptx file")
    parser.add_argument(
        "--force",
        action="store_true",
        help="Regenerate artefacts even when they already exist.",
    )
    args = parser.parse_args()

    src = Path(args.input)
    if not src.is_file() or src.suffix.lower() != ".pptx":
        sys.exit(f"Error: expected a .pptx file, got: {src}")

    stem_base = src.with_suffix("")
    output_md = stem_base.with_suffix(".md")
    thumbnail_prefix = src.parent / f"{src.stem}-thumbnails"
    unpack_dir = src.parent / f"{src.stem}-unpacked"

    scripts_dir = Path(__file__).resolve().parent
    unpack_script = scripts_dir / "unpack.py"
    thumbnail_script = scripts_dir / "thumbnail.py"

    report: list[str] = []
    try:
        report.append(_generate_markdown(src, output_md, args.force))
        report.append(
            _generate_thumbnails(src, thumbnail_script, thumbnail_prefix, args.force)
        )
        report.append(_generate_unpacked(src, unpack_script, unpack_dir, args.force))
    except RuntimeError as exc:
        sys.exit(f"Error: {exc}")

    print(f"Prepared artefacts for {src.name}:")
    for line in report:
        print(f"  {line}")


if __name__ == "__main__":
    main()
