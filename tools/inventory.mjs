/**
 * GOV.UK AI Components — component inventory.
 *
 * Each component declares its variants (real GOV.UK markup), metadata for the
 * v2 categorized schema, coordination, and compliance facts. The builder
 * (build-registry.mjs) turns this into self-contained tiles.
 */

export const COMPLIANCE = ["PSBAR 2018", "WCAG 2.2 AA", "GDS Service Standard"];

export const inventory = [
  // ─── FORMS ────────────────────────────────────────────────────────────────
  {
    dir: "form-group",
    name: "Form group",
    cls: "govuk-form-group",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus"],
    pii: "none",
    audit: false,
    useWhen: [
      "Wrapping any form control with its label, hint, and error message",
      "The prerequisite container every GOV.UK input expects"
    ],
    avoidWhen: ["Styling inputs without labels — GOV.UK forbids unlabelled inputs"],
    agentPrompt: "Keep the .govuk-form-group wrapper; add govuk-form-group--error plus a .govuk-error-message when the field fails validation.",
    preserve: [
      ".govuk-form-group wrapper around label + control",
      "Label 'for' attribute matching the input id",
      "aria-describedby linking hint/error ids to the control"
    ],
    editable: ["Label text", "Hint text", "Error message text"],
    limitations: ["The error message must stay inside the form group, before the control"],
    invariants: ["Label element associated via for/id", "Hint and errors referenced by aria-describedby"],
    related: ["text-input", "error-summary", "button"],
    tags: ["form", "label", "hint", "error", "wrapper"],
    description: "Container for a form control with its label, hint, and error message.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Form group with label and hint wrapping an input.",
        markup: `<div class="govuk-form-group">
  <label class="govuk-label" for="fg-example">
    What is your address?
  </label>
  <div id="fg-example-hint" class="govuk-hint">
    Enter the address as it appears on your council tax bill.
  </div>
  <input class="govuk-input" id="fg-example" name="address" type="text" aria-describedby="fg-example-hint">
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Form group in the error state with linked error message.",
        markup: `<div class="govuk-form-group govuk-form-group--error">
  <label class="govuk-label" for="fg-error">
    What is your address?
  </label>
  <p id="fg-error-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> Enter your address
  </p>
  <input class="govuk-input govuk-input--error" id="fg-error" name="address" type="text" value="" aria-describedby="fg-error-error" aria-invalid="true">
</div>`
      }
    ]
  },
  {
    dir: "text-input",
    name: "Text input",
    cls: "govuk-input",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "GOV.UK inputs must sit inside a form group carrying the label, hint, and error message" }],
    useWhen: [
      "Short free-text answers (names, reference numbers, addresses)",
      "Any single-line text entry in a service"
    ],
    avoidWhen: [
      "Longer answers — use textarea",
      "Structured dates — use date-input instead of one text field"
    ],
    agentPrompt: "Change label text and input width classes (govuk-input--width-10, --width-20). For errors add govuk-input--error, govuk-form-group--error, a linked govuk-error-message, and aria-invalid='true'.",
    preserve: [
      ".govuk-input class on the input element",
      "Label 'for' attribute matching the input id",
      "aria-describedby wiring for hints and error messages",
      "aria-invalid='true' on errored inputs"
    ],
    editable: ["Label text", "Hint text", "Width modifier class (govuk-input--width-*)", "type attribute (text, email, tel, numeric)"],
    limitations: ["Do not use type='number' for numbers with leading zeros or long digit strings"],
    invariants: ["Semantic <input> element", "Label association via for/id", "aria-describedby references remain valid"],
    related: ["form-group", "error-summary", "character-count"],
    classMappingUswds: { base: "usa-input", error: "usa-input usa-input--error" },
    tags: ["input", "text", "form", "field"],
    description: "Single-line text input with label, hint, and error support.",
    defaultMarkup: `<div class="govuk-form-group">
  <label class="govuk-label" for="ni-example">National Insurance number</label>
  <div id="ni-hint" class="govuk-hint">It's on your National Insurance card, benefit letter, payslip or P60.</div>
  <input class="govuk-input govuk-input--width-10" id="ni-example" name="ni" type="text" aria-describedby="ni-hint">
</div>`,  },
  {
    dir: "textarea",
    name: "Textarea",
    cls: "govuk-textarea",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "GOV.UK textareas must sit inside a form group carrying the label and error message" }],
    useWhen: ["Longer free-text answers (descriptions, messages, reasons)"],
    avoidWhen: ["Single-line values — use text-input", "Answers with a character limit — pair with character-count"],
    agentPrompt: "Adjust rows attribute for height. For errors add govuk-textarea--error, govuk-form-group--error, linked govuk-error-message, and aria-invalid='true'.",
    preserve: [".govuk-textarea class", "Label 'for' association", "aria-describedby wiring"],
    editable: ["Label text", "rows attribute", "Character limit via character-count wrapper"],
    limitations: ["Fixed height by rows — users may need to scroll for long content"],
    invariants: ["Semantic <textarea> element", "Label association via for/id"],
    related: ["form-group", "character-count", "error-summary"],
    classMappingUswds: { base: "usa-textarea" },
    tags: ["textarea", "text", "multiline", "form"],
    description: "Multi-line text input with label and error support.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Textarea with label.",
        markup: `<div class="govuk-form-group">
  <label class="govuk-label" for="ta-example">
    Can you provide more detail?
  </label>
  <textarea class="govuk-textarea" id="ta-example" name="detail" rows="5"></textarea>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Textarea in the error state.",
        markup: `<div class="govuk-form-group govuk-form-group--error">
  <label class="govuk-label" for="ta-error">
    Can you provide more detail?
  </label>
  <p id="ta-error-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> You must provide more detail
  </p>
  <textarea class="govuk-textarea govuk-textarea--error" id="ta-error" name="detail" rows="5" aria-describedby="ta-error-error" aria-invalid="true"></textarea>
</div>`
      }
    ]
  },
  {
    dir: "select",
    name: "Select",
    cls: "govuk-select",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "change"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "GOV.UK selects must sit inside a form group carrying the label" }],
    useWhen: ["Choosing one option from 4–7 known options"],
    avoidWhen: ["More than 7 options — split into categories or reconsider the question", "Yes/no questions — use radios"],
    agentPrompt: "Replace <option> values and text. For errors add govuk-select--error, govuk-form-group--error, a linked govuk-error-message, and aria-invalid='true'.",
    preserve: [".govuk-select class on the <select>", "Label 'for' association", "First option as placeholder ('Please select an option')"],
    editable: ["Label text", "Option list"],
    limitations: ["Native select — appearance varies by platform", "Poor for long option lists"],
    invariants: ["Semantic <select> with <option> children", "Label association via for/id"],
    related: ["form-group", "error-summary", "radios"],
    classMappingUswds: { base: "usa-select", error: "usa-select usa-select--error" },
    tags: ["select", "dropdown", "form", "options"],
    description: "Dropdown select with label and error support.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Select with label and placeholder option.",
        markup: `<div class="govuk-form-group">
  <label class="govuk-label" for="sel-example">
    Where do you live?
  </label>
  <select class="govuk-select" id="sel-example" name="where">
    <option value="">Please select an option</option>
    <option value="england">England</option>
    <option value="scotland">Scotland</option>
    <option value="wales">Wales</option>
    <option value="ni">Northern Ireland</option>
  </select>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Select in the error state.",
        markup: `<div class="govuk-form-group govuk-form-group--error">
  <label class="govuk-label" for="sel-error">
    Where do you live?
  </label>
  <p id="sel-error-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> Select where you live
  </p>
  <select class="govuk-select govuk-select--error" id="sel-error" name="where" aria-describedby="sel-error-error" aria-invalid="true">
    <option value="">Please select an option</option>
    <option value="england">England</option>
    <option value="scotland">Scotland</option>
  </select>
</div>`
      }
    ]
  },
  {
    dir: "checkboxes",
    name: "Checkboxes",
    cls: "govuk-checkboxes",
    section: "forms",
    requiresJs: "optional",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "Checkbox groups sit inside a fieldset within a form group carrying legend and error" }],
    useWhen: ["Selecting any number of options including none", "Single opt-in consent checkbox"],
    avoidWhen: ["Exactly one choice from many — use radios"],
    agentPrompt: "Edit option labels and values. For errors add govuk-checkboxes--error on the checkboxes div, govuk-form-group--error, a linked govuk-error-message, and aria-describedby on the fieldset.",
    preserve: [
      "fieldset + legend structure for grouped options",
      ".govuk-checkboxes__item wrapper per option",
      "input/label pairing via for/id",
      "aria-describedby on the fieldset for hints and errors"
    ],
    editable: ["Legend text", "Option labels and values", "Dividers ('or') between options"],
    limitations: ["Conditional reveals need govuk-frontend JS", "Do not hide options behind conditional reveals that are always relevant"],
    invariants: ["fieldset/legend for grouped checkboxes", "Real <input type='checkbox'> elements"],
    related: ["radios", "form-group", "error-summary"],
    classMappingUswds: { base: "usa-checkbox__input", label: "usa-checkbox__label" },
    tags: ["checkbox", "multiple", "form", "options"],
    description: "Checkbox group with legend, error, and optional conditional reveals.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Checkbox group with legend.",
        markup: `<div class="govuk-form-group">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">Which types of waste do you carry regularly?</h1>
    </legend>
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="waste-a" name="waste" type="checkbox" value="carcasses">
        <label class="govuk-label govuk-checkboxes__label" for="waste-a">Waste from animal carcasses</label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="waste-b" name="waste" type="checkbox" value="mines">
        <label class="govuk-label govuk-checkboxes__label" for="waste-b">Waste from mines or quarries</label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="waste-c" name="waste" type="checkbox" value="farm">
        <label class="govuk-label govuk-checkboxes__label" for="waste-c">Farm or agricultural waste</label>
      </div>
    </div>
  </fieldset>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Checkbox group in the error state.",
        markup: `<div class="govuk-form-group govuk-form-group--error">
  <fieldset class="govuk-fieldset" aria-describedby="waste-error">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">Which types of waste do you carry regularly?</h1>
    </legend>
    <p id="waste-error" class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span> Select at least one type of waste
    </p>
    <div class="govuk-checkboxes govuk-checkboxes--error" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="waste-ea" name="waste" type="checkbox" value="carcasses">
        <label class="govuk-label govuk-checkboxes__label" for="waste-ea">Waste from animal carcasses</label>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="waste-eb" name="waste" type="checkbox" value="mines">
        <label class="govuk-label govuk-checkboxes__label" for="waste-eb">Waste from mines or quarries</label>
      </div>
    </div>
  </fieldset>
</div>`
      },
      {
        file: "conditional", variant: "conditional",
        desc: "Checkbox with conditional content reveal (requires govuk-frontend JS).",
        markup: `<div class="govuk-form-group">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">How would you prefer to be contacted?</h1>
    </legend>
    <div class="govuk-checkboxes" data-module="govuk-checkboxes">
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="contact-email" name="contact" type="checkbox" value="email" data-aria-controls="conditional-contact-email">
        <label class="govuk-label govuk-checkboxes__label" for="contact-email">Email</label>
      </div>
      <div class="govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden" id="conditional-contact-email">
        <div class="govuk-form-group">
          <label class="govuk-label" for="contact-email-address">Email address</label>
          <input class="govuk-input" id="contact-email-address" name="contact-email" type="email">
        </div>
      </div>
      <div class="govuk-checkboxes__item">
        <input class="govuk-checkboxes__input" id="contact-phone" name="contact" type="checkbox" value="phone">
        <label class="govuk-label govuk-checkboxes__label" for="contact-phone">Phone</label>
      </div>
    </div>
  </fieldset>
</div>`
      }
    ]
  },
  {
    dir: "radios",
    name: "Radios",
    cls: "govuk-radios",
    section: "forms",
    requiresJs: "optional",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "Radio groups sit inside a fieldset within a form group carrying legend and error" }],
    useWhen: ["Exactly one choice from a small set of options", "Yes/no questions"],
    avoidWhen: ["Multiple selections — use checkboxes", "Long option lists — use select"],
    agentPrompt: "Edit option labels and values. govuk-radios--inline stacks options horizontally for short labels. For errors add govuk-radios--error, govuk-form-group--error, linked govuk-error-message, and aria-describedby on the fieldset.",
    preserve: [
      "fieldset + legend structure",
      ".govuk-radios__item wrapper per option",
      "Same name attribute on all radios in the group",
      "aria-describedby on the fieldset for hints and errors"
    ],
    editable: ["Legend text", "Option labels and values", "Inline modifier for short options"],
    limitations: ["Inline variant only for options with very short labels"],
    invariants: ["fieldset/legend for the group", "Real <input type='radio'> elements sharing one name"],
    related: ["checkboxes", "form-group", "error-summary"],
    classMappingUswds: { base: "usa-radio__input", label: "usa-radio__label" },
    tags: ["radio", "single-choice", "form", "options"],
    description: "Radio group for single-choice questions with error support.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Radio group with legend.",
        markup: `<div class="govuk-form-group">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">Where do you live?</h1>
    </legend>
    <div class="govuk-radios" data-module="govuk-radios">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="where-england" name="where" type="radio" value="england">
        <label class="govuk-label govuk-radios__label" for="where-england">England</label>
      </div>
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="where-scotland" name="where" type="radio" value="scotland">
        <label class="govuk-label govuk-radios__label" for="where-scotland">Scotland</label>
      </div>
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="where-wales" name="where" type="radio" value="wales">
        <label class="govuk-label govuk-radios__label" for="where-wales">Wales</label>
      </div>
    </div>
  </fieldset>
</div>`
      },
      {
        file: "inline", variant: "inline",
        desc: "Inline radios for short labels.",
        markup: `<div class="govuk-form-group">
  <fieldset class="govuk-fieldset">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">Have you changed your name?</h1>
    </legend>
    <div class="govuk-radios govuk-radios--inline" data-module="govuk-radios">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="changed-yes" name="changed" type="radio" value="yes">
        <label class="govuk-label govuk-radios__label" for="changed-yes">Yes</label>
      </div>
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="changed-no" name="changed" type="radio" value="no">
        <label class="govuk-label govuk-radios__label" for="changed-no">No</label>
      </div>
    </div>
  </fieldset>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Radio group in the error state.",
        markup: `<div class="govuk-form-group govuk-form-group--error">
  <fieldset class="govuk-fieldset" aria-describedby="where-error">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">Where do you live?</h1>
    </legend>
    <p id="where-error" class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span> Select where you live
    </p>
    <div class="govuk-radios govuk-radios--error" data-module="govuk-radios">
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="where-err-england" name="where" type="radio" value="england">
        <label class="govuk-label govuk-radios__label" for="where-err-england">England</label>
      </div>
      <div class="govuk-radios__item">
        <input class="govuk-radios__input" id="where-err-scotland" name="where" type="radio" value="scotland">
        <label class="govuk-label govuk-radios__label" for="where-err-scotland">Scotland</label>
      </div>
    </div>
  </fieldset>
</div>`
      }
    ]
  },
  {
    dir: "date-input",
    name: "Date input",
    cls: "govuk-date-input",
    section: "forms",
    requiresJs: "no",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "Date inputs sit inside a form group carrying the legend and error message" }],
    useWhen: ["Known dates (date of birth, expiry dates) as three separate fields"],
    avoidWhen: [
      "Users remembering a date to enter — allow memory aids in the question",
      "Picking from a calendar — GOV.UK deliberately ships no calendar component"
    ],
    agentPrompt: "Edit the legend and field names. For errors add govuk-form-group--error, a group-level govuk-error-message linked via fieldset aria-describedby, and govuk-input--error on failing fields.",
    preserve: [
      "Three separate inputs labelled Day, Month, Year",
      "inputmode='numeric' and width classes (2/2/4)",
      "Group-level error message linked from the fieldset",
      "Autocomplete attributes (bday-day, bday-month, bday-year) where applicable"
    ],
    editable: ["Legend text", "Field name prefixes"],
    limitations: [
      "No calendar picker — this is a deliberate UX decision, do not add one",
      "Validate day/month/year ranges server-side"
    ],
    invariants: ["Three labelled numeric inputs", "Group error linked via aria-describedby"],
    related: ["form-group", "error-summary"],
    classMappingUswds: { base: "usa-memorable-date", error: "usa-memorable-date usa-input--error" },
    tags: ["date", "day", "month", "year", "form"],
    description: "Three-field day/month/year date entry with group-level errors.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Date input with three labelled numeric fields.",
        markup: `<div class="govuk-form-group">
  <fieldset class="govuk-fieldset" role="group" aria-describedby="dob-hint">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">What is your date of birth?</h1>
    </legend>
    <div id="dob-hint" class="govuk-hint">For example, 31 3 1980</div>
    <div class="govuk-date-input" id="dob">
      <div class="govuk-date-input__item">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-date-input__label" for="dob-day">Day</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="dob-day" name="dob-day" type="text" inputmode="numeric" autocomplete="bday-day">
        </div>
      </div>
      <div class="govuk-date-input__item">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-date-input__label" for="dob-month">Month</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="dob-month" name="dob-month" type="text" inputmode="numeric" autocomplete="bday-month">
        </div>
      </div>
      <div class="govuk-date-input__item">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-date-input__label" for="dob-year">Year</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="dob-year" name="dob-year" type="text" inputmode="numeric" autocomplete="bday-year">
        </div>
      </div>
    </div>
  </fieldset>
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "Date input in the error state with group-level message.",
        markup: `<div class="govuk-form-group govuk-form-group--error">
  <fieldset class="govuk-fieldset" role="group" aria-describedby="dob-error-error">
    <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
      <h1 class="govuk-fieldset__heading">What is your date of birth?</h1>
    </legend>
    <p id="dob-error-error" class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span> Enter a date of birth
    </p>
    <div class="govuk-date-input" id="dob-err">
      <div class="govuk-date-input__item">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-date-input__label" for="dob-err-day">Day</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2 govuk-input--error" id="dob-err-day" name="dob-day" type="text" inputmode="numeric">
        </div>
      </div>
      <div class="govuk-date-input__item">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-date-input__label" for="dob-err-month">Month</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2" id="dob-err-month" name="dob-month" type="text" inputmode="numeric">
        </div>
      </div>
      <div class="govuk-date-input__item">
        <div class="govuk-form-group">
          <label class="govuk-label govuk-date-input__label" for="dob-err-year">Year</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-4" id="dob-err-year" name="dob-year" type="text" inputmode="numeric">
        </div>
      </div>
    </div>
  </fieldset>
</div>`
      }
    ]
  },
  {
    dir: "file-upload",
    name: "File upload",
    cls: "govuk-file-upload",
    section: "forms",
    requiresJs: "no",
    interaction: ["focus", "click", "keyboard"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "File uploads sit inside a form group carrying the label and error message" }],
    useWhen: ["Uploading documents (evidence, certificates, photos)"],
    avoidWhen: ["Users may not have the file ready — allow 'save and come back'"],
    agentPrompt: "Edit the label. For errors add govuk-file-upload--error, govuk-form-group--error, a linked govuk-error-message, and aria-invalid='true'. State accepted formats and size limits in the hint.",
    preserve: [".govuk-file-upload class", "Label 'for' association", "accept attribute for file formats"],
    editable: ["Label text", "Hint text (accepted formats, max size)", "accept attribute"],
    limitations: ["Native control — appearance varies by platform", "Large files need progress feedback server-side"],
    invariants: ["Semantic <input type='file'>", "Label association via for/id"],
    related: ["form-group", "error-summary"],
    tags: ["file", "upload", "form", "document"],
    description: "File upload control with label and error support.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "File upload with label and hint.",
        markup: `<div class="govuk-form-group">
  <label class="govuk-label" for="file-example">
    Upload a photo
  </label>
  <div id="file-example-hint" class="govuk-hint">JPEG, PNG or GIF, no larger than 10MB</div>
  <input class="govuk-file-upload" id="file-example" name="photo" type="file" aria-describedby="file-example-hint">
</div>`
      },
      {
        file: "error", variant: "error",
        desc: "File upload in the error state.",
        markup: `<div class="govuk-form-group govuk-form-group--error">
  <label class="govuk-label" for="file-error">
    Upload a photo
  </label>
  <p id="file-error-error" class="govuk-error-message">
    <span class="govuk-visually-hidden">Error:</span> The selected file must be smaller than 10MB
  </p>
  <input class="govuk-file-upload govuk-file-upload--error" id="file-error" name="photo" type="file" aria-describedby="file-error-error" aria-invalid="true">
</div>`
      }
    ]
  },
  {
    dir: "character-count",
    name: "Character count",
    cls: "govuk-character-count",
    section: "forms",
    requiresJs: "required",
    interaction: ["type", "focus"],
    pii: "accepts_input",
    audit: true,
    prerequisites: [{ name: "form-group", reason: "The counted control sits inside a form group carrying the label" }],
    useWhen: ["Answers with a hard or advisory character/word limit"],
    avoidWhen: ["Limits under 10 characters", "Enforcing limits users cannot see a reason for"],
    agentPrompt: "Set data-maxlength (hard) or data-threshold (advisory %). Keep the aria-live status region — it announces remaining characters to screen readers.",
    preserve: [
      "data-maxlength attribute on the wrapper",
      ".govuk-character-count__message region with aria-live='polite'",
      "govuk-js-character-count hook class on the control"
    ],
    editable: ["Label text", "Limit value", "Words vs characters (data-maxwords)"],
    limitations: ["Requires govuk-frontend JS — without it there is no countdown", "Hard maxlength truncates silently server-side checks still required"],
    invariants: ["aria-live status region", "Textarea remains usable without JS"],
    related: ["form-group", "textarea"],
    tags: ["character", "count", "limit", "form", "textarea"],
    description: "Textarea or input with a live character/word count.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Textarea with character countdown (govuk-frontend JS required).",
        markup: `<div class="govuk-form-group">
  <label class="govuk-label" for="cc-example">
    Can you provide more detail?
  </label>
  <div class="govuk-character-count" data-module="govuk-character-count" data-maxlength="200">
    <textarea class="govuk-textarea govuk-js-character-count" id="cc-example" name="detail" rows="5" aria-describedby="cc-example-info"></textarea>
    <div id="cc-example-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
      You can enter up to 200 characters
    </div>
  </div>
</div>`
      }
    ]
  },
  {
    dir: "error-summary",
    name: "Error summary",
    cls: "govuk-error-summary",
    section: "forms",
    requiresJs: "optional",
    interaction: ["focus", "click"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Top of a page when a form submission fails validation", "Every validation-failure state, without exception"],
    avoidWhen: ["Static pages without forms", "Individual field errors alone — the summary complements field errors, never replaces them"],
    agentPrompt: "List each error as a link pointing to the failing control's id. Keep the role='alert' container — govuk-frontend moves focus here on failed submission.",
    preserve: [
      "role='alert' on the container",
      "Links in govuk-error-summary__list pointing to failing control ids",
      "Heading ('There is a problem') structure"
    ],
    editable: ["Title text", "Error link text (must match field error wording)", "Anchor targets"],
    limitations: ["Do not rely on colour alone — each error carries text", "One summary per page"],
    invariants: ["role='alert'", "Error links resolve to real control ids"],
    related: ["form-group", "text-input", "button"],
    tags: ["error", "validation", "summary", "form", "a11y"],
    description: "Page-level validation summary with links to failing fields.",
    defaultMarkup: `<div class="govuk-error-summary" data-module="govuk-error-summary">
  <div role="alert">
    <h2 class="govuk-error-summary__title">There is a problem</h2>
    <div class="govuk-error-summary__body">
      <ul class="govuk-list govuk-error-summary__list">
        <li><a href="#sort-code">Enter a sort code</a></li>
        <li><a href="#account-number">Enter an account number</a></li>
      </ul>
    </div>
  </div>
</div>`,  },
  {
    dir: "button",
    name: "Button",
    cls: "govuk-button",
    section: "forms",
    requiresJs: "optional",
    interaction: ["click", "focus", "keyboard"],
    pii: "none",
    audit: false,
    useWhen: ["Primary action of a page (Submit, Save and continue)", "Start page entry points (govuk-button--start)"],
    avoidWhen: ["Links between pages — use govuk-link", "Less important actions"],
    agentPrompt: "Edit the label. Use govuk-button--secondary for supporting actions, govuk-button--warning for destructive ones, govuk-button--disabled with disabled + aria-disabled for unavailable actions.",
    preserve: [
      ".govuk-button class on a <button> element for form submission",
      "type='submit' inside forms",
      "disabled='disabled' + aria-disabled='true' for disabled buttons"
    ],
    editable: ["Label text", "Variant class (secondary, warning, start, disabled)", "Element type (button/a with button styling)"],
    limitations: ["One primary button per view", "Links styled as buttons must still be real <a> elements with button classes"],
    invariants: ["Semantic <button> or <a> root element", "Accessible name preserved"],
    related: ["form-group", "error-summary"],
    classMappingUswds: { base: "usa-button", secondary: "usa-button usa-button--secondary", warning: "usa-button usa-button--secondary" },
    tags: ["button", "submit", "action", "cta"],
    description: "Primary, secondary, warning, and start-state buttons.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Primary submit button.",
        markup: `<button class="govuk-button" data-module="govuk-button">Save and continue</button>`
      },
      {
        file: "disabled", variant: "disabled",
        desc: "Disabled button.",
        markup: `<button class="govuk-button govuk-button--disabled" disabled="disabled" aria-disabled="true">Submit application</button>`
      },
      {
        file: "start", variant: "start",
        desc: "Start-now button with arrow for service entry pages.",
        markup: `<a class="govuk-button govuk-button--start" href="#">
  Start now
  <svg class="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z"/></svg>
</a>`
      }
    ]
  },
  // ─── NAVIGATION ───────────────────────────────────────────────────────────
  {
    dir: "breadcrumbs",
    name: "Breadcrumbs",
    cls: "govuk-breadcrumbs",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Sites more than two levels deep", "Helping users trace their path back up a hierarchy"],
    avoidWhen: ["Top-level pages", "One-page services"],
    agentPrompt: "Edit the trail links. govuk-breadcrumbs--collapse-on-mobile hides middle levels on small screens. The last item is the current page — keep it as plain text (not a link) with aria-current='page'.",
    preserve: [
      "nav with aria-label='Breadcrumb'",
      "Ordered list structure",
      "aria-current='page' on the last item"
    ],
    editable: ["Trail link text and hrefs"],
    limitations: ["Do not use instead of the back-link within a transaction"],
    invariants: ["nav[aria-label='Breadcrumb']", "ol semantics"],
    related: ["back-link", "header", "phase-banner"],
    classMappingUswds: { base: "usa-breadcrumb" },
    tags: ["breadcrumb", "navigation", "hierarchy"],
    description: "Hierarchical breadcrumb trail with mobile collapsing.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Breadcrumb trail with current page.",
        markup: `<nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
  <ol class="govuk-breadcrumbs__list">
    <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Home</a></li>
    <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Section</a></li>
    <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Sub-section</a></li>
    <li class="govuk-breadcrumbs__list-item" aria-current="page">Current page</li>
  </ol>
</nav>`
      },
      {
        file: "collapse-on-mobile", variant: "collapse-on-mobile",
        desc: "Breadcrumbs collapsing middle levels on small screens.",
        markup: `<nav class="govuk-breadcrumbs govuk-breadcrumbs--collapse-on-mobile" aria-label="Breadcrumb">
  <ol class="govuk-breadcrumbs__list">
    <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Home</a></li>
    <li class="govuk-breadcrumbs__list-item"><a class="govuk-breadcrumbs__link" href="#">Section</a></li>
    <li class="govuk-breadcrumbs__list-item" aria-current="page">Current page</li>
  </ol>
</nav>`
      }
    ]
  },
  {
    dir: "header",
    name: "Header",
    cls: "govuk-header",
    section: "navigation",
    requiresJs: "optional",
    interaction: ["click", "focus", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page of a GOV.UK-style service", "Service name + optional navigation"],
    avoidWhen: ["Do not nest forms inside the header"],
    agentPrompt: "Set the service name in govuk-header__link--service-name. Use the with-navigation variant for top-level links; the menu toggle requires govuk-frontend JS on mobile.",
    preserve: [
      "header[role='banner'] semantics via .govuk-header",
      "Logotype link to homepage",
      "data-module='govuk-header' for menu toggle behaviour"
    ],
    editable: ["Service name text", "Navigation links", "Container width classes"],
    limitations: ["Custom colours need the blue variants — check contrast", "Navigation collapses to a menu toggle below tablet width"],
    invariants: ["Header is the page banner landmark", "Logotype links to the service start page"],
    related: ["footer", "skip-link", "breadcrumbs"],
    tags: ["header", "banner", "logo", "navigation"],
    description: "GOV.UK header with logotype, service name, and optional navigation.",
    defaultMarkup: `<header class="govuk-header" role="banner" data-module="govuk-header">
  <div class="govuk-header__container govuk-width-container">
    <div class="govuk-header__logo">
      <a href="#" class="govuk-header__link govuk-header__link--homepage">
        <span class="govuk-header__logotype">
          <span class="govuk-header__logotype-text">GOV.UK</span>
        </span>
      </a>
    </div>
    <div class="govuk-header__content">
      <a href="#" class="govuk-header__link govuk-header__link--service-name">Service name</a>
    </div>
  </div>
</header>`,  },
  {
    dir: "footer",
    name: "Footer",
    cls: "govuk-footer",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Every page — links to help, contact, privacy, and cookies"],
    avoidWhen: ["Do not place primary navigation here"],
    agentPrompt: "Edit the link sections. Keep the OGL/licence notice for official services. Component lists and two-section layouts are supported via the same classes.",
    preserve: [
      "footer element with .govuk-footer",
      "Licence notice structure for official use"
    ],
    editable: ["Section headings", "Link lists", "Meta text"],
    limitations: ["Do not overload — the footer is for secondary links"],
    invariants: ["Footer landmark semantics"],
    related: ["header"],
    tags: ["footer", "links", "licence"],
    description: "GOV.UK footer with link sections and licence notice.",
    defaultMarkup: `<footer class="govuk-footer" role="contentinfo">
  <div class="govuk-width-container">
    <div class="govuk-footer__meta">
      <div class="govuk-footer__meta-item govuk-footer__meta-item--grow">
        <h2 class="govuk-visually-hidden">Support links</h2>
        <ul class="govuk-footer__inline-list">
          <li class="govuk-footer__inline-list-item"><a class="govuk-footer__link" href="#">Help</a></li>
          <li class="govuk-footer__inline-list-item"><a class="govuk-footer__link" href="#">Cookies</a></li>
          <li class="govuk-footer__inline-list-item"><a class="govuk-footer__link" href="#">Contact</a></li>
          <li class="govuk-footer__inline-list-item"><a class="govuk-footer__link" href="#">Terms and conditions</a></li>
        </ul>
        <span class="govuk-footer__licence-description">All content is available under the <a class="govuk-footer__link" href="#">Open Government Licence v3.0</a>, except where otherwise stated</span>
      </div>
    </div>
  </div>
</footer>`,  },
  {
    dir: "back-link",
    name: "Back link",
    cls: "govuk-back-link",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["First element inside a transaction's main content", "One-step-back navigation within a question flow"],
    avoidWhen: ["As the only means of moving backward — browsers provide back", "Use breadcrumbs for hierarchical context instead"],
    agentPrompt: "Set href to the previous question's URL. Keep the visually-hidden 'Back' prefix on the link text.",
    preserve: [".govuk-back-link class", "Visually-hidden 'Back' text for screen readers"],
    editable: ["href", "Visible text"],
    limitations: ["Use javascript:history.back() only when there is no static previous URL"],
    invariants: ["Semantic <a> with meaningful accessible name"],
    related: ["skip-link", "breadcrumbs"],
    tags: ["back", "navigation", "transaction"],
    description: "Styled back link for transactional question flows.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Back link.",
        markup: `<a class="govuk-back-link" href="/previous-question">Back</a>`
      }
    ]
  },
  {
    dir: "skip-link",
    name: "Skip link",
    cls: "govuk-skip-link",
    section: "navigation",
    requiresJs: "no",
    interaction: ["focus", "keyboard"],
    pii: "none",
    audit: false,
    useWhen: ["Every page — first focusable element", "Services with significant navigation before main content"],
    avoidWhen: ["Never omit on accessible-service pages"],
    agentPrompt: "The href must target the id of the <main> element. Keep the class — the link is visually hidden until keyboard-focused.",
    preserve: [
      ".govuk-skip-link class (visually hidden until focus)",
      "First focusable element position in body",
      "Target id exists on the main content region"
    ],
    editable: ["Link text", "Anchor target id"],
    limitations: ["Must be the first element in body to be useful"],
    invariants: ["Anchor resolves to a real main-content id"],
    related: ["header", "back-link"],
    tags: ["skip", "a11y", "keyboard", "navigation"],
    description: "Visually-hidden-until-focused skip link to main content.",
    defaultMarkup: `<a class=\"govuk-skip-link\" href=\"#main-content\">Skip to main content</a>`
  },
  {
    dir: "phase-banner",
    name: "Phase banner",
    cls: "govuk-phase-banner",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Alpha and beta services (required by the Service Standard)", "Feedback links during service assessment"],
    avoidWhen: ["Live services"],
    agentPrompt: "Switch the tag text between Alpha and Beta, edit the description, and point the feedback link at your survey or email.",
    preserve: [".govuk-phase-banner__content__tag for the phase tag"],
    editable: ["Phase tag text", "Description", "Feedback link"],
    limitations: ["Remove entirely when the service goes live"],
    invariants: ["Tag conveys the phase non-visually too"],
    related: ["tag", "header"],
    tags: ["alpha", "beta", "banner", "feedback"],
    description: "Alpha/beta phase banner with feedback link.",
    defaultMarkup: `<div class=\"govuk-phase-banner\">
  <p class=\"govuk-phase-banner__content\">
    <strong class=\"govuk-tag govuk-phase-banner__content__tag\">Beta</strong>
    <span class=\"govuk-phase-banner__text\">This is a new service — your <a class=\"govuk-link\" href=\"#\">feedback</a> will help us improve it.</span>
  </p>
</div>`
  },
  {
    dir: "tabs",
    name: "Tabs",
    cls: "govuk-tabs",
    section: "navigation",
    requiresJs: "required",
    interaction: ["click", "focus", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Switching between related views of the same data"],
    avoidWhen: ["Splitting one continuous topic — use headings instead", "GOV.UK guidance discourages tabs on transactional pages"],
    agentPrompt: "Edit tab titles and panel content. Keep role='tablist'/'tab'/'tabpanel' wiring and href/#id pairing — govuk-frontend JS does the rest.",
    preserve: [
      "role='tablist' / role='tab' / role='tabpanel' structure",
      "aria-selected and tabindex management (JS-owned)",
      "List item titles as headings inside panels"
    ],
    editable: ["Tab titles", "Panel content"],
    limitations: ["Without JS all panels render stacked — content must still make sense", "Keyboard arrow navigation is JS-provided"],
    invariants: ["Real panel content reachable without JS", "tab/tabpanel ARIA relationships intact"],
    related: ["details", "accordion"],
    tags: ["tabs", "content", "views"],
    description: "Accessible tabbed content sections (GOV.UK discourages overuse).",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Tabbed content with accessible tablist.",
        markup: `<div class="govuk-tabs" data-module="govuk-tabs">
  <h2 class="govuk-tabs__title">Contents</h2>
  <ul class="govuk-tabs__list" role="tablist">
    <li class="govuk-tabs__list-item govuk-tabs__list-item--selected" role="presentation">
      <a class="govuk-tabs__tab" href="#past-day" role="tab" aria-selected="true">Past day</a>
    </li>
    <li class="govuk-tabs__list-item" role="presentation">
      <a class="govuk-tabs__tab" href="#past-week" role="tab" aria-selected="false" tabindex="-1">Past week</a>
    </li>
  </ul>
  <div class="govuk-tabs__panel" id="past-day" role="tabpanel">
    <h2 class="govuk-heading-l">Past day</h2>
    <p class="govuk-body">3,964 applications received.</p>
  </div>
  <div class="govuk-tabs__panel govuk-tabs__panel--hidden" id="past-week" role="tabpanel">
    <h2 class="govuk-heading-l">Past week</h2>
    <p class="govuk-body">27,812 applications received.</p>
  </div>
</div>`
      }
    ]
  },
  {
    dir: "prev-next",
    name: "Pagination (prev/next)",
    cls: "govuk-pagination",
    section: "navigation",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Guiding users through sequential content or paged results"],
    avoidWhen: ["Question flows — use back-link + button instead"],
    agentPrompt: "Edit labels and hrefs. Use the simple prev/next variant for sequential content; numbered lists for paginated results. Keep aria-label='Pagination'.",
    preserve: ["nav aria-label='Pagination'", "aria-current='page' on the active item"],
    editable: ["Link text", "hrefs", "Numbered vs prev/next style"],
    limitations: ["Do not mix numbered and prev/next in one control"],
    invariants: ["Pagination landmark labelled"],
    related: ["back-link", "table"],
    tags: ["pagination", "prev", "next", "navigation"],
    description: "Previous/next pagination for sequential content.",
    variants: [
      {
        file: "default", variant: "default",
        desc: "Prev/next pagination.",
        markup: `<nav class="govuk-pagination govuk-pagination--block" aria-label="Pagination">
  <ul class="govuk-pagination__list">
    <li class="govuk-pagination__item--prev">
      <a class="govuk-link govuk-pagination__link" href="#" rel="prev">
        <span class="govuk-pagination__link-title">Previous<span class="govuk-visually-hidden"> page</span></span>
      </a>
    </li>
    <li class="govuk-pagination__item--next">
      <a class="govuk-link govuk-pagination__link" href="#" rel="next">
        <span class="govuk-pagination__link-title">Next<span class="govuk-visually-hidden"> page</span></span>
      </a>
    </li>
  </ul>
</nav>`
      }
    ]
  },
  // ─── FEEDBACK ─────────────────────────────────────────────────────────────
  {
    dir: "notification-banner",
    name: "Notification banner",
    cls: "govuk-notification-banner",
    section: "feedback",
    requiresJs: "optional",
    interaction: ["focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Page-level success or important information after an action", "Telling users about something they need to know now"],
    avoidWhen: ["Field-level errors — use error messages in the form group", "Content the user can discover later"],
    agentPrompt: "Use govuk-notification-banner--success for confirmations. Edit the title (role-region label) and heading. Keep role='region' + aria-labelledby wiring.",
    preserve: [
      "role='region' + aria-labelledby pointing at the title",
      "Success variant class for confirmations",
      "data-module='govuk-notification-banner' for focus behaviour"
    ],
    editable: ["Title", "Heading", "Body HTML (lists allowed)"],
    limitations: ["Do not stack multiple banners; one message per banner"],
    invariants: ["Region labelled via aria-labelledby"],
    related: ["error-summary", "panel", "inset-text"],
    classMappingUswds: { base: "usa-alert", success: "usa-alert usa-alert--success", error: "usa-alert usa-alert--error" },
    tags: ["banner", "notification", "success", "alert"],
    description: "Page-level success and standard notification banners.",
    defaultMarkup: `<div class="govuk-notification-banner" role="region" aria-labelledby="nb-title" data-module="govuk-notification-banner">
  <div class="govuk-notification-banner__header">
    <h2 class="govuk-notification-banner__title" id="nb-title">Important</h2>
  </div>
  <div class="govuk-notification-banner__content">
    <p class="govuk-notification-banner__heading">Your appointment has been moved to 12 March</p>
  </div>
</div>`,  },
  {
    dir: "inset-text",
    name: "Inset text",
    cls: "govuk-inset-text",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Highlighting particularly important information within body content"],
    avoidWhen: ["Page-level alerts — use notification-banner", "Warning information — use warning-callout"],
    agentPrompt: "Edit the text. For important legal or eligibility points keep the wording exact — this component exists to make text unmissable.",
    preserve: [".govuk-inset-text class and left-border treatment"],
    editable: ["Text content"],
    limitations: ["Overuse dilutes emphasis — reserve for genuinely key information"],
    invariants: ["Content remains plain reading flow"],
    related: ["warning-callout", "notification-banner"],
    classMappingUswds: { base: "usa-alert" },
    tags: ["inset", "emphasis", "content"],
    description: "Emphasised key information with an inset left border.",

    defaultMarkup: `<div class="govuk-inset-text">
  <p class="govuk-body">If your application is successful, you will receive a letter within 10 working days.</p>
</div>`,    variants: [
      {
        file: "default", variant: "default",
        desc: "Inset text block.",
        markup: `<div class="govuk-inset-text">
  <p class="govuk-body">If your application is successful, you will receive a letter within 10 working days.</p>
</div>`
      }
    ]
  },
  {
    dir: "warning-callout",
    name: "Warning callout",
    cls: "govuk-warning-callout",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Critical information the user must act on or know (deadlines, penalties)"],
    avoidWhen: ["General emphasis — use inset-text", "Success feedback — use notification-banner"],
    agentPrompt: "Edit the title and body. This is not a govuk-frontend component — it is a design-system pattern, so the inline CSS in this tile is the reference implementation.",
    preserve: [".govuk-warning-callout structure with strong title element"],
    editable: ["Title text", "Body text"],
    limitations: ["Not part of govuk-frontend — styles are local to this tile"],
    invariants: ["Title remains a <strong> element inside the callout"],
    related: ["inset-text", "notification-banner"],
    tags: ["warning", "callout", "critical"],
    description: "High-visibility warning callout for critical information.",
    defaultMarkup: `<div class="govuk-warning-callout">
  <strong class="govuk-warning-callout__title">Warning</strong>
  <p class="govuk-body">You could be prosecuted if you drive without valid insurance.</p>
</div>`,  },
  {
    dir: "panel",
    name: "Panel",
    cls: "govuk-panel",
    section: "feedback",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Confirmation pages after completing a transaction", "The single most important outcome message"],
    avoidWhen: ["Anything except end-of-transaction confirmations"],
    agentPrompt: "Edit the title and reference. The reference number should be visually distinct — keep the govuk-panel__body wrapper.",
    preserve: [".govuk-panel--confirmation treatment", "h1 inside the panel on confirmation pages"],
    editable: ["Title text", "Reference number/body"],
    limitations: ["Confirmation panels carry an h1 — do not nest inside other page headings"],
    invariants: ["Single h1 per page lives in the panel on confirmation pages"],
    related: ["notification-banner"],
    tags: ["confirmation", "panel", "reference"],
    description: "Confirmation panel for transaction completion.",
    defaultMarkup: `<div class="govuk-panel govuk-panel--confirmation">
  <h1 class="govuk-panel__title">Application complete</h1>
  <div class="govuk-panel__body">Your reference number is <strong>XBR4 82PX</strong></div>
</div>`,  },
  // ─── DATA DISPLAY ─────────────────────────────────────────────────────────
  {
    dir: "table",
    name: "Table",
    cls: "govuk-table",
    section: "data-display",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Tabular data with a genuine row/column relationship"],
    avoidWhen: ["Lists that could be markup lists", "Layout purposes"],
    agentPrompt: "Edit headers and cells. Add govuk-table__header--numeric / govuk-table__cell--numeric for right-aligned numbers. Caption is required — describe what the table shows.",
    preserve: [
      "<caption> element (required)",
      "scope='col'/'row' on header cells",
      "thead/tbody structure"
    ],
    editable: ["Caption text", "Headers and cells", "Numeric modifiers"],
    limitations: ["Wide tables need a scroll container — GOV.UK recommends section-level scrolling"],
    invariants: ["Caption present", "scope attributes on headers"],
    related: ["summary-list", "prev-next"],
    classMappingUswds: { base: "usa-table" },
    tags: ["table", "data", "numbers"],
    description: "Accessible data table with caption and numeric variants.",
    defaultMarkup: `<table class="govuk-table">
  <caption class="govuk-table__caption govuk-table__caption--m">Dates and amounts</caption>
  <thead class="govuk-table__head">
    <tr class="govuk-table__row">
      <th scope="col" class="govuk-table__header">Date</th>
      <th scope="col" class="govuk-table__header">Amount</th>
    </tr>
  </thead>
  <tbody class="govuk-table__body">
    <tr class="govuk-table__row">
      <th scope="row" class="govuk-table__header">First 6 weeks</th>
      <td class="govuk-table__cell">£109.80 per week</td>
    </tr>
    <tr class="govuk-table__row">
      <th scope="row" class="govuk-table__header">Next 33 weeks</th>
      <td class="govuk-table__cell">£87.85 per week</td>
    </tr>
  </tbody>
</table>`,  },
  {
    dir: "summary-list",
    name: "Summary list",
    cls: "govuk-summary-list",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click"],
    pii: "accepts_input",
    audit: false,
    useWhen: ["Check-answers pages (values + Change links)", "Displaying key/value response data"],
    avoidWhen: ["True tabular data — use table"],
    agentPrompt: "Each row is key, value, optional action. Change links must state what they change for screen readers (visually-hidden suffix). Remove the actions column in read-only contexts with govuk-summary-list--no-border.",
    preserve: [
      "dl/dt/dd structure per row",
      "Visually-hidden context in Change links",
      "Row key/value pairing"
    ],
    editable: ["Row keys and values", "Change-link targets"],
    limitations: ["Without actions the list must still read sensibly as plain pairs"],
    invariants: ["dl semantics for key/value pairs"],
    related: ["button", "panel", "error-summary"],
    classMappingUswds: { base: "usa-summary-box" },
    tags: ["summary", "check-answers", "key-value"],
    description: "Key/value summary list with optional change actions (check answers).",
    defaultMarkup: `<dl class="govuk-summary-list">
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key">Name</dt>
    <dd class="govuk-summary-list__value">Sarah Philips</dd>
    <dd class="govuk-summary-list__actions"><a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> name</span></a></dd>
  </div>
  <div class="govuk-summary-list__row">
    <dt class="govuk-summary-list__key">Date of birth</dt>
    <dd class="govuk-summary-list__value">5 January 1979</dd>
    <dd class="govuk-summary-list__actions"><a class="govuk-link" href="#">Change<span class="govuk-visually-hidden"> date of birth</span></a></dd>
  </div>
</dl>`,  },
  {
    dir: "task-list",
    name: "Task list",
    cls: "govuk-task-list",
    section: "data-display",
    requiresJs: "no",
    interaction: ["click", "focus"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Multi-step services where users complete sections in any order"],
    avoidWhen: ["Strictly sequential steps — use step-by-step guidance instead"],
    agentPrompt: "Each task links to its section; status tags read Cannot start yet / Not started / In progress / Completed. Link only tasks that can start.",
    preserve: [
      "Task name links to the section's first page",
      "Status conveyed via tag text, not colour alone",
      "govuk-task-list__item--with-link on linked items"
    ],
    editable: ["Task names", "Statuses", "hrefs"],
    limitations: ["Statuses must be maintained server-side as the user progresses"],
    invariants: ["List semantics for tasks"],
    related: ["tag", "phase-banner"],
    tags: ["task", "steps", "progress", "multi-page"],
    description: "Task list with statuses for multi-step services.",
    defaultMarkup: `<ul class="govuk-task-list">
  <li class="govuk-task-list__item govuk-task-list__item--with-link">
    <div class="govuk-task-list__name-and-hint">
      <a class="govuk-link govuk-task-list__link" href="#">Check eligibility</a>
    </div>
    <div class="govuk-task-list__status"><strong class="govuk-tag">Completed</strong></div>
  </li>
  <li class="govuk-task-list__item govuk-task-list__item--with-link">
    <div class="govuk-task-list__name-and-hint">
      <a class="govuk-link govuk-task-list__link" href="#">Complete applicant details</a>
    </div>
    <div class="govuk-task-list__status"><strong class="govuk-tag">In progress</strong></div>
  </li>
  <li class="govuk-task-list__item">
    <div class="govuk-task-list__name-and-hint">
      <h2 class="govuk-heading-m" style="margin:0;font-weight:400;font-size:1.1875em;">Upload documents</h2>
    </div>
    <div class="govuk-task-list__status"><strong class="govuk-tag govuk-tag--grey">Cannot start yet</strong></div>
  </li>
</ul>`,  },
  {
    dir: "tag",
    name: "Tag",
    cls: "govuk-tag",
    section: "data-display",
    requiresJs: "no",
    interaction: [],
    pii: "displays_only",
    audit: false,
    useWhen: ["Status labels (Completed, In progress, Active)", "Task-list and summary statuses"],
    avoidWhen: ["Interactive controls — tags are not buttons", "Decorative labels that add no meaning"],
    agentPrompt: "Colour variants (govuk-tag--grey, --blue, --green, --red, --purple, --turquoise) map to status semantics. Colour must never be the only carrier of meaning — keep the text.",
    preserve: [".govuk-tag on a <strong> element"],
    editable: ["Text", "Colour variant class"],
    limitations: ["Do not use more than a handful of colours on one page"],
    invariants: ["Text carries the meaning, colour reinforces it"],
    related: ["task-list", "summary-list", "phase-banner"],
    classMappingUswds: { base: "usa-tag" },
    tags: ["tag", "status", "label"],
    description: "Status tags with semantic colour variants.",
    defaultMarkup: `<strong class="govuk-tag">Active</strong>`,  },
  // ─── UTILITIES ────────────────────────────────────────────────────────────
  {
    dir: "details",
    name: "Details",
    cls: "govuk-details",
    section: "utilities",
    requiresJs: "optional",
    interaction: ["click", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Progressive disclosure of help text or secondary information", "Content most users will not need"],
    avoidWhen: ["Critical information — keep it visible", "Long content that should be page sections instead"],
    agentPrompt: "Edit summary text and content. The native <details>/<summary> elements work without JS; govuk-frontend only enhances styling and behaviour.",
    preserve: [
      "Native <details>/<summary> elements",
      "govuk-details__summary-text span inside the summary"
    ],
    editable: ["Summary text", "Content HTML"],
    limitations: ["Content hidden by default — never put essential information here"],
    invariants: ["Native details/summary semantics (no ARIA reinvention)"],
    related: ["inset-text", "tabs", "accordion"],
    classMappingUswds: { base: "usa-accordion" },
    tags: ["details", "disclosure", "progressive", "content"],
    description: "Native HTML details element styled for GOV.UK disclosure.",
    defaultMarkup: `<details class="govuk-details" data-module="govuk-details">
  <summary class="govuk-details__summary">
    <span class="govuk-details__summary-text">Help with nationality</span>
  </summary>
  <div class="govuk-details__text">
    <p class="govuk-body">We need to know your nationality so we can work out which elections you're entitled to vote in.</p>
  </div>
</details>`,  },
  {
    dir: "accordion",
    name: "Accordion",
    cls: "govuk-accordion",
    section: "utilities",
    requiresJs: "required",
    interaction: ["click", "keyboard"],
    pii: "displays_only",
    audit: false,
    useWhen: ["Several related content sections users read selectively", "Long FAQ-style content"],
    avoidWhen: ["Single item — use details", "Content users must read in full"],
    agentPrompt: "Each section is h2 > button > div. Keep heading structure and data-module hook — all open/close behaviour and aria-expanded is JS-managed.",
    preserve: [
      "Section headings as h2 with nested buttons",
      "aria-expanded/aria-controls wiring (JS-owned)",
      "data-module='govuk-accordion'"
    ],
    editable: ["Section titles", "Section content"],
    limitations: ["All content hidden until JS runs — needs a no-JS fallback consideration", "Do not nest accordions"],
    invariants: ["Button-in-heading pattern for each section"],
    related: ["details", "tabs"],
    classMappingUswds: { base: "usa-accordion" },
    tags: ["accordion", "sections", "disclosure"],
    description: "Multi-section expandable accordion (govuk-frontend JS).",
    defaultMarkup: `<div class="govuk-accordion" data-module="govuk-accordion" id="acc-example">
  <div class="govuk-accordion__section">
    <h2 class="govuk-accordion__section-heading">
      <button type="button" class="govuk-accordion__section-button" aria-expanded="true" aria-controls="acc-a">
        Writing well for the web
      </button>
    </h2>
    <div id="acc-a" class="govuk-accordion__section-content" aria-labelledby="acc-a-heading">
      <p class="govuk-body">Write clearly using plain English.</p>
    </div>
  </div>
  <div class="govuk-accordion__section">
    <h2 class="govuk-accordion__section-heading">
      <button type="button" class="govuk-accordion__section-button" aria-expanded="false" aria-controls="acc-b">
        Writing well for specialists
      </button>
    </h2>
    <div id="acc-b" class="govuk-accordion__section-content" aria-labelledby="acc-b-heading" hidden>
      <p class="govuk-body">Use technical terms where precision matters.</p>
    </div>
  </div>
</div>`,  }
];

// Variant markup for components whose variants are defined inline above but
// declared without a `variants` array (single-variant components).
export function getVariants(component) {
  if (component.variants) return component.variants;
  return [
    {
      file: "default",
      variant: "default",
      desc: component.description,
      markup: null // builder renders from component.defaultMarkup
    }
  ];
}
