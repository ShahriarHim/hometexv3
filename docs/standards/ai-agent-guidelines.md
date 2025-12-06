# AI Agent Guidelines for Hometex V3

This document provides specific guidelines for AI agents (Cursor AI, GitHub Copilot, ChatGPT, etc.) working on this Next.js project.

## 🎯 Core Principles

1. **Follow Existing Patterns**: Always check similar code before creating new code
2. **Type Safety First**: Never use `any`, always define proper types
3. **Centralized Configuration**: Use `env` and `api` from `src/lib/`
4. **Server Components Default**: Only use Client Components when needed
5. **Error Handling**: Always handle errors properly

## 📋 Mandatory Rules

### 1. Environment Variables

```typescript
// ✅ ALWAYS DO THIS
import { env } from "@/lib/env";
const apiUrl = env.apiBaseUrl;

// ❌ NEVER DO THIS
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiUrl = "https://www.hometexbd.ltd";
```

### 2. API Calls

```typescript
// ✅ ALWAYS DO THIS
import { api } from "@/lib/api";
const products = await api.products.getAll();

// ❌ NEVER DO THIS
const response = await fetch("https://api.example.com/products");
```

### 3. TypeScript Types

```typescript
// ✅ ALWAYS DO THIS
interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

// ❌ NEVER DO THIS
const ProductCard = ({ product, onAddToCart }: any) => { ... }
```

### 4. Component Structure

```typescript
// ✅ Server Component (default)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await api.products.getById(id);
  return <ProductView product={data} />;
}

// ✅ Client Component (only when needed)
"use client";
export const ProductView = ({ product }: { product: Product }) => {
  const [state, setState] = useState();
  return <div>...</div>;
};
```

## 📁 File Organization

### Where to Put Files

- **Components**: `src/components/[feature]/ComponentName.tsx`
- **Page Views**: `src/views/ViewName.tsx`
- **Utilities**: `src/lib/utilityName.ts`
- **Types**: `src/types/index.ts`
- **Hooks**: `src/hooks/use-hook-name.tsx`
- **Context**: `src/context/ContextName.tsx`

### Naming Conventions

- Components: `PascalCase.tsx` → `ProductCard.tsx`
- Utilities: `camelCase.ts` → `formatPrice.ts`
- Hooks: `use-kebab-case.tsx` → `use-mobile.tsx`
- Types: `PascalCase` → `Product`, `CartItem`

## 🔍 Before Writing Code

Ask yourself:

1. ✅ Is this a Server or Client Component?
2. ✅ Do I need `env` from `@/lib/env`?
3. ✅ Should I use `api` from `@/lib/api`?
4. ✅ Are all types defined?
5. ✅ Is error handling implemented?
6. ✅ Does this follow existing patterns?
7. ✅ Is the file in the correct location?

## 📝 Code Templates

### New Component

```typescript
"use client"; // Only if needed

import React from "react";
import type { Product } from "@/types";

interface ComponentNameProps {
  // Define props
}

export const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  // Hooks
  // Event handlers
  // Effects
  // Render
  return <div>...</div>;
};

export default ComponentName;
```

### New API Function

```typescript
// Add to src/lib/api.ts
export const api = {
  // ... existing
  newFeature: {
    getData: async (): Promise<ResponseType> => {
      const response = await fetchPublicWithFallback("/api/endpoint", env.apiBaseUrl, {
        method: "GET",
      });
      if (!response.ok) throw new Error("Failed");
      return response.json();
    },
  },
};
```

### New Context

```typescript
"use client";

import React, { createContext, useContext, useState } from "react";

interface ContextType {
  // Define shape
}

const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Logic
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error("useContext must be used within ContextProvider");
  return context;
};
```

## ❌ Common Mistakes to Avoid

1. ❌ Hardcoding URLs
2. ❌ Using `any` type
3. ❌ Using `process.env` directly
4. ❌ Using `fetch` directly
5. ❌ Missing error handling
6. ❌ Wrong file location
7. ❌ Incorrect naming
8. ❌ Mixing Server/Client patterns
9. ❌ No TypeScript types
10. ❌ Skipping Prettier formatting

## ✅ Checklist

Before submitting AI-generated code:

- [ ] Uses `env` from `@/lib/env`
- [ ] Uses `api` from `@/lib/api`
- [ ] All types defined (no `any`)
- [ ] Error handling implemented
- [ ] Follows existing patterns
- [ ] File in correct location
- [ ] Proper naming convention
- [ ] Formatted with Prettier
- [ ] No ESLint errors
- [ ] TypeScript compiles

## 📚 Reference Files

- `.cursorrules` - Cursor-specific rules
- `CODING_STANDARDS.md` - Full coding standards
- `README.md` - Project documentation
- `src/lib/env.ts` - Environment config
- `src/lib/api.ts` - API client

---

**Remember**: When in doubt, check existing code and follow those patterns!
