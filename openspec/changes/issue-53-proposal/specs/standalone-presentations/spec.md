## Purpose

Let audiences enter each talk as an independent presentation while preserving its authored narrative, media and presentation identity.

## ADDED Requirements

### Requirement: Independent talk entry
The catalogue SHALL link directly to the standalone presentation at a stable URL. The presentation MUST NOT be surrounded by catalogue header/footer, an article summary or an embedding iframe.

#### Scenario: Enter from catalogue
- **WHEN** a visitor opens Ingeniería del Software 2.0 from the catalogue
- **THEN** the talk fills the viewport with its own presentation interface and no catalogue shell

### Requirement: Preserved authored material
The presentation SHALL retain the full original 24-part narrative, examples and media recoverable from the cited baseline and publish all ten assets approved in issue #53. Speaker notes MUST remain preserved separately and outside public bundles.

#### Scenario: Original material is available
- **WHEN** the audience navigates the complete talk
- **THEN** all original topics, exact code examples, diagrams, branding, portrait and video context are available, including the controllable original GIF demo

### Requirement: Usable presentation controls
The talk SHALL provide previous/next keyboard navigation, stable scene links, visible browser fullscreen entry/exit controls and a deliberate animated visual identity. It MUST respect reduced motion and preserve native interactive controls' keys.

#### Scenario: Navigate and leave fullscreen
- **WHEN** a visitor navigates by arrows or PageUp/PageDown and enters browser fullscreen
- **THEN** scene history remains usable and a visible control permits leaving fullscreen

#### Scenario: Reduced motion or denied fullscreen
- **WHEN** reduced motion is preferred or fullscreen is unavailable
- **THEN** content and navigation remain usable without scene animation or automatically playing media

### Requirement: Independent static delivery
Talk source and intermediate build output SHALL stay under the talk directory. The catalogue SHALL own only this talk's metadata and links, not its renderer. The static Worker SHALL serve catalogue, canonical talk and compatibility URLs with complete local assets, without requiring a backend or a common renderer for future talks.

#### Scenario: Direct-route reload
- **WHEN** a visitor opens or reloads either existing talk URL with a scene fragment
- **THEN** the correct scene and local assets load from the static distribution

### Requirement: Owner preview decision
The redesign MUST provide desktop preview evidence and MUST NOT be assessed complete until the owner gives visual/content acceptance.

#### Scenario: Automated checks pass before review
- **WHEN** build and navigation checks pass but owner acceptance has not been supplied
- **THEN** the code remains reviewable and completion is explicitly blocked on owner review
