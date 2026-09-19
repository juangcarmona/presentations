# Scripts reference

All scripts run through **`uv run --no-project`** so they use an isolated, uv-managed
interpreter instead of the global Python. The runtime composition scripts use only the
standard library (no `--with` needed); scripts that need third-party packages add `--with`
to resolve them per-run into a throwaway environment.

| Script | Usage |
|--------|-------|
| `scripts/unpack.py` | `uv run --no-project python scripts/unpack.py input.pptx output-dir/` |
| `scripts/add_slide.py` | `uv run --no-project python scripts/add_slide.py unpacked/ slide3.xml` |
| `scripts/clean.py` | `uv run --no-project python scripts/clean.py unpacked/` |
| `scripts/pack.py` | `uv run --no-project python scripts/pack.py unpacked/ output.pptx [--original template.pptx]` |
| `scripts/replace_placeholders.py` | `uv run --no-project python scripts/replace_placeholders.py unpacked/ mappings.json` |
| `scripts/validate.py` | `uv run --no-project python scripts/validate.py unpacked/` |
| `scripts/qa.py` | `uv run --no-project python scripts/qa.py output.pptx` |
| `scripts/list_rids.py` | `uv run --no-project python scripts/list_rids.py unpacked/` |
| `scripts/plan.py` | `uv run --no-project python scripts/plan.py manifest.json digest.json slide-plan.json` (Workflow C) |
| `scripts/compose.py` | `uv run --no-project python scripts/compose.py slide-plan.json content-blocks.json template-dir/ out-dir/ [--pack]` (Workflow C) |
| `scripts/fill_blueprint.py` | `uv run --no-project python scripts/fill_blueprint.py blueprints/{layout}/ content.json [out.xml]` (Workflow C) |
| `scripts/compose_free.py` | `uv run --no-project python scripts/compose_free.py slide-plan.json content-blocks.json template-dir/ out-dir/ [--pack]` (freestyle mode: strips the master's slides and inserts blueprints) |
| `scripts/setup/build_blueprints.py` | `uv run --no-project python scripts/setup/build_blueprints.py [layout_hint ...]` (one-time) |
| `scripts/setup/inspect_slide.py` | `uv run --no-project python scripts/setup/inspect_slide.py master slideN.xml` (one-time, authoring specs) |
| `scripts/setup/run_e2e_test.py` | `uv run --no-project --with python-pptx --with Pillow python scripts/setup/run_e2e_test.py` — E2E regression (plan→compose→qa) against `_ai-proposal-test/fixtures/`; exit 0 = pass |
| `scripts/setup/run_e2e_test_free.py` | `uv run --no-project --with python-pptx --with Pillow python scripts/setup/run_e2e_test_free.py` — **freestyle** E2E regression (compose_free→qa + content coverage) against `_ai-freestyle-test/fixtures/`; exit 0 = pass |
