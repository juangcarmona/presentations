# Migration coverage

Baseline revision (host-supplied): `b502b83ed4c99758f384cf6465b26d6764266f00`.

Canonical public source is now `deck/experience.tsx`. Section labels and layouts are restyled; narrative order and original languages remain. Notes are verbatim in `content/speaker-notes.md`. Research remains historical context, not a second active deck.

| Original source | Scene ID | Content / examples / citations / media | Notes | SHA-256 of original source |
| --- | --- | --- | --- | --- |
| deck/slides.md | `cover` | Soft & Hard Guardrails; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#cover) | `4fe90e10d4b926dc559c66cb21ba0fe193597dbf0baf4ee406f0af3033fa2490` |
| deck/pages/01-definition.md | `01-definition` | Guardrails are constraints that keep changes within acceptable boundaries; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#01-definition) | `cca776610c4bc63e86b41a5913b4d45ea253d8fe0ad1d62c4b6ee665246eb278` |
| deck/pages/02-soft-vs-hard.md | `02-soft-vs-hard` | Two kinds of guardrails; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#02-soft-vs-hard) | `9e53010c4a591a2c9e58814053b15e9907900020da0a43a7d8d820aefbee7b70` |
| deck/pages/03-soft-examples.md | `03-soft-examples` | Examples of soft guardrails; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#03-soft-examples) | `9f762f55fb5248879a92c4a45cb57657750f95216e636e20cf8b86753612391c` |
| deck/pages/04-soft-concrete.md | `04-soft-concrete` | Soft guardrails in practice; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#04-soft-concrete) | `4bc284f7f69544e59c0b4466b88a3d60cf4c3e9da6e573e97f0376836d42e829` |
| deck/pages/05-hard-section.md | `05-hard-section` | When the tooling refuses; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#05-hard-section) | `79b0e112f81ba847fc174f62f843c10419563126ec7417b94f950f0281824d6e` |
| deck/pages/06-hard-map.md | `06-hard-map` | Four enforcement surfaces; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#06-hard-map) | `9bd802292c76c2b12b0bd00784ff61a06e183cfbf1a5e00685d9a801819eddd8` |
| deck/pages/07-hard-compile.md | `07-hard-compile` | 1 · Build-time: the build fails; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#07-hard-compile) | `42887d9bfad649c3c85115ca8d043e4c41a01719c135a024f16cc10327a70931` |
| deck/pages/08-console-compile.md | `08-console-compile` | A dependency edge, rejected at project load; 1 code blocks (exact text verified) | [No original note](speaker-notes.md#08-console-compile) | `373fb3badcc249b657bca25500491c5685016991244fbe9b1a71d7e1525609ae` |
| deck/pages/09-hard-commit-ci.md | `09-hard-commit-ci` | 2 · Commit & 3 · CI: the change won't exist, won't land; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#09-hard-commit-ci) | `c9cb7c67ac702ae11dd386f35bc4f8e8d1713e4f9ca5720b7deb29ed01d10eeb` |
| deck/pages/10-console-adoption.md | `10-console-adoption` | A <button> the design system never saw; 1 code blocks (exact text verified) | [No original note](speaker-notes.md#10-console-adoption) | `a2db2817670b3dba399579dd994d5d3edf63c9d9666c8508ba049ceeb736832c` |
| deck/pages/11-hard-agent.md | `11-hard-agent` | 4 · Agent harness: the agent is refused; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#11-hard-agent) | `8983740a968765daf86d3dd055705a7ffc467c1495774ae1f161bdc371a83b44` |
| deck/pages/12-console-agent.md | `12-console-agent` | A failing test that looks green; 1 code blocks (exact text verified) | [No original note](speaker-notes.md#12-console-agent) | `96e4c08cefb3560752ecdfd8f727d3186678ce1f78d0628330af3aadc0cddeaa` |
| deck/pages/13-hard-philosophy.md | `13-hard-philosophy` | The philosophy behind stage 4; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#13-hard-philosophy) | `6d80ada548a3f0649bd44481084ac6351a9a64bcd6859a63452393a8cf405444` |
| deck/pages/14-takeaway.md | `14-takeaway` | Some soft guardrails deserve to become hard; 0 code blocks (exact text verified) | [No original note](speaker-notes.md#14-takeaway) | `641ccfc92a8502803ea4f8e391f9c7c80ecca06f3e7ebdab2aec5706ac83c637` |

## Assets and deviations requiring rendered review

This English experience imports no image, theme or reference-owned assets. Its guide/constrain motif and four enforcement surfaces are original CSS/semantic DOM; console examples remain selectable text. The concept HTML and derived extracts remain research, not runtime imports. No reuse rights are inferred from public availability. No omission or substantive deviation is claimed accepted; the owner must review the complete rendered content against the original sequence.

## Verification boundary

The source fingerprints and extraction records above were supplied by the implementation seed, not regenerated from retired Markdown during this continuation. Automated checks account for all 15 mapped units and compare rendered titles/code with the seeded fixture. They do not establish full prose, citation or visual equivalence; that comparison remains part of required owner content review.
