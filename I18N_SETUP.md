# Internationalization (i18n) Setup Guide

This project uses `next-intl` for internationalization with support for **English (en)** and **Bengali (bn)**.

## 📁 Project Structure

```
project-root/
├── messages/              # Translation files
│   ├── en.json           # English translations
│   └── bn.json           # Bengali translations
├── src/
│   ├── i18n/
│   │   ├── request.ts    # Server-side i18n configuration
│   │   └── routing.ts    # Routing configuration & navigation
│   ├── middleware.ts     # Locale detection & routing
│   ├── app/
│   │   ├── layout.tsx    # Root layout (validates locale)
│   │   ├── [locale]/     # Locale-based routing
│   │   │   ├── layout.tsx     # Locale-specific layout
│   │   │   ├── page.tsx       # Home page
│   │   │   └── [...routes]    # All app routes
│   │   ├── globals.css
│   │   ├── providers.tsx
│   │   └── not-found.tsx
│   └── components/
│       └── LanguageSwitcher.tsx  # Language switcher component
└── next.config.mjs       # Next.js config with next-intl plugin
```

## 🚀 Key Features

### 1. **Automatic Locale Detection**
The middleware automatically detects the user's locale based on:
- URL path (`/en/...` or `/bn/...`)
- Browser language preferences
- Default locale (English)

### 2. **Localized Routing**
All routes are automatically localized:
- `/en/products` → English products page
- `/bn/products` → Bengali products page

### 3. **Type-Safe Translations**
TypeScript provides autocomplete for translation keys.

## 📝 Usage Examples

### Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("common");
  
  return (
    <div>
      <h1>{t("welcome")}</h1>
      <p>{t("loading")}</p>
    </div>
  );
}
```

### Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function MyServerComponent() {
  const t = await getTranslations("common");
  
  return <h1>{t("welcome")}</h1>;
}
```

### Using Multiple Namespaces

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function ProductCard() {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  
  return (
    <div>
      <h2>{t("title")}</h2>
      <button>{t("addToCart")}</button>
      <span>{tCommon("loading")}</span>
    </div>
  );
}
```

### Dynamic Metadata (SEO)

```tsx
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  // Await params (Next.js 15+)
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  
  return {
    title: t("title"),
    description: t("description"),
  };
}
```

## 🔗 Navigation

Use the localized navigation utilities from `@/i18n/routing`:

### Link Component

```tsx
import { Link } from "@/i18n/routing";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}
```

### Programmatic Navigation

```tsx
"use client";

import { useRouter } from "@/i18n/routing";

export default function MyComponent() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/products");
    // Automatically navigates to /en/products or /bn/products
  };
  
  return <button onClick={handleClick}>Go to Products</button>;
}
```

### Get Current Pathname

```tsx
"use client";

import { usePathname } from "@/i18n/routing";

export default function ActiveLink() {
  const pathname = usePathname();
  
  return <span>Current path: {pathname}</span>;
}
```

## 🌐 Language Switcher

The `LanguageSwitcher` component is included:

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
      </nav>
      <LanguageSwitcher />
    </header>
  );
}
```

## 📦 Adding New Translations

### 1. Add to Translation Files

**messages/en.json:**
```json
{
  "myNewFeature": {
    "title": "My New Feature",
    "description": "This is a new feature"
  }
}
```

**messages/bn.json:**
```json
{
  "myNewFeature": {
    "title": "আমার নতুন বৈশিষ্ট্য",
    "description": "এটি একটি নতুন বৈশিষ্ট্য"
  }
}
```

### 2. Use in Components

```tsx
const t = useTranslations("myNewFeature");
return <h1>{t("title")}</h1>;
```

## 🔧 Configuration

### Add New Locale

1. **Create translation file:** `messages/fr.json`
2. **Update routing config** (`src/i18n/routing.ts`):

```ts
export const routing = defineRouting({
  locales: ['en', 'bn', 'fr'],  // Add 'fr'
  defaultLocale: 'en',
  localePrefix: 'always',
});
```

### Change Locale Prefix Strategy

In `src/i18n/routing.ts`:

```ts
export const routing = defineRouting({
  locales: ['en', 'bn'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',  // Options: 'always', 'as-needed', 'never'
});
```

- **`always`**: All URLs include locale (`/en/products`, `/bn/products`)
- **`as-needed`**: Default locale has no prefix (`/products`, `/bn/products`)
- **`never`**: No locale prefix (uses cookies/headers for detection)

## 🎯 Best Practices

1. **Organize translations by feature/page** for better maintainability
2. **Use nested keys** for related translations
3. **Keep translation keys consistent** across all locale files
4. **Use the same structure** in all translation files
5. **Test both languages** during development

## 🛠️ Troubleshooting

### Translations not showing up?
- Check that the translation key exists in both `en.json` and `bn.json`
- Verify the namespace matches the `useTranslations()` parameter
- Ensure the middleware is running (check `src/middleware.ts`)

### Getting locale errors?
- Verify `[locale]` folder structure in `src/app/[locale]/`
- Check that all routes are inside `[locale]` directory
- Ensure `generateStaticParams()` is defined in layouts

### Language switcher not working?
- Use `Link`, `useRouter`, etc. from `@/i18n/routing`, not from `next/navigation`
- Check that the middleware matcher includes your routes

### Next.js 15 `params` is a Promise error?
- In Next.js 15+, `params` must be awaited
- Update type to `params: Promise<{ locale: string }>`
- Use `const { locale } = await params;` before accessing values

## 📚 Resources

- [Next.js i18n Docs](https://nextjs.org/docs/app/guides/internationalization)
- [next-intl Documentation](https://next-intl.dev/)
- [next-intl Examples](https://github.com/amannn/next-intl/tree/main/examples)

## 🎉 You're All Set!

Your Next.js app now supports English and Bengali. Start adding translations and building multilingual features!

