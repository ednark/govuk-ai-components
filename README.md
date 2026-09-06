# GOV.UK AI Components

AI-retrievable component registry for the [GOV.UK Design System](https://design-system.service.gov.uk) — 41 self-contained component tiles across 29 component families, for AI coding agents building UK government services.

Implements the [ai-component-registry-spec](https://github.com/ednark/ai-component-registry-spec) protocol (submodule at `_base/`). Sibling to [uswds-ai-components](https://github.com/ednark/uswds-ai-components).

## Quick start (agents)

1. [agents.json](https://raw.githubusercontent.com/ednark/govuk-ai-components/main/agents.json) — manifest
2. [components.index.json](https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/components.index.json) — lean discovery index, filter in code
3. `infinite/{file}` — tile: source + embedded `govuk-agent-meta`
4. [recipes](https://raw.githubusercontent.com/ednark/govuk-ai-components/main/infinite/recipes/index.json) — GOV.UK patterns as atomic fetches

MCP: `npm run mcp` (9 tools). Validate: `node _base/validate-registry.mjs`.

## Coverage

**Forms:** form-group, text-input, textarea, select, checkboxes, radios, date-input, file-upload, character-count, error-summary, button
**Navigation:** breadcrumbs, header, footer, back-link, skip-link, phase-banner, tabs, pagination
**Feedback:** notification-banner, inset-text, warning-callout, panel
**Data display:** table, summary-list, task-list, tag
**Utilities:** details, accordion

Recipes: ask-users-for-information, check-answers-flow, error-summary-flow, task-list-pattern, page-template.

## Compliance metadata

All tiles carry `govCompliance: ["PSBAR 2018", "WCAG 2.2 AA", "GDS Service Standard"]` plus per-tile `compliance` facts (PII handling, audit-trail capability) and `mobileUX` facts (44px touch targets). FedRAMP fields are intentionally omitted — see the USWDS registry for US compliance metadata.

## License

Tile markup and metadata are original works (inline CSS approximations, not copies of govuk-frontend source). GOV.UK class names and component concepts are used under the GOV.UK Design System's terms (govuk-frontend: MIT; design-system content: Open Government Licence v3.0). Tile implementations in this registry: MIT.
