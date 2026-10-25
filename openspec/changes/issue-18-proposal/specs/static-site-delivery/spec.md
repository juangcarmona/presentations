# Spec Delta

## Purpose

Enable maintainers to build and verify the complete catalog and both talks from a clean checkout and publish the resulting files on an ordinary static host.

## ADDED Requirements

### Requirement: Cold full build
A fresh checkout SHALL support a documented locked public-dependency install and one full root build that emits the catalog and both complete talks without private credentials, local checkouts, pre-existing dependency directories or restored caches. Public dependency downloads are permitted; offline installation is not required.

#### Scenario: Fresh install and full output
- **WHEN** a maintainer follows the documented locked install and full root build in a fresh, cache-independent environment without private package or repository credentials
- **THEN** installation and build succeed using public dependencies
- **AND** an output manifest identifies the catalog, both talk entries, compatibility entries and all required local assets

#### Scenario: A talk cannot build
- **WHEN** either talk has invalid source or a required local asset is missing
- **THEN** the full root build fails with a diagnostic identifying the affected talk rather than publishing a catalog-only success

### Requirement: Independent active dependency path
Active authoring, build and runtime paths for both talks SHALL require no Slidev, Slidev themes, private repositories, local filesystem dependencies or replacement packaged presentation framework. Historical references and unused installed skills need not be removed. Required dependency resolutions SHALL be locked and publicly obtainable.

#### Scenario: Dependency independence audit
- **WHEN** manifests, active lockfiles, build commands and runtime imports are audited and the full build runs
- **THEN** no required dependency or command uses an excluded presentation runtime, private source or local checkout
- **AND** a preserved historical reference is not mistaken for an active dependency

### Requirement: Static entry points and legacy continuity
Generated files SHALL serve the catalog, both canonical talk entry points and both existing deck entry points without an application server, authenticated API or catch-all rewrite. Direct loads, reloads, scene links and local assets SHALL work on the documented static-host setup.

#### Scenario: Every public entry loads directly
- **WHEN** only generated files are served by a directory-index static server without SPA fallback
- **THEN** `/`, `/software-engineering-2_0/`, `/soft-and-hard-guardrails/`, `/decks/software-engineering-2_0/` and `/decks/soft-and-hard-guardrails/` each load the intended catalog or talk on first request and reload
- **AND** required local assets resolve successfully from every entry

#### Scenario: Scene URL recovery
- **WHEN** a reader directly loads or reloads a canonical or legacy talk URL containing a valid scene fragment
- **THEN** the identified scene is displayed and subsequent navigation uses the same talk
- **AND** an unknown or missing scene fragment recovers to the first scene without a broken page

### Requirement: Clean CI verification
CI SHALL verify locked installation and the full root build from a clean environment with no restored dependency cache or private dependency credentials. A failed talk SHALL fail verification. Existing Lighthouse checks and publication guardrails MUST remain separate and unweakened.

#### Scenario: Cold verification run
- **WHEN** the full-site verification job runs for a proposed source revision
- **THEN** it records clean install and complete build logs plus a manifest of all deliverables
- **AND** it restores no dependency directories or package-manager cache
- **AND** a controlled invalid-talk fixture proves that a talk failure fails verification

### Requirement: Author build contract
Repository and talk documentation SHALL identify canonical editable sources, author-only notes, supported navigation, the locked install/full build/preview commands, generated output and static-host assumptions. Active instructions MUST NOT require retired Slidev commands; historical research and third-party skill provenance SHALL remain intact.

#### Scenario: Maintainer follows the documented path
- **WHEN** a maintainer follows root and talk README instructions from a fresh checkout
- **THEN** those instructions produce and preview the complete site and explain direct static serving without SPA fallback
- **AND** they distinguish generated files from editable scenes and notes, disclose external media limitations and identify the separate owner review and publication gates
