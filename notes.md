# Turborepo basic setup using tw-example

Turbo repo doesn’t have a walk through setup guide, it uses example repos for the developer to explore.

**Goals:**

- Understand how turborepo manages the workspace
- Setup two apps that access a shared library - have turborepo manage shared typescript, packages, tests, etc

**Tasks:**

1. Download and play with an example
2. Create a new template that does React instead of Next.JS (maybe iterate from the example?

**Links:**

Next.js https://github.com/vercel/turborepo/tree/main/examples/with-tailwind

https://turborepo.com/docs/crafting-your-repository

Client Side Rendering https://github.com/vercel/turborepo/tree/main/examples/with-vite-react

https://vite.dev/guide/

**How packages hang together - Utilising shared component library**

- Shared resources are housed within packages
- eslint-config, tailwind-config, typescript-config as well as components
- The example below shows file structure of what it looks like to add a new consumable package

![file-structure](./assets/Screenshot%202025-06-11%20at%2016.18.00.png)

- Ensure to include it as dependency in relevant app package

```
{
  "name": "web",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    ...
  },
  "dependencies": {
    "@repo/ui": "workspace:*",
    "@repo/button": "workspace:*", <-- this line
    ...
  },
  "devDependencies": {
    ...
  }
}

```

- Run `pnpm install` to add the new package (turbo repo will symlink it)
- I never did quite figure out why i couldn’t make it work without using /index… but add using:

```tsx
import { Button } from "@repo/button/index";
```

**Adding a new client side rendering react app**

- Stripped code

  ```tsx
  // tsconfig.node.json
  {
    "compilerOptions": {
      "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
      "target": "ES2022",
      "lib": ["ES2023"],
      "module": "ESNext",
      "skipLibCheck": true,

      /* Bundler mode */
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "verbatimModuleSyntax": true,
      "moduleDetection": "force",
      "noEmit": true,

      /* Linting */
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "erasableSyntaxOnly": true,
      "noFallthroughCasesInSwitch": true,
      "noUncheckedSideEffectImports": true
    },
    "include": ["vite.config.ts"]
  }

  // tsconfig.app.json
  {
    "compilerOptions": {
      "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
      "target": "ES2020",
      "useDefineForClassFields": true,
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "skipLibCheck": true,

      /* Bundler mode */
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "verbatimModuleSyntax": true,
      "moduleDetection": "force",
      "noEmit": true,
      "jsx": "react-jsx",

      /* Linting */
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "erasableSyntaxOnly": true,
      "noFallthroughCasesInSwitch": true,
      "noUncheckedSideEffectImports": true
    },
    "include": ["src"]
  }

  ```

- cd into apps
- Basically follow setup from vite, ie running and following prompts: `pnpm create vite`
- Created a `vite.json` to sit within `packages/typescript-config`
- Got rid of `tsconfig.node.json` and `tsconfig.app.json` _(not sure if they we conflicting with workspace settings)_
- Updated the `tsconfig.json` with in the new app:

  ```tsx
  {
    "extends": "@repo/typescript-config/vite.json",
    "include": ["src"],
    "compilerOptions": {
      "jsx": "react-jsx",
      "module": "NodeNext",
      "moduleResolution": "NodeNext"
    }
  }

  ```

- Update the `vite.config.ts` with in the new app:

  ```tsx
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  import path from "path";

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@repo/ui": path.resolve(__dirname, "../../packages/ui/src"),
      },
    },
  });
  ```

- Updated the package.json to align the same devDeps as the other app
  ```tsx
  {
    "name": "web-client-side",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc -b && vite build",
      "lint": "eslint .",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^19.1.0",
      "react-dom": "^19.1.0",
      "@repo/ui": "workspace:*"
    },
    "devDependencies": {
      "@eslint/js": "^9.25.0",
      "@types/react": "^19.1.0",
      "@types/react-dom": "^19.1.1",
      "@vitejs/plugin-react": "^4.4.1",
      "eslint": "^9.28.0",
      "eslint-plugin-react-hooks": "^5.2.0",
      "eslint-plugin-react-refresh": "^0.4.19",
      "globals": "^16.0.0",
      "typescript": "5.8.2",
      "typescript-eslint": "^8.30.1",
      "vite": "^6.3.5",
      "@next/eslint-plugin-next": "^15.3.0",
      "@repo/eslint-config": "workspace:*",
      "@repo/tailwind-config": "workspace:*",
      "@repo/typescript-config": "workspace:*",
      "@tailwindcss/postcss": "^4.1.5",
      "@types/node": "^22.15.30",
      "autoprefixer": "^10.4.20",
      "postcss": "^8.5.3",
      "tailwindcss": "^4.1.5"
    }
  }
  ```
- Haven’t gotten tailwind working yet…
