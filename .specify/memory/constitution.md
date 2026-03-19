<!--
Sync Impact Report
===================
- Version change: 0.0.0 → 1.0.0
- Modified principles: N/A (initial constitution)
- Added sections:
  - Core Principles (5): Data Provenance, Research-Backed Claims,
    Publication-Grade Quality, Audience Clarity, Reproducibility
  - Data Standards
  - Publication Workflow
  - Governance
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no update needed
    (Constitution Check section is generic, will be filled per-feature)
  - .specify/templates/spec-template.md — ✅ no update needed
    (requirements structure accommodates data-source traceability)
  - .specify/templates/tasks-template.md — ✅ no update needed
    (phase structure supports data collection + validation phases)
- Follow-up TODOs: None
-->

# Mexico Trade Metro Map Constitution

## Core Principles

### I. Data Provenance

Every data point displayed on the map MUST trace to an
authoritative, citable source. Raw data files MUST be preserved
in their original form alongside any transformed derivatives.

- All trade volumes, crossing counts, and tonnage figures MUST
  reference a specific dataset, year, and issuing authority
- Source metadata (URL, access date, dataset version) MUST be
  recorded for every data file ingested
- When multiple sources conflict, the discrepancy MUST be
  documented and the chosen value justified

### II. Research-Backed Claims

No statistic, ranking, or trend assertion MAY appear in any
publishable artifact without a verifiable citation.

- Citations MUST reference primary sources (BTS, ARTF, SCT/SICT,
  railroad operator reports) over secondary reporting
- Derived metrics (e.g., percentage shares, year-over-year growth)
  MUST show the calculation and underlying figures
- Claims about infrastructure status (e.g., "under construction",
  "modernization underway") MUST include a date of verification
  and source

### III. Publication-Grade Quality

All artifacts — maps, data tables, interactive visualizations —
MUST meet a standard suitable for professional publication
(slide decks, reports, media use).

- Visual outputs MUST be produced in scalable vector format (SVG)
  with a print-resolution PDF export option
- Typography, color, and layout MUST follow the project's design
  system; no default-styled or unstyled outputs
- Bilingual labeling (Spanish station names, bilingual legend)
  MUST be present on every published map artifact
- Every published artifact MUST include a visible data-date
  annotation (e.g., "Data: BTS 2025, ARTF 2024")

### IV. Audience Clarity

The map exists to make trade infrastructure legible to
non-specialists. Clarity for the broadest audience MUST take
precedence over completeness or technical precision.

- Schematic layout MUST prioritize readability over geographic
  accuracy, following the Beck/Tube-map tradition
- Visual weight (station size, line thickness) MUST encode trade
  volume so that relative scale is intuitive without reading a
  legend
- Jargon MUST be avoided in user-facing labels; technical terms
  (e.g., "intermodal", "breakbulk") MUST include a glossary
  entry when used

### V. Reproducibility

Any collaborator MUST be able to regenerate every derived artifact
from source data using documented steps.

- Data transformation scripts MUST be committed alongside the data
  they produce
- A single command or documented sequence MUST regenerate all
  derived data files and map outputs from raw sources
- Environment dependencies MUST be declared explicitly (e.g.,
  lockfile, Dockerfile, or equivalent)

## Data Standards

- **Canonical sources**: BTS Transborder Freight Data, BTS Border
  Crossing Data, ARTF rail tonnage reports, SCT/SICT highway
  traffic counts, Ferromex and CPKC freight disclosures
- **Data currency**: Published artifacts MUST use the most recent
  full-year dataset available at time of release; the data year
  MUST be stated on every artifact
- **Units**: Trade values in USD; weights in metric tonnes; counts
  as integers. Currency values MUST state whether nominal or
  inflation-adjusted
- **File formats**: Raw data preserved as-is (CSV, XLSX, JSON);
  cleaned/transformed data stored as CSV with a companion
  data-dictionary markdown file

## Publication Workflow

- **Peer review**: Every publishable artifact MUST be reviewed by
  at least one person other than its author before release
- **Fact-check gate**: Before any artifact is published, all cited
  figures MUST be spot-checked against their primary source
- **Versioning**: Published artifacts MUST carry a version number;
  corrections to published data MUST increment the version and
  include a changelog entry
- **License**: A license MUST be selected and applied before first
  public release of any artifact

## Governance

This constitution is the highest-authority document for the
Mexico Trade Metro Map project. All specifications, plans, and
task lists MUST comply with these principles.

- **Amendments**: Any change to this constitution MUST be
  documented with a rationale, reviewed, and reflected in an
  updated version number
- **Versioning policy**: MAJOR for principle removal or
  redefinition; MINOR for new principles or material expansion;
  PATCH for clarifications and wording fixes
- **Compliance review**: Each specification and plan MUST include
  a Constitution Check section verifying alignment with these
  principles before implementation begins

**Version**: 1.0.0 | **Ratified**: 2026-03-19 | **Last Amended**: 2026-03-19
