---
name: speckit-iterate-pr
description: Iterate on a PR until CI passes and review feedback is addressed
compatibility: Requires spec-kit project structure with .specify/ directory
metadata:
  author: github-spec-kit
  source: templates/commands/iterate-pr.md
---

# Speckit Iterate-Pr Skill

Read and follow the instructions in `agents/iterate-pr/SKILL.md`.

When running scripts, use paths relative to the project root:
- `python agents/iterate-pr/scripts/fetch_pr_checks.py [--pr NUMBER]`
- `python agents/iterate-pr/scripts/fetch_pr_feedback.py [--pr NUMBER]`
