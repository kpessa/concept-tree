# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

```
concept-tree,
├─ $lib,
│  └─ components,
│     └─ ui,
│        └─ index.ts,
├─ .npmrc,
├─ .prettierignore,
├─ .prettierrc,
├─ components.json,
├─ eslint.config.js,
├─ jsconfig.json,
├─ package-lock.json,
├─ package.json,
├─ postcss.config.js,
├─ README.md,
├─ src,
│  ├─ app.d.ts,
│  ├─ app.html,
│  ├─ app.postcss,
│  ├─ lib,
│  │  ├─ components,
│  │  │  ├─ AtomicConcept.svelte,
│  │  │  ├─ CodeBlock.svelte,
│  │  │  ├─ ComplexConcept.svelte,
│  │  │  ├─ ConceptBuilder.svelte,
│  │  │  ├─ ConceptCard.svelte,
│  │  │  ├─ ConceptSearch.svelte,
│  │  │  ├─ ConceptTable.svelte,
│  │  │  ├─ ConceptTree.svelte,
│  │  │  ├─ CSVProcessor.svelte,
│  │  │  ├─ JSONImporter.svelte,
│  │  │  ├─ NodeDetail.svelte,
│  │  │  ├─ TreeGraph.svelte,
│  │  │  ├─ ui,
│  │  │  │  ├─ badge,
│  │  │  │  │  ├─ badge.svelte,
│  │  │  │  │  └─ index.js,
│  │  │  │  ├─ button,
│  │  │  │  │  ├─ button.svelte,
│  │  │  │  │  └─ index.js,
│  │  │  │  ├─ card,
│  │  │  │  │  ├─ card-content.svelte,
│  │  │  │  │  ├─ card-description.svelte,
│  │  │  │  │  ├─ card-footer.svelte,
│  │  │  │  │  ├─ card-header.svelte,
│  │  │  │  │  ├─ card-title.svelte,
│  │  │  │  │  ├─ card.svelte,
│  │  │  │  │  └─ index.js,
│  │  │  │  ├─ checkbox,
│  │  │  │  │  ├─ checkbox.svelte,
│  │  │  │  │  └─ index.js,
│  │  │  │  ├─ index.js,
│  │  │  │  ├─ input,
│  │  │  │  │  ├─ index.js,
│  │  │  │  │  └─ input.svelte,
│  │  │  │  ├─ label,
│  │  │  │  │  ├─ index.js,
│  │  │  │  │  └─ label.svelte,
│  │  │  │  ├─ select,
│  │  │  │  │  ├─ index.js,
│  │  │  │  │  ├─ select-content.svelte,
│  │  │  │  │  ├─ select-item.svelte,
│  │  │  │  │  ├─ select-label.svelte,
│  │  │  │  │  ├─ select-separator.svelte,
│  │  │  │  │  └─ select-trigger.svelte,
│  │  │  │  ├─ table,
│  │  │  │  │  ├─ index.js,
│  │  │  │  │  ├─ table-body.svelte,
│  │  │  │  │  ├─ table-caption.svelte,
│  │  │  │  │  ├─ table-cell.svelte,
│  │  │  │  │  ├─ table-footer.svelte,
│  │  │  │  │  ├─ table-head.svelte,
│  │  │  │  │  ├─ table-header.svelte,
│  │  │  │  │  ├─ table-row.svelte,
│  │  │  │  │  └─ table.svelte,
│  │  │  │  ├─ textarea,
│  │  │  │  │  ├─ index.js,
│  │  │  │  │  └─ textarea.svelte,
│  │  │  │  ├─ toggle,
│  │  │  │  │  ├─ index.js,
│  │  │  │  │  └─ toggle.svelte,
│  │  │  │  └─ toggle-group,
│  │  │  │     ├─ index.js,
│  │  │  │     ├─ toggle-group-item.svelte,
│  │  │  │     └─ toggle-group.svelte,
│  │  │  └─ ZoomControl.svelte,
│  │  ├─ exampleConcepts.ts,
│  │  ├─ index.js,
│  │  ├─ stores,
│  │  │  ├─ conceptStore.js,
│  │  │  └─ configStore.js,
│  │  ├─ types.ts,
│  │  └─ utils.js,
│  └─ routes,
│     ├─ +layout.svelte,
│     ├─ +page.svelte,
│     ├─ concept-examples,
│     │  └─ +page.svelte,
│     ├─ concepts,
│     │  └─ +page.svelte,
│     ├─ config-graph,
│     │  └─ +page.svelte,
│     ├─ config-import,
│     │  └─ +page.svelte,
│     ├─ csv-processor,
│     │  └─ +page.svelte,
│     └─ tree,
│        └─ +page.svelte,
├─ static,
│  ├─ data,
│  │  ├─ concepts_100.csv,
│  │  ├─ concepts_1000.csv,
│  │  ├─ concepts_3000.csv,
│  │  ├─ concepts_ea.csv,
│  │  └─ htg.json,
│  └─ favicon.png,
├─ svelte.config.js,
├─ tailwind.config.js,
├─ tsconfig.json,
├─ vercel.json,
├─ vite.config.js,
└─ vite.config.ts,

```