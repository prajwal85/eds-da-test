# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--eds-da-test--prajwal85.aem.page/
- Live: https://main--eds-da-test--prajwal85.aem.live/

## Graduate page

`/graduate` imports the main content of
https://www.mccoy.txst.edu/graduate.html using Adobe's page-import workflow.
The existing site header and footer are retained.

- DA editor: https://da.live/edit#/prajwal85/eds-da-test/graduate
- Branch preview: https://migration-graduate--eds-da-test--prajwal85.aem.page/graduate
- Canonical DA source: [migration-content/graduate.html](migration-content/graduate.html).
  This is an upload artifact, excluded from Code Bus by `.hlxignore`.
- Apply the page metadata `Theme: graduate` to load the isolated
  [graduate stylesheet](styles/graduate.css). Other pages are not restyled.
- Reused blocks: Hero (graduate / graduate-next-step), Cards
  (graduate-programs), Columns (graduate-advisor / graduate-accreditation).
- The [Table block](blocks/table/table.js) adapts Adobe's Block Collection
  model: the first row supplies column headings, remaining rows supply data.
  The `graduate-deadlines` variant displays labeled rows on small screens.
- Content images live in DA under `/media/graduate`; authored image URLs
  must be absolute `https://content.da.live/prajwal85/eds-da-test/...` URLs.
  Preview ingests them into responsive Media Bus images.
- Public Sans and Nunito Sans are self-hosted with their SIL Open Font
  Licenses in `fonts/`. Nunito Sans is the approved open-license substitute
  for the source's commercial Halis GR headings. Size-adjusted local fallbacks
  reduce font-swap layout shifts; the graduate hero image loads eagerly with
  high fetch priority.
- The seven program icons are Font Awesome Free 7.0.0 SVGs; attribution and
  license are retained in `icons/graduate-fontawesome-license.txt`.
- Unmigrated program/admissions pages link back to the source site.
  Preserve both Apply Now destinations: the introduction and campus CTA
  intentionally use different application URLs.

After authoring, trigger preview separately. Publishing content and merging
code to `main` require the migration's G5 authorization; a DA upload or
preview is not a live publish.

## Documentation

Before using the aem-boilerplate, we recommend you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template
1. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
1. Start AEM Proxy: `aem up` (opens your browser at `http://localhost:3000`)
1. Open the `eds-da-test` directory in your favorite IDE and start coding :)
