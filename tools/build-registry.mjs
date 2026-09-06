/**
 * GOV.UK AI Components — tile builder.
 *
 * Renders self-contained tiles from tools/inventory.mjs: one HTML file per
 * variant with real GOV.UK markup, inline CSS approximation, and the full
 * v2 agent-meta block (discovery/selection/instruction/coordination/
 * constraints/portability + compliance/mobileUX).
 *
 * Usage: node tools/build-registry.mjs [--force]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { inventory, COMPLIANCE } from './inventory.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TILE_DIR = join(ROOT, 'infinite');
const FORCE = process.argv.includes('--force');

// ─── Shared CSS (GOV.UK visual language approximation) ───────────────────────

const BASE_CSS = `
body{font-family:Arial,Helvetica,sans-serif;font-size:19px;line-height:1.31578;margin:0;padding:2rem;color:#0b0c0c}
a.govuk-link{color:#1d70b8}
.govuk-body{margin:0 0 20px}
.cap{position:fixed;bottom:12px;left:16px;font-size:11px;letter-spacing:.08em;color:#505a5f;text-transform:uppercase}
.govuk-visually-hidden{position:absolute!important;width:1px;height:1px;margin:0;padding:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}
:focus-visible{outline:3px solid #fd0;box-shadow:0 0 0 3px #0b0c0c;outline-offset:0}
.govuk-hint{color:#505a5f;margin:4px 0 0}
.govuk-error-message{color:#d4351c;font-weight:700;margin:8px 0 0}
.govuk-label{font-weight:400;display:block;margin-bottom:4px}
.govuk-label-wrapper h1{margin:0}
.govuk-fieldset{border:0;padding:0;margin:0 0 20px}
.govuk-fieldset__legend{font-weight:700;margin:0 0 10px;padding:0}
.govuk-fieldset__heading{font-size:1.375rem;margin:0}
`;

const CSS = {
  'form-group': `.govuk-form-group{margin-bottom:20px}
.govuk-form-group--error{padding-left:15px;border-left:5px solid #d4351c}
.govuk-form-group--error .govuk-error-message{margin:0 0 8px}
.govuk-input,.govuk-textarea,.govuk-select{font:inherit;color:#0b0c0c;background:#fff;border:2px solid #0b0c0c;box-sizing:border-box;width:100%;max-width:40em;padding:5px 4px 4px;margin-top:2px}
.govuk-input:focus,.govuk-textarea:focus,.govuk-select:focus{outline:3px solid #fd0;box-shadow:inset 0 0 0 2px #0b0c0c}
.govuk-input--error{border:4px solid #d4351c}
.govuk-input--width-2{max-width:5.4em}.govuk-input--width-4{max-width:7.5em}.govuk-input--width-10{max-width:15.7em}
.govuk-textarea{min-height:160px}.govuk-textarea--error{border:4px solid #d4351c}
.govuk-select{max-width:none;padding:5px 4px 4px}
.govuk-date-input:after{content:"";display:block;clear:both}
.govuk-date-input__item{float:left;margin-right:20px;margin-bottom:0}
.govuk-date-input__label{display:block;margin-bottom:2px}
.govuk-date-input__input{margin-bottom:0}
.govuk-checkboxes__item,.govuk-radios__item{display:block;position:relative;min-height:40px;margin-bottom:10px;padding:0 0 0 40px;clear:left}
.govuk-checkboxes__input,.govuk-radios__input{position:absolute;top:-2px;left:0;width:44px;height:44px;margin:0;opacity:0;cursor:pointer}
.govuk-checkboxes__label,.govuk-radios__label{display:inline-block;margin:0;padding:8px 15px 5px;cursor:pointer}
.govuk-checkboxes__input+.govuk-checkboxes__label:before{content:"";box-sizing:border-box;position:absolute;top:2px;left:0;width:40px;height:40px;border:2px solid #0b0c0c;background:#fff}
.govuk-checkboxes__input:checked+.govuk-checkboxes__label:before{background-color:#00703c;box-shadow:inset 0 0 0 2px #00703c}
.govuk-checkboxes__input:checked+.govuk-checkboxes__label:after{content:"";box-sizing:border-box;position:absolute;top:11px;left:14px;width:23px;height:12px;transform:rotate(-45deg);border:solid;border-width:0 0 5px 5px;border-top-color:transparent;border-right-color:transparent;border-color:#fff}
.govuk-checkboxes__input:focus+.govuk-checkboxes__label:before,.govuk-radios__input:focus+.govuk-radios__label:before{outline:3px solid #fd0;box-shadow:0 0 0 3px #0b0c0c}
.govuk-radios__input+.govuk-radios__label:before{content:"";box-sizing:border-box;position:absolute;top:2px;left:0;width:40px;height:40px;border:2px solid #0b0c0c;border-radius:50%;background:#fff}
.govuk-radios__input:checked+.govuk-radios__label:before{background:#00703c;box-shadow:inset 0 0 0 2px #00703c}
.govuk-radios__input:checked+.govuk-radios__label:after{content:"";position:absolute;top:14px;left:14px;width:0;height:0;border:10px solid #00703c;border-radius:50%;background:#fff}
.govuk-checkboxes--error .govuk-checkboxes__input+.govuk-checkboxes__label:before,.govuk-radios--error .govuk-radios__input+.govuk-radios__label:before{border-color:#d4351c}
.govuk-radios--inline .govuk-radios__item{display:inline-block;margin-right:20px}
.govuk-checkboxes__conditional{margin:0 0 15px;padding:15px 20px;border-left:4px solid #b1b4b6}
.govuk-checkboxes__conditional--hidden{display:none}
.govuk-button{font:inherit;font-weight:400;display:inline-block;margin:0;padding:8px 10px 7px;border:2px solid transparent;border-radius:0;background-color:#00703c;color:#fff;cursor:pointer;text-decoration:none;width:auto}
.govuk-button:hover{background-color:#005a30}
.govuk-button--disabled{opacity:.5;background-color:#00703c;cursor:not-allowed}
.govuk-button--secondary{background-color:#f3f2f1;color:#0b0c0c;box-shadow:0 2px 0 #0b0c0c}
.govuk-button--secondary:hover{background-color:#dbdad9}
.govuk-button--warning{background-color:#d4351c;box-shadow:0 2px 0 #552415}
.govuk-button--start{font-size:1.2em;margin-top:10px;margin-bottom:10px;padding:10px 25px 8px 15px;position:relative}
.govuk-button__start-icon{margin-left:10px;vertical-align:middle}
.govuk-character-count .govuk-character-count__message{margin-top:8px;font-weight:400}
.govuk-error-summary{border:4px solid #d4351c;padding:20px;margin-bottom:30px}
.govuk-error-summary__title{font-size:1.375rem;font-weight:700;margin:0 0 10px}
.govuk-error-summary__body ul{margin:0;padding-left:20px}
.govuk-notification-banner{border:4px solid #1d70b8;background:#fff;margin-bottom:30px}
.govuk-notification-banner--success{border-color:#00703c}
.govuk-notification-banner__header{background:#1d70b8;padding:8px 20px}
.govuk-notification-banner--success .govuk-notification-banner__header{background:#00703c}
.govuk-notification-banner__title{font-size:1.0625rem;font-weight:700;color:#fff;margin:0}
.govuk-notification-banner__content{padding:15px 20px}
.govuk-notification-banner__heading{font-weight:700;margin:0}
.govuk-inset-text{margin:20px 0;padding:10px 20px;border-left:10px solid #1d70b8}
.govuk-warning-callout{margin:20px 0;padding:20px;background:#ffdd00}
.govuk-warning-callout__title{display:block;margin-bottom:5px}
.govuk-panel{color:#fff;background:#00703c;padding:35px 20px;margin:20px 0;text-align:center}
.govuk-panel__title{font-size:2.75rem;margin:0}
.govuk-panel__body{margin-top:15px}
.govuk-details{margin:20px 0}
.govuk-details__summary{display:inline-block;position:relative;margin:0;color:#1d70b8;cursor:pointer}
.govuk-details__summary:before{content:"";position:absolute;top:-4px;left:0;width:32px;height:32px;border:2px solid currentColor;border-radius:50%;background:#fff}
.govuk-details__summary-text{position:relative;margin-left:40px;top:-6px;display:block;text-decoration:underline}
.govuk-details[open] .govuk-details__summary:before{content:""}
.govuk-details__text{padding:10px 20px 0 40px;border-left:5px solid #b1b4b6;margin:10px 0 0}
.govuk-accordion__section{padding:10px 0;border-bottom:1px solid #b1b4b6}
.govuk-accordion__section-button{font:inherit;font-size:1.375rem;font-weight:700;background:none;border:0;color:#1d70b8;cursor:pointer;text-decoration:underline;padding:10px 0;width:100%;text-align:left}
.govuk-accordion__section-content{padding-bottom:10px}
.govuk-tabs__list{list-style:none;margin:0;padding:0;border-bottom:1px solid #b1b4b6;display:flex;gap:4px}
.govuk-tabs__tab{display:block;color:#1d70b8;padding:10px 20px;text-decoration:underline;background:#f3f2f1;border:1px solid #b1b4b6;border-bottom:0}
.govuk-tabs__list-item--selected .govuk-tabs__tab{background:#fff;font-weight:700;border-bottom:1px solid #fff;margin-bottom:-1px}
.govuk-tabs__panel{padding:15px 0}
.govuk-tabs__panel--hidden{display:none}
.govuk-breadcrumbs{margin:10px 0 15px}
.govuk-breadcrumbs__list{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.govuk-breadcrumbs__list-item:before{content:"";display:inline-block;width:7px;height:7px;border-right:1px solid #505a5f;transform:rotate(45deg);margin-right:8px}
.govuk-breadcrumbs__list-item:first-child:before{content:none}
.govuk-header{background:#0b0c0c;color:#fff;padding:10px 0}
.govuk-header__container{max-width:960px;margin:0 auto;padding:0 15px;display:flex;align-items:center;gap:20px}
.govuk-header__link{color:#fff;text-decoration:none}
.govuk-header__logotype-text{font-weight:700;letter-spacing:.05em;font-size:1.3rem}
.govuk-header__link--service-name{font-weight:400}
.govuk-footer{background:#f3f2f1;border-top:1px solid #b1b4b6;margin-top:40px;padding:30px 0;color:#505a5f}
.govuk-footer .govuk-width-container{max-width:960px;margin:0 auto;padding:0 15px}
.govuk-footer__inline-list{list-style:none;margin:0 0 15px;padding:0;display:flex;gap:20px}
.govuk-footer__link{color:#505a5f}
.govuk-back-link{display:inline-block;position:relative;margin:10px 0 15px;padding-left:14px;color:#1d70b8}
.govuk-back-link:before{content:"";position:absolute;top:10px;left:0;width:8px;height:8px;border-left:2px solid #505a5f;border-bottom:2px solid #505a5f;transform:rotate(45deg)}
.govuk-skip-link{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.govuk-skip-link:focus{position:relative!important;width:auto;height:auto;clip:auto;background:#fd0;padding:10px 20px;font-weight:700}
.govuk-phase-banner{border-bottom:1px solid #b1b4b6;padding:10px 0;margin-bottom:20px}
.govuk-phase-banner__content{margin:0}
.govuk-phase-banner__content__tag{margin-right:10px}
.govuk-tag{display:inline-block;font-weight:700;font-size:.8em;padding:4px 8px 2px;border:1px solid #0b0c0c;background:#fff;color:#0b0c0c;text-transform:uppercase;letter-spacing:.05em}
.govuk-tag--grey{background:#eeefef;color:#383f43}.govuk-tag--blue{background:#d2e2f1;color:#144e81}
.govuk-tag--green{background:#cce2d8;color:#005a30}.govuk-tag--red{background:#f6d7d2;color:#942514}
.govuk-table{width:100%;border-collapse:collapse;margin:20px 0}
.govuk-table__header{font-weight:700;border-bottom:2px solid #0b0c0c;text-align:left;padding:10px 20px 10px 0}
.govuk-table__cell{padding:10px 20px 10px 0;border-bottom:1px solid #b1b4b6}
.govuk-table__header--numeric,.govuk-table__cell--numeric{text-align:right}
.govuk-summary-list{margin:20px 0}
.govuk-summary-list__row{display:flex;flex-wrap:wrap;border-bottom:1px solid #b1b4b6;padding:10px 0;gap:10px}
.govuk-summary-list__key{width:30%;font-weight:700;margin:0}
.govuk-summary-list__value{width:45%;margin:0}
.govuk-summary-list__actions{width:20%;margin:0;text-align:right}
.govuk-task-list{list-style:none;margin:20px 0;padding:0}
.govuk-task-list__item{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #b1b4b6;padding:10px 0}
.govuk-pagination__list{list-style:none;margin:20px 0;padding:0;display:flex;justify-content:space-between}
.govuk-pagination__item--prev,.govuk-pagination__item--next{width:48%}
.govuk-pagination__item--next{text-align:right}
.govuk-pagination__link-title{text-decoration:underline;color:#1d70b8}
.govuk-warning-callout,.govuk-panel{border:0}
.govuk-character-count__message.govuk-hint{font-size:1rem}
.govuk-table__caption{font-weight:700;text-align:left;margin-bottom:8px}
`
};


// ─── Cost model (same calibration as the USWDS registry) ────────────────────

function costDefaults(bytes, requiresJs) {
  const estimatedTokens = Math.ceil(bytes / 4);
  let costTier;
  if (requiresJs === 'required') costTier = estimatedTokens > 2000 ? 'expensive' : 'moderate';
  else if (requiresJs === 'optional') costTier = 'moderate';
  else costTier = estimatedTokens > 1000 ? 'moderate' : 'cheap';
  const renderingTimeMs = requiresJs === 'required' ? 60 : requiresJs === 'optional' ? 35 : 15;
  const recommendedModel = costTier === 'expensive' ? 'sonnet' : 'haiku';
  return { costTier, estimatedTokens, renderingTimeMs, recommendedModel };
}

// ─── Recipe membership ───────────────────────────────────────────────────────

const recipeMembership = {
  'step-by-step-navigation': `.app-step-nav{border-left:2px solid #1d70b8;margin:1.5rem 0;padding-left:1rem}
.app-step-nav__steps{list-style:none;margin:0;padding:0}
.app-step-nav__step{margin-bottom:1rem}
.app-step-nav__heading{margin:0}
.app-step-nav__circle{display:inline-flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:50%;background:#1d70b8;color:#fff;margin-right:.75rem}
.app-step-nav__circle-background{font-weight:700}
.app-step-nav__step--done .app-step-nav__circle{background:#00703c}
.app-step-nav__body{margin:.5rem 0 0;color:#505a5f}
`,
  'search-result-item': `.gem-c-search-result{margin:1.25rem 0;max-width:38rem}
.gem-c-search-result__title{font-size:1.25rem;margin:0 0 .25rem}
.gem-c-search-result__title-link{color:#1d70b8;text-decoration:underline}
.gem-c-search-result__description{margin:0 0 .25rem}
.gem-c-search-result__metadata{font-size:.875rem;color:#505a5f;margin:0}
.gem-c-search-result__sub-results{list-style:none;margin:.75rem 0 0;padding-left:1.25rem;border-left:2px solid #b1b4b6}
.gem-c-search-result__sub-result-link{color:#1d70b8;text-decoration:underline}
.gem-c-search-result__sub-result-description{font-size:.875rem;color:#505a5f;margin:.1rem 0 .5rem}
`
};

try {
  const recipesDir = join(TILE_DIR, 'recipes');
  for (const item of readdirSync(recipesDir)) {
    if (!item.endsWith('.json') || item === 'index.json') continue;
    const recipe = JSON.parse(readFileSync(join(recipesDir, item), 'utf-8'));
    for (const c of recipe.components || []) {
      (recipeMembership[c.component] ||= []).push(recipe.recipe);
    }
  }
} catch {
  console.log('(no recipes yet — compositionRecipes skipped)');
}

// ─── Meta assembly ───────────────────────────────────────────────────────────

function buildMeta(component, variant, relPath, html) {
  const bytes = Buffer.byteLength(html, 'utf-8');
  const cost = costDefaults(bytes, component.requiresJs);
  const requiresJs = component.requiresJs;
  const isInteractive = (component.interaction || []).length > 0;

  const coord = {
    prerequisiteComponents: component.prerequisites || [],
    incompatibleWith: component.incompatibleWith || [],
    compositionCost: cost,
  };
  if (component.agentPromptSequence) coord.agentPromptSequence = component.agentPromptSequence;
  const memberOf = [...new Set(recipeMembership[component.dir] || [])];
  if (memberOf.length) coord.compositionRecipes = memberOf;

  const meta = {
    _schemaVersion: 2,
    discovery: {
      gdsComponentType: component.dir,
      govukClass: component.cls,
      section: component.section,
      variant: variant,
      requiresJs,
      interaction: component.interaction || [],
      a11y: {
        wcag22AA: true,
        keyboardNav: isInteractive,
        screenReader: true,
        reducedMotion: true,
        forcedColors: true,
        ariaAttributes: true,
      },
      govCompliance: COMPLIANCE,
      tier: 'curated',
      tags: component.tags,
      description: component.description,
      compliance: {
        nistControls: [],
        psbar: true,
        wcag22AA: true,
        serviceStandard: true,
        piiHandling: component.pii || 'none',
        auditTrailCompatible: component.audit || false,
        dataMaskingCompatible: component.dir === 'text-input',
      },
      mobileUX: {
        touchTargetSize: isInteractive ? '44px' : 'n/a',
        requiredMinSpacing: '8px',
        orientationLocked: false,
        fullscreenSafe: true,
      },
    },
    selection: {
      useWhen: component.useWhen,
      avoidWhen: component.avoidWhen,
    },
    instruction: {
      agentPrompt: component.agentPrompt,
      relatedComponents: component.related || [],
    },
    coordination: coord,
    constraints: {
      preserve: component.preserve,
      editable: component.editable,
      limitations: component.limitations,
      portableInvariants: component.invariants,
    },
    supportedTokenProfiles: ['highContrast'],
    ...(component.provenance && { provenance: component.provenance }),
    file: relPath,
    title: `${component.name} (${variant})`,
  };

  if (component.classMappingUswds) {
    meta.portability = {
      classMapping: { uswds: component.classMappingUswds },
    };
  }
  return meta;
}

// ─── Tile rendering ──────────────────────────────────────────────────────────

function renderTile(component, variant, relPath, markup) {
  const meta = buildMeta(component, variant.variant, relPath, markup);
  const description = `GOV.UK Design System ${component.name.toLowerCase()} demonstrating the ${variant.variant} variant.`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${component.name} (${variant.variant})</title>
<script type="application/json" id="govuk-agent-meta">
${JSON.stringify(meta, null, 2)}
</script>
<style>${BASE_CSS}
${CSS[component.dir] || ''}
</style>
</head>
<body>
${markup}
<div class="cap">${component.dir} ${variant.variant}</div>
</body>
</html>
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

let written = 0;
for (const component of inventory) {
  const variants = component.variants || [
    { file: 'default', variant: 'default', desc: component.description, markup: component.defaultMarkup },
  ];
  const dir = join(TILE_DIR, component.dir);
  mkdirSync(dir, { recursive: true });
  for (const variant of variants) {
    const markup = variant.markup ?? component.defaultMarkup;
    if (!markup) {
      console.error(`  ✗ ${component.dir}/${variant.file}: no markup`);
      continue;
    }
    const relPath = `${component.dir}/${variant.file}.html`;
    const outPath = join(TILE_DIR, relPath);
    if (!FORCE && existsSync(outPath)) continue; // hand-edited tiles survive re-runs
    writeFileSync(outPath, renderTile(component, variant, relPath, markup));
    written++;
    console.log(`  ✓ ${relPath}`);
  }
}
console.log(`\nWrote ${written} tiles (${inventory.length} components)`);
