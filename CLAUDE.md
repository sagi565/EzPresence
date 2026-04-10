# EzPresence — Claude Conventions Reference

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.2 + TypeScript 5.2 |
| Build tool | Vite 5.2 |
| Styling | styled-components 6 (CSS-in-JS) |
| Routing | React Router DOM v6 |
| Auth / DB | Firebase 12 |
| State | React Context API + custom hooks |
| Drag & drop | @dnd-kit + @hello-pangea/dnd |
| Charts | Recharts |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── auth/           # AuthProvider, ProtectedRoute
├── components/     # Feature-organized UI components (50+)
├── context/        # React Context providers
├── hooks/          # Custom hooks, organized by domain
├── lib/            # Firebase config (firebase.ts)
├── models/         # TypeScript interfaces/types
├── pages/          # Route-level page components
├── theme/          # Theme config, ThemeContext, GlobalStyles
├── utils/          # Utility functions (apiClient, fileUtils, etc.)
└── styles/         # Shared global styles
```

---

## Path Aliases

All aliases resolve from `src/`. Defined in both `vite.config.ts` and `tsconfig.json`.

```
@  or @/    →  src/
@components →  src/components
@pages      →  src/pages
@hooks      →  src/hooks
@models     →  src/models
@auth       →  src/auth
@lib        →  src/lib
@theme      →  src/theme
@utils      →  src/utils
@context    →  src/context
```

Always use aliases for imports — never relative `../../` paths across feature boundaries.

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Components | PascalCase | `SchedulerPage`, `AuthField` |
| Component files | PascalCase | `AuthField.tsx` |
| Hooks | camelCase, `use` prefix | `useBrands`, `useSchedules` |
| Hook files | camelCase | `useBrands.ts` |
| Utility files | camelCase | `apiClient.ts`, `fileUtils.ts` |
| Type/Interface | PascalCase | `Post`, `Brand`, `AuthFieldProps` |
| Model files | PascalCase | `Post.ts`, `Brand.ts` |
| Styled exports | PascalCase | `Wrapper`, `Label`, `Container` |
| Context hooks | `use{Feature}Context` or `use{Feature}` | `useBrandContext`, `useAppTheme` |

---

## Component Pattern

Every non-trivial component lives in its own folder with a co-located styles file. **Never add `index.ts` barrel files** — import directly from the component file.

```
src/components/FeatureName/ComponentName/
├── ComponentName.tsx   # Component logic + JSX
└── styles.ts           # Styled-components exports
```

**ComponentName.tsx**
```tsx
type ComponentNameProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

const ComponentName: React.FC<ComponentNameProps> = ({ label, value, onChange }) => {
  return <Wrapper>...</Wrapper>;
};

export default ComponentName;
```

**styles.ts**
```ts
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  gap: 8px;
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.muted};
`;
```

---

## Page Pattern

Every page lives in its own folder under `src/pages/`, with a co-located styles file. Same rules as components: **no `index.ts`**, **no `components/` subfolder inside pages**. Sub-components always go in `src/components/`.

```
src/pages/FeatureName/PageName/
├── PageName.tsx    # Page logic + JSX (no styled-components inline)
└── styles.ts       # Styled-components exports for this page
```

Import pages directly: `import VisionPage from '@pages/Studio/VisionPage/VisionPage'`

---

## Custom Hooks Pattern

- Live in `src/hooks/{domain}/use{Feature}.ts`
- Return a consistent shape: `{ data, loading, error, ...actions }`

```ts
// src/hooks/brands/useBrands.ts
const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ...fetch logic...

  return { brands, loading, error, refetchBrands };
};

export default useBrands;
```

---

## Context Pattern

- Providers live in `src/context/`
- Always export a named `use{Feature}` hook that wraps `useContext` — consumers never import the context object directly

```ts
// src/context/BrandContext.tsx
export const useBrandContext = () => useContext(BrandContext);
```

---

## Models

Plain TypeScript `interface` or `type` declarations — no classes, no decorators.

```ts
// src/models/Post.ts
export interface Post {
  id: string;
  brandId: string;
  scheduledAt: string;
  platforms: Platform[];
  // ...
}
```

---

## Theme System

Config: `src/theme/theme.ts`

**Key colors:**
- Primary: `#9b5de5` (purple)
- Secondary: `#fbbf24` (yellow/gold)
- Teal: `#14b8a6`
- Blue: `#3b82f6`
- Pink: `#ec4899`

**Modes:** light and dark (toggled via `useAppTheme()`, persisted in localStorage)

**Gradient presets:** `innovator`, `momentum`, `balance`, `vibe`

**Breakpoints:** mobile 768px / tablet 1024px / desktop 1400px

Access theme inside styled-components via `${({ theme }) => theme.colors.primary}` — never hardcode colors.

---

## Environment Files

| File | Purpose |
|------|---------|
| `.env.local` | Firebase credentials (shared across all modes) |
| `.env.dev1` | API URL → `192.168.1.12:7291`, port 5173 |
| `.env.dev2` | API URL → `192.168.1.145:7291`, port 5174 |

All env vars are prefixed `VITE_` and accessed via `import.meta.env.VITE_*`.

---

## Dev Scripts

```bash
npm run dev       # Default dev server, port 5173
npm run dev:1     # dev1 environment, port 5173
npm run dev:2     # dev2 environment, port 5174

npm run build     # Production build
npm run build:1   # Build for dev1
npm run build:2   # Build for dev2

npm run preview   # Preview production build
npm run lint      # ESLint
```

Vite is configured with HTTPS (via `@vitejs/plugin-basic-ssl`) and host `192.168.1.27`.

---

## API Client

All HTTP calls go through `src/utils/apiClient.ts`. Do not use `fetch` or axios directly in components or hooks — always use the shared client so auth headers and base URL are handled consistently.
See the api structure with this: `https://192.168.1.12:7291/swagger/v1/swagger.json` json file.
