---
name: speckit-fix-ci
description: Debug and fix failing GitHub Actions CI checks on the current PR
compatibility: Requires spec-kit project structure with .specify/ directory
metadata:
  author: github-spec-kit
  source: templates/commands/fix-ci.md
---

# Speckit Fix-Ci Skill

Read and follow the instructions in `agents/gh-fix-ci/SKILL.md`.

When running scripts, use paths relative to the project root:
- `python agents/gh-fix-ci/scripts/inspect_pr_checks.py --repo "." --pr "<number>"`
- Add `--json` for machine-friendly output.
