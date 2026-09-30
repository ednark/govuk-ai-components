# AGENTS.md — GOV.UK AI Components

## What This Is

A structured component knowledge base for AI coding agents building UK government services with the GOV.UK Design System. 41 component tiles across 29 component families, with categorized adaptation metadata (schema v2), coordination metadata, pattern recipes, and compliance facts (PSBAR 2018 / WCAG 2.2 AA / GDS Service Standard).

## How to Query This Registry

1. **Manifest:** https://raw.githubusercontent.com/ednark/govuk-ai-components/main/agents.json
2. **Index:** https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/components.index.json
3. **Facets:** https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/facets.json
4. **Tile pattern:** https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/{file}

## Workflow

1. Fetch the index (lean, no prose — discovery facets + lean summaries only)
2. Filter in code by section, gdsComponentType, requiresJs, a11y, govCompliance, costTier, prerequisites, compositionRecipes
3. **Recipe check:** if the task matches a published pattern (ask-users-for-information, check-answers-flow, error-summary-flow, task-list-pattern, page-template), fetch `infinite/recipes/{name}.json` instead of composing manually
4. Fetch only the chosen tiles
5. Parse the `govuk-agent-meta` JSON block inside each tile
6. Check `_schemaVersion` — v2 tiles have categorized metadata:
   - `discovery` — facets (already in index; includes `compliance` and `mobileUX` blocks, tile-side)
   - `selection` — `useWhen` / `avoidWhen` (confirm component fits the task)
   - `instruction` — `agentPrompt` (follow this guidance)
   - `coordination` — `prerequisiteComponents` / `incompatibleWith` / `compositionCost` / `agentPromptSequence` / `compositionRecipes` (plan before composing; lean summaries are also in the index)
   - `constraints` — `preserve` / `editable` / `limitations` / `portableInvariants` (enforce these boundaries)
   - `portability` — `classMapping` for cross-registry class substitution (uswds)
7. Adapt following `instruction.agentPrompt` within `constraints` boundaries
8. Verify all `constraints.preserve` elements are intact in output

## GOV.UK-Specific Rules

- **GOV.UK deliberately ships no card component** — do not invent one. For content that other systems render as cards, use task-list, summary-list, or heading+link patterns (see the declared gap in registry.config.json)

- Every input sits inside a `govuk-form-group` — fetch `form-group` first (see `coordination.prerequisiteComponents`)
- Every validation-failure state includes `error-summary` at the top of the page
- One question per page; the question text is the label and the h1
- Error messages start with visually-hidden "Error:" and link from `aria-describedby`
- There is **no calendar component** — dates are three separate fields (this is deliberate GOV.UK UX; do not add a date picker)
- Use WCAG 2.2 AA (not 2.1) and check `govCompliance` for PSBAR 2018 / GDS Service Standard

## Cross-Registry Transfer

- `portability.classMapping.uswds` maps simple cases (button, text-input, select, notification-banner, table, breadcrumbs, tag)
- `compatibility.json` holds family-level maps with mismatch notes (structural entries are advisory only — never fabricate translations)
- Validate all output against `constraints.portableInvariants`

## MCP Server

`node _base/mcp/server.mjs` (or `npm run mcp`) — 9 tools:
`search_components`, `get_component`, `list_facets`, `get_index`, `get_adapter`,
`translate_component`, `get_recipe`, `query_compliance`, `get_versions`

CLI: `node _base/validate-registry.mjs` (lint), `--conformance .` (certification)


## Quality gates and declared gaps

Do not retrieve or deploy a component that:

- Has `costTier: "expensive"` unless the task explicitly requires the richer behavior
- Has `requiresJs: "required"` when the delivery context has no JavaScript
- Whose `constraints.knownLimitations` block the delivery context
- Implements a concept declared in `gaps` (registry.config.json) — use the gap's nearestAlternative; never invent component-style classes
- Needs layout or typography classes outside the tiles — use `infinite/core-classes.json`

Registry mandates that act as gates:

- GOV.UK deliberately ships no card component — use task-list, summary-list, or heading+link patterns (see declared gaps)
- Use WCAG 2.2 AA / PSBAR 2018 compliance facts, not generic WCAG 2.1
- One question per page; pair error-summary with every failing form

## Constraint Priority

1. `constraints.preserve` — NEVER modify
2. `constraints.limitations` — respect
3. `instruction.agentPrompt` — adapt within boundaries
4. `constraints.editable` — prefer

## Version Sync

This registry is a faithful snapshot of **GOV.UK Design System / govuk-frontend
6.5.1** (`designSystem.version`), installed as an **exact** devDependency and
declared to `staticView.classCheck` so class drift is caught automatically.

**Two-axis verification** (introduced 2026-09-29 — important when checking this
registry):
- **markup** ground truth = the `.njk` component templates in the package
- **styling** ground truth = `dist/govuk/govuk-frontend.min.css`

A class can be **canonical markup with no CSS rules** — `govuk-table__head`,
`__row` and `__body` are in the v6 templates but carry no styles (v4+ styles
`__header`/`__cell`). A CSS-only check misreads these as drift, so verify
against the templates before "correcting" a tile.

`staticView.classCheck.allowlist` is the **drift register**, in three
categories: canonical-but-unstyled, publishing-frontend app layer (L6), and
pre-v4 drift pending rework.

**Upgrading govuk-frontend**: follow the runbook in `_base/protocol.md`.


## Before you change a tile: read the findings ledger

`infinite/findings.json` is this registry's epistemic record — what was tested,
what broke, and what changed. It is the highest-leverage file here for one
reason: it records the fixes, so they do not get undone by an agent that reads
a drift register without knowing it is a register.

Check the ledger before:
- editing a tile body (a pre-migration class is not a gap — `changed` says so)
- removing a class from the classCheck allowlist (it may be canonical markup the
  stylesheet simply does not style)
- changing an `origin` label, a stamp, or a `gaps` entry
- retiring a family (it may be deprecated upstream rather than unused)

A summary is generated at `registry-health.json` under `findings`, including
`openItems` — findings that broke something and have no recorded change.
Those are the open items; they should be closed with a fix, or re-scoped.
See `_base/findings-ledger.md` for the schema.
