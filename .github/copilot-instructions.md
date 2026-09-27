# Project guidance for GitHub Copilot

## Typst editorial documents

- Typst sources live under `editorial/`; the current document is `editorial/koborebanasi.typ`.
- Compile the document with `npm run typst:compile` after changing a `.typ` file.
- Keep generated PDFs under `.tmp/`; do not add generated output to source control.
- The document language is Japanese. Preserve Japanese text and use Typst syntax rather than Markdown syntax inside `.typ` files.
- Preserve the existing mathematical notation style, including `$...$` for inline math and `#link(...)` for links.
- `@preview/fletcher:0.5.8` is used for diagrams. Keep its import and named labels consistent with the existing document.
- When changing a proof or algorithm explanation, check the corresponding Markdown draft in `editorial/` for intended meaning.
- Report Typst compile errors before proposing unrelated refactors.

## Validation

- For TypeScript changes, run `npm run lint` and `npx tsc --noEmit` as appropriate.
- For Typst changes, run `npm run typst:compile`.
