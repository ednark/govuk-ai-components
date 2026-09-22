# GOV.UK AI Components

AI-retrievable component registry for the [GOV.UK Design System](https://design-system.service.gov.uk) — 45 self-contained component tiles across 29 component families, for AI coding agents building UK government services.

Part of a family of registries implementing the [ai-component-registry-spec](https://github.com/ednark/ai-component-registry-spec) protocol ("the components are the database, the retrieval layer is the product").

## What This Is

Every component is a **single self-contained HTML tile**: real GOV.UK markup, inline CSS approximation, and an embedded `govuk-agent-meta` JSON block carrying categorized adaptation metadata (schema v2: discovery / selection / instruction / coordination / constraints / portability). Agents discover components through a lean, filterable index and fetch only what they need — code and instructions travel together in one fetch.

## Quick start (agents)

1. [agents.json](https://raw.githubusercontent.com/ednark/govuk-ai-components/main/agents.json) — machine manifest
2. [components.index.json](https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/components.index.json) — lean discovery index, filter in code
3. `infinite/{file}` — tile: source + embedded metadata
4. [recipes](https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/recipes/index.json) — GOV.UK patterns as atomic fetches
5. [versions.json](https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/versions.json) — version history

MCP: `npm run mcp` (9 tools). Full agent docs: [AGENTS.md](AGENTS.md) · [llms.txt](llms.txt)

## Quick start (humans)

- Browse `infinite/<component>/<variant>.html` in a browser — every tile renders standalone
- [component index](infinite/components.index.json) — every tile, one JSON record each
- Validate: `node _base/validate-registry.mjs`


## Resolved views (appearance)

Tiles are self-contained (component CSS inline), so every tile renders correctly in a plain browser. For design tools, static parsers, and layout-accurate preview, every tile also has a generated **resolved view** sibling: `{variant}.resolved.html` — the tile's DOM with computed geometry, colors, and typography flattened inline. Index records expose the path as the `resolvedView` field. Views carry a SHA-256 stamp of their tile source (the validator warns on stale views) and are validated by importing into third-party design tools — the OpenPencil field test imported all sampled views with full semantic fidelity. Regenerate after tile changes: `node _base/generate-resolved-view.mjs`.

---


## Coverage

**Forms:** form-group, button, text-input, textarea, select, checkboxes, radios, date-input, file-upload, character-count, error-summary
**Navigation:** breadcrumbs, header, footer, back-link, skip-link, phase-banner, tabs, pagination
**Feedback:** alert, inset-text, warning-callout, panel, details
**Data display:** table, card, tag, collection, icon-list
**Utilities:** accordion

**Recipes:** ask-users-for-information, check-answers-flow, error-summary-flow, task-list-pattern, navigation-hierarchy
**Publishing-frontend components** (source-flagged): step-by-step-navigation, search-result-item

## Compliance & domain metadata

All tiles carry `govCompliance: ["PSBAR 2018", "WCAG 2.2 AA", "GDS Service Standard"]` plus per-tile compliance facts (PII handling, audit-trail) and mobileUX facts (44px touch targets). GOV.UK doctrine: **no card component exists by design** — declared in `gaps` (registry.config.json) with nearest alternatives.

## Agent-facing docs

- [AGENTS.md](AGENTS.md) — retrieval workflow, GOV.UK rules, quality gates
- [llms.txt](llms.txt) — the lean protocol: decision strategy, quality gates, facets, output contract
- [agents.json](agents.json) — compact machine manifest
- [compatibility.json](compatibility.json) — GOV.UK → USWDS family maps
- [core-classes.json](infinite/core-classes.json) — documented untiled layout/typography layer
- `gaps` (registry.config.json) — declared component absences with nearest alternatives

## The registry family

| Registry | Design system | Tiles |
|---|---|---|
| [uswds-ai-components](https://github.com/ednark/uswds-ai-components) | U.S. Web Design System | 152 |
| **govuk-ai-components** (this repo) | GOV.UK Design System | 45 |
| [dsfr-ai-components](https://github.com/ednark/dsfr-ai-components) | Système de Design de l'État | 42 |
| [ecl-ai-components](https://github.com/ednark/ecl-ai-components) | Europa Component Library | 36 |
| [canada-ai-components](https://github.com/ednark/canada-ai-components) | Canada.ca Design System | 25 |
| [drupal-uswds-ai-components](https://github.com/ednark/drupal-uswds-ai-components) | USWDS on Drupal | 24 |
| [forever-ai-components](https://github.com/isas1/forever-ai-components) | Forever (origin project) | 604 |

All implement the same 5-surface protocol; cross-registry translation lives in each registry's `compatibility.json`.

## Validation

```bash
node _base/validate-registry.mjs                # full lint
node _base/validate-registry.mjs --conformance .  # spec certification
npm run build                                    # rebuild tiles + index
```

## License

Tile markup and metadata are original works (inline CSS approximations, not copies of GOV.UK Frontend source). GOV.UK class names and component concepts are used under the GOV.UK Design System's terms (govuk-frontend: MIT; design-system content: Open Government Licence v3.0). Tile implementations in this registry: MIT.
