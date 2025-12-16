# Hometex V3 - Coding Standards & Best Practices

This document defines the coding standards, architecture patterns, and best practices for the Hometex V3 project. **All developers and AI agents must follow these standards.**

## 📋 Table of Contents

1. [Project Architecture](#project-architecture)
2. [File & Folder Structure](#file--folder-structure)
3. [Naming Conventions](#naming-conventions)
4. [Code Style & Formatting](#code-style--formatting)
5. [TypeScript Standards](#typescript-standards)
6. [Next.js App Router Patterns](#nextjs-app-router-patterns)
7. [Component Patterns](#component-patterns)
8. [API & Data Fetching](#api--data-fetching)
9. [State Management](#state-management)
10. [Error Handling](#error-handling)
11. [Performance Guidelines](#performance-guidelines)
12. [Security Standards](#security-standards)
13. [Testing Requirements](#testing-requirements)

---

## 🏗️ Project Architecture

### Core Principles

1. **App Router First**: Always use Next.js 16 App Router patterns
2. **Server Components by Default**: Use Server Components unless client-side interactivity is required
3. **Type Safety**: Strict TypeScript with no `any` types (except for Next.js Route types)
4. **Centralized Configuration**: All configs in `src/lib/`
5. **Environment Variables**: Always use `src/lib/env.ts` for environment access
6. **Error Boundaries**: Wrap components that might fail
7. **Internationalization**: All user-facing text must be i18n-ready

### Folder Structure

```
src/
├── app/                    # Next.js App Router (Server Components by default)
│   ├── [locale]/          # Internationalized routes
│   ├── globals.css        # Global styles
│   └── providers.tsx      # App-level providers
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components (DO NOT MODIFY)
│   ├── layout/           # Layout components (Header, Footer)
│   └── [feature]/        # Feature-specific components
├── views/                 # Page-level components (Client Components)
├── lib/                   # Utilities, helpers, configurations
│   ├── env.ts            # Environment variables (USE THIS, NOT process.env)
│   ├── api.ts            # API client functions
│   └── utils.ts          # Utility functions
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── i18n/                  # Internationalization config
└── styles/                # CSS modules (when needed)
```

---

## 📁 File & Folder Structure

### Rules

1. **One Component Per File**: Each component gets its own file
2. **Co-location**: Related files stay together (component + styles + tests)
3. **Index Files**: Use `index.ts` for clean exports when needed
4. **Barrel Exports**: Group related exports in index files

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatPrice.ts`)
- **Types**: `index.ts` in `types/` folder
- **Hooks**: `use-kebab-case.tsx` (e.g., `use-mobile.tsx`)
- **Constants**: `UPPER_SNAKE_CASE.ts` (e.g., `API_CONSTANTS.ts`)

---

## 🏷️ Naming Conventions

### Components

```typescript
// ✅ CORRECT
export const ProductCard = () => { ... }
export default ProductCard;

// ❌ WRONG
export const productCard = () => { ... }
export const Product_Card = () => { ... }
```

### Variables & Functions

```typescript
// ✅ CORRECT
const productList = [];
const getUserData = () => {};
const isAuthenticated = true;

// ❌ WRONG
const ProductList = [];
const GetUserData = () => {};
const IS_AUTHENTICATED = true; // Only for constants
```

### Types & Interfaces

```typescript
// ✅ CORRECT
interface Product { ... }
type CartItem = { ... }
type UserRole = "admin" | "user";

// ❌ WRONG
interface product { ... }
type cart_item = { ... }
```

### Constants

```typescript
// ✅ CORRECT
export const API_BASE_URL = "https://api.example.com";
export const MAX_CART_ITEMS = 10;

// ❌ WRONG
export const apiBaseUrl = "https://api.example.com";
```

---

## 💅 Code Style & Formatting

### General Rules

1. **Use Prettier**: All code must be formatted with Prettier
2. **2 Spaces**: Indentation is 2 spaces (no tabs)
3. **Semicolons**: Always use semicolons
4. **Trailing Commas**: Use trailing commas in objects/arrays
5. **Line Length**: Maximum 100 characters
6. **Quotes**: Double quotes for JSX, single quotes for strings (or double for consistency)

### Import Organization

```typescript
// 1. React & Next.js
import React from "react";
import { useRouter } from "next/navigation";

// 2. Third-party libraries
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// 3. Internal imports (absolute paths with @/)
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { env } from "@/lib/env";

// 4. Relative imports
import "./styles.css";
import { helperFunction } from "./utils";

// 5. Type imports (use `type` keyword)
import type { Product } from "@/types";
```

### Component Structure

```typescript
"use client"; // Only if needed

import React from "react";
import type { ComponentProps } from "react";

// Types & Interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

// Component
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  // 1. Hooks
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 2. Event handlers
  const handleClick = () => {
    // ...
  };

  // 3. Effects
  useEffect(() => {
    // ...
  }, []);

  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ProductCard;
```

---

## 📘 TypeScript Standards

### Rules

1. **Strict Mode**: Always enabled
2. **No `any`**: Never use `any` (except for Next.js Route types with `as any`)
3. **Explicit Types**: Define types for props, functions, and complex objects
4. **Type Imports**: Use `import type` for type-only imports
5. **Type Guards**: Use type guards for runtime type checking

### Examples

```typescript
// ✅ CORRECT
interface User {
  id: string;
  email: string;
  name: string;
}

const getUser = async (id: string): Promise<User> => {
  // ...
};

// ❌ WRONG
const getUser = async (id: any): Promise<any> => {
  // ...
};
```

### Type Definitions

- **Interfaces**: For object shapes that might be extended
- **Types**: For unions, intersections, and computed types
- **Enums**: Avoid unless necessary (use const objects or union types)

```typescript
// ✅ CORRECT
type Status = "pending" | "completed" | "failed";
const STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

// ❌ WRONG
enum Status {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}
```

---

## ⚛️ Next.js App Router Patterns

### Server vs Client Components

**Server Components (Default)**:

- No `"use client"` directive
- Can directly access server resources
- Cannot use hooks, event handlers, or browser APIs
- Use for: Data fetching, static content, SEO

**Client Components**:

- Must have `"use client"` at the top
- Can use hooks, event handlers, browser APIs
- Use for: Interactivity, state, effects

```typescript
// ✅ Server Component (default)
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProduct(id);

  return <ProductView product={product} />;
}

// ✅ Client Component
"use client";
export const ProductView = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div>
      <button onClick={() => setQuantity(q => q + 1)}>+</button>
    </div>
  );
};
```

### Route Handlers

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const products = await fetchProducts();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
```

### Metadata

```typescript
// app/[locale]/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
  openGraph: {
    title: "OG Title",
    description: "OG Description",
  },
};
```

---

## 🧩 Component Patterns

### Component Types

1. **UI Components** (`components/ui/`): Reusable, unstyled primitives
2. **Feature Components** (`components/[feature]/`): Feature-specific, styled components
3. **Layout Components** (`components/layout/`): Header, Footer, Navigation
4. **Page Views** (`views/`): Full page components

### Component Rules

1. **Single Responsibility**: One component, one purpose
2. **Props Interface**: Always define props interface
3. **Default Exports**: Use default exports for components
4. **Memoization**: Use `React.memo` for expensive renders
5. **Error Boundaries**: Wrap risky components

```typescript
// ✅ CORRECT Component Pattern
"use client";

import React, { memo } from "react";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
  className?: string;
}

export const ProductCard = memo<ProductCardProps>(({ product, onAddToCart, className }) => {
  return (
    <div className={className}>
      {/* Component content */}
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
```

---

## 🌐 API & Data Fetching

### Rules

1. **Use `src/lib/api.ts`**: All API calls go through centralized API client
2. **Use `env.apiBaseUrl`**: Never hardcode URLs
3. **Error Handling**: Always handle errors
4. **Type Safety**: Type all API responses

### API Client Pattern

```typescript
// ✅ CORRECT
import { api } from "@/lib/api";
import { env } from "@/lib/env";

const fetchProducts = async () => {
  try {
    const response = await api.products.getAll();
    return response.data.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

// ❌ WRONG
const fetchProducts = async () => {
  const response = await fetch("https://www.hometexbd.ltd/api/products");
  return response.json();
};
```

### React Query Pattern

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

---

## 🔄 State Management

### Rules

1. **Context for Global State**: Auth, Cart, Wishlist, Orders
2. **Local State for UI**: `useState` for component-specific state
3. **React Query for Server State**: All API data
4. **No Prop Drilling**: Use Context or state management

### Context Pattern

```typescript
// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import type { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
```

---

## ⚠️ Error Handling

### Rules

1. **Error Boundaries**: Wrap components that might fail
2. **Try-Catch**: Always wrap async operations
3. **User-Friendly Messages**: Never expose technical errors to users
4. **Logging**: Log errors for debugging

### Error Boundary Pattern

```typescript
// ✅ CORRECT
"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Page() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

### API Error Handling

```typescript
// ✅ CORRECT
try {
  const data = await api.products.getById(id);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch product");
  }
  return data.data;
} catch (error) {
  console.error("Error:", error);
  toast.error("Failed to load product. Please try again.");
  throw error;
}
```

---

## ⚡ Performance Guidelines

### Rules

1. **Image Optimization**: Always use `next/image`
2. **Code Splitting**: Use dynamic imports for heavy components
3. **Memoization**: Use `React.memo`, `useMemo`, `useCallback` appropriately
4. **Lazy Loading**: Load components and data on demand

### Image Optimization

```typescript
// ✅ CORRECT
import Image from "next/image";

<Image
  src={product.image}
  alt={product.name}
  width={500}
  height={500}
  priority={isAboveFold}
/>

// ❌ WRONG
<img src={product.image} alt={product.name} />
```

### Dynamic Imports

```typescript
// ✅ CORRECT
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false, // Only if needed
});
```

---

## 🔒 Security Standards

### Rules

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Store in environment variables, never in code
3. **Input Validation**: Validate all user inputs
4. **XSS Prevention**: Use React's built-in escaping
5. **CSRF Protection**: Use Next.js built-in protection

### Environment Variables

```typescript
// ✅ CORRECT
import { env } from "@/lib/env";

const apiUrl = env.apiBaseUrl;

// ❌ WRONG
const apiUrl = "https://www.hometexbd.ltd";
const apiKey = "secret-key-123"; // NEVER!
```

---

## 🧪 Testing Requirements

### Rules

1. **Unit Tests**: Test utilities and pure functions
2. **Component Tests**: Test component behavior
3. **Integration Tests**: Test feature workflows
4. **E2E Tests**: Test critical user flows

### Test Structure

```typescript
// __tests__/utils/formatPrice.test.ts
import { formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("should format price correctly", () => {
    expect(formatPrice(1000)).toBe("৳1,000");
  });
});
```

---

## 📝 Documentation Requirements

### Code Comments

1. **JSDoc**: Use JSDoc for public functions
2. **Inline Comments**: Explain "why", not "what"
3. **README**: Update README for new features

### JSDoc Example

```typescript
/**
 * Formats a price value to Bangladeshi Taka format
 * @param price - The price value in number format
 * @returns Formatted price string with currency symbol
 * @example
 * formatPrice(1000) // Returns "৳1,000"
 */
export const formatPrice = (price: number): string => {
  return `৳${price.toLocaleString("en-BD")}`;
};
```

---

## 🚫 Common Mistakes to Avoid

1. ❌ **Hardcoding URLs**: Always use `env.apiBaseUrl`
2. ❌ **Using `any` type**: Define proper types
3. ❌ **Mixing Server/Client**: Understand component boundaries
4. ❌ **Prop Drilling**: Use Context for shared state
5. ❌ **No Error Handling**: Always handle errors
6. ❌ **Inline Styles**: Use Tailwind classes
7. ❌ **Large Components**: Break into smaller components
8. ❌ **No TypeScript**: Everything must be typed
9. ❌ **Direct `process.env`**: Use `env` from `@/lib/env`
10. ❌ **No Memoization**: Memoize expensive computations

---

## ✅ Checklist for New Code

Before submitting code, ensure:

- [ ] Code follows naming conventions
- [ ] All types are defined (no `any`)
- [ ] Uses `env` from `@/lib/env` for configuration
- [ ] Uses `api` from `@/lib/api` for API calls
- [ ] Error handling is implemented
- [ ] Code is formatted with Prettier
- [ ] No ESLint errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Component is properly typed
- [ ] Uses appropriate Server/Client component pattern
- [ ] Images use `next/image`
- [ ] Internationalization is considered
- [ ] Performance optimizations applied (if needed)

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained By**: Hometex Development Team
