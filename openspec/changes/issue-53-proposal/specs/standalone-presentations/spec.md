## Purpose

Deliver complete talk experiences independently of the catalogue, with each talk free to own its renderer and visual language.

## ADDED Requirements

### Requirement: Independent presentation delivery
The catalogue SHALL link directly to standalone talk URLs without catalogue headers, footers or a wrapping presentation iframe. Talk source, styles and build output MUST remain talk-owned, allowing different renderers.

#### Scenario: Enter and reload a talk
- **WHEN** a visitor enters Ingeniería del Software 2.0 from the catalogue or reloads its canonical or legacy URL
- **THEN** static hosting serves the standalone talk directly, without catalogue chrome

### Requirement: Complete original narrative and media
Ingeniería del Software 2.0 MUST retain all 24 recoverable source units, examples and original visual material, including all ten owner-approved assets named in issue #53. Author notes SHALL remain preserved and excluded from public output.

#### Scenario: Review original content
- **WHEN** the visitor traverses the talk
- **THEN** the original sequence, code examples, diagrams, demonstration, branding, portrait and closing video context remain available rather than a synopsis

### Requirement: Keynote interaction
The Spanish talk SHALL fill the viewport with a deliberate animated keynote language, previous/next controls, stable scene links, keyboard navigation and explicit browser fullscreen entry/exit. Native interactive controls MUST retain their keys and navigation MUST stop at boundaries.

#### Scenario: Present with keyboard and fullscreen
- **WHEN** a presenter navigates with arrows or PageUp/PageDown and activates fullscreen
- **THEN** scenes advance without wrapping, browser history retains scene links, focus remains usable and fullscreen can be left through its control or browser Escape

#### Scenario: Fullscreen is unavailable
- **WHEN** a browser rejects fullscreen
- **THEN** a readable message appears and the viewport presentation remains navigable

### Requirement: Reduced motion and readable media
The talk MUST respect reduced-motion preferences by disabling transitions and avoiding automatic animated GIF playback. Dense visuals SHALL remain readable through full-size access and semantic explanations.

#### Scenario: Reduced-motion presentation
- **WHEN** reduced motion is requested
- **THEN** scene entrance effects stop and the demo initially presents static explanatory steps with optional user-triggered animation

### Requirement: Static verification and visual acceptance
The existing static Worker SHALL serve catalogue and talk entries. Production build and direct-route/navigation checks MUST pass; desktop previews and explicit owner visual/content acceptance SHALL be required before the redesign is called complete.

#### Scenario: Automation passes without owner review
- **WHEN** build and navigation checks pass but the owner has not reviewed the desktop preview
- **THEN** reviewable code and preview evidence are delivered with visual/content acceptance still blocked
