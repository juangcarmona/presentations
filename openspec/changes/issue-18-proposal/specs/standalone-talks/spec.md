# Spec Delta

## Purpose

Provide independently usable talk experiences that preserve the two existing narratives while supporting accessible navigation and explicit rendered review.

## ADDED Requirements

### Requirement: Content continuity
Each talk SHALL retain its original language, purpose, substantive content, examples, citations, diagram and media meaning, and narrative coverage. Scene restructuring is permitted; omissions or substantive changes MUST have explicit owner acceptance recorded in a source-to-scene coverage map.

#### Scenario: Both canonical sequences are migrated
- **WHEN** a reviewer compares each original `deck/slides.md` and every referenced page with its rendered replacement
- **THEN** the Spanish Ingeniería del Software 2.0 and English Soft & Hard Guardrails experiences account for every source unit in a coverage map with target scene identifiers, citations, media and any accepted deviations
- **AND** content/research references are cross-checked without expanding into new talks or the parked master-class edition

#### Scenario: Unaccepted omission is detected
- **WHEN** a source unit has neither equivalent rendered coverage nor an explicit owner-accepted deviation
- **THEN** content parity is reported incomplete and the migration cannot be considered complete

### Requirement: Author-only notes
Editable speaker notes SHALL remain available in talk-local author source. Author-only notes MUST NOT be included in distributed HTML, JavaScript, source maps or copied assets.

#### Scenario: Notes survive without publication
- **WHEN** the static site is built from migrated sources containing speaker notes
- **THEN** authors can locate the notes through the talk README and source map
- **AND** an output inspection confirms that author-only note text is absent from every distributed artifact

### Requirement: Keyboard-safe navigation
Each talk SHALL provide labelled previous/next controls, catalog return access and documented ArrowRight/PageDown forward and ArrowLeft/PageUp backward navigation. Navigation SHALL stop at first/last boundaries and preserve visible focus. Shortcuts MUST NOT override typing, focused interactive elements or embedded media controls.

#### Scenario: Progression and boundaries
- **WHEN** a reader uses each documented forward/back key on the talk's noninteractive scene area
- **THEN** one scene changes per non-repeated keypress in the requested direction
- **AND** the first scene cannot move backward and the last cannot move forward
- **AND** position and boundary control states remain understandable without color alone

#### Scenario: Interactive targets are protected
- **WHEN** focus is on a link, button, input, editable element, media control or embedded player, or a key has a modifier or is repeated
- **THEN** the global scene shortcut does not consume it or change the scene
- **AND** tabbing and native control activation continue to work

#### Scenario: Catalog journey by keyboard
- **WHEN** a reader enters either talk from the catalog, uses navigation buttons and returns to the catalog using only the keyboard
- **THEN** every required control is reachable, named and visibly focused with no focus trap
- **AND** after navigation hidden scene controls are not tabbable and focus remains on a persistent control or moves from removed scene content to the new scene heading

### Requirement: Accessible responsive scenes
Talks SHALL expose readable semantic content, accessible names and meaningful reading order, meet WCAG 2.2 AA normal-text contrast, and remain usable at narrow viewports. Reduced-motion preference SHALL stop scene animation without losing content or navigation. Essential content MUST NOT require graphics acceleration.

#### Scenario: Narrow and zoomed reading
- **WHEN** either talk is viewed at a 320 CSS-pixel viewport or equivalent desktop zoom
- **THEN** text and controls remain readable without horizontal page overflow or fixed-height clipping
- **AND** long code or diagrams use accessible bounded overflow or an equivalent readable representation

#### Scenario: Semantics and appearance
- **WHEN** each scene and its controls are reviewed in supported light, dark and system appearances
- **THEN** headings, language, image alternatives and control names communicate the intended content
- **AND** normal text meets AA contrast and focus indicators remain visible

#### Scenario: Motion and graphics are unavailable
- **WHEN** reduced motion is enabled or graphics acceleration is unavailable
- **THEN** all substantive content and navigation remain usable
- **AND** reduced motion uses immediate scene changes without animated decoration

### Requirement: Media resilience
Externally hosted media SHALL retain its narrative purpose with descriptive link text and a readable contextual fallback when playback is unavailable. No build SHALL require downloading external media, and no rights-uncleared reference or theme assets SHALL be required by the migrated experiences.

#### Scenario: External playback fails
- **WHEN** the Spanish talk's external video cannot load
- **THEN** the scene still identifies the video and its narrative context, provides a usable source link and allows navigation onward

#### Scenario: Asset rights are unconfirmed
- **WHEN** an existing graphic cannot be cleared for reuse
- **THEN** an original equivalent preserves its substantive meaning and attribution needs without copying uncleared assets
- **AND** a substantive change remains subject to owner acceptance under Content continuity

### Requirement: Rendered acceptance evidence
Before migration completion, both complete rendered talks and their catalog integration SHALL be available for owner visual/content review. Explicit acceptance or requested corrections SHALL be recorded; reference screenshots or automated checks alone MUST NOT count as owner acceptance.

#### Scenario: Owner reviews the actual migration
- **WHEN** the implementation is submitted for completion review
- **THEN** review evidence identifies the source revision, reproducible full build, complete preview or downloadable static artifact, coverage maps and representative desktop/narrow, navigation and reduced-motion captures
- **AND** an owner decision is linked; requested corrections remain open until resolved and accepted
