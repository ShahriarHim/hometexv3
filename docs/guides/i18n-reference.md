# Quick i18n Reference Guide

## ✅ What's Been Set Up

Your Next.js app now has full internationalization support with:

- ✅ English (en) and Bengali (bn) languages
- ✅ Automatic locale detection and routing
- ✅ Translation files in `/messages/` folder
- ✅ Middleware for locale handling
- ✅ Type-safe translations
- ✅ Language switcher component

## 🚀 Quick Start

### 1. Using Translations in Client Components

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function MyComponent() {
  const t = useTranslations("common");

  return <h1>{t("welcome")}</h1>;
}
```

### 2. Using Translations in Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function MyPage() {
  const t = await getTranslations("common");

  return <h1>{t("welcome")}</h1>;
}
```

### 3. Navigation Links

**❌ DON'T USE:**

```tsx
import Link from "next/link"; // Wrong!
```

**✅ USE INSTEAD:**

```tsx
import { Link } from "@/i18n/routing"; // Correct!

<Link href="/products">Products</Link>;
// Auto becomes /en/products or /bn/products
```

### 4. Programmatic Navigation

**❌ DON'T USE:**

```tsx
import { useRouter } from "next/navigation"; // Wrong!
```

**✅ USE INSTEAD:**

```tsx
"use client";

import { useRouter } from "@/i18n/routing"; // Correct!

export default function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/products");
  };

  return <button onClick={handleClick}>Go</button>;
}
```

### 5. Adding the Language Switcher

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Header() {
  return (
    <header>
      <nav>{/* your nav items */}</nav>
      <LanguageSwitcher />
    </header>
  );
}
```

### 6. Page Params (Next.js 15+)

**For any page using `params`:**

```tsx
// pages/[locale]/products/[id]/page.tsx

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params; // Must await!

  // Now use locale and id
}
```

## 📝 Available Translation Keys

Check `/messages/en.json` for all available keys. Main namespaces:

- `common` - Common UI elements
- `navigation` - Navigation menu items
- `hero` - Hero section
- `products` - Product-related text
- `cart` - Shopping cart
- `checkout` - Checkout process
- `account` - User account
- `footer` - Footer content
- `contact` - Contact page
- `errors` - Error messages
- `metadata` - SEO metadata

## 🔧 Adding New Translations

1. **Add to both language files:**

`messages/en.json`:

```json
{
  "myFeature": {
    "title": "My Feature",
    "button": "Click Here"
  }
}
```

`messages/bn.json`:

```json
{
  "myFeature": {
    "title": "আমার বৈশিষ্ট্য",
    "button": "এখানে ক্লিক করুন"
  }
}
```

2. **Use in your component:**

```tsx
const t = useTranslations("myFeature");
return (
  <div>
    <h1>{t("title")}</h1>
    <button>{t("button")}</button>
  </div>
);
```

## 🌐 URL Structure

All routes are automatically localized:

| Original Route | English URL    | Bengali URL    |
| -------------- | -------------- | -------------- |
| `/`            | `/en`          | `/bn`          |
| `/products`    | `/en/products` | `/bn/products` |
| `/cart`        | `/en/cart`     | `/bn/cart`     |
| `/about`       | `/en/about`    | `/bn/about`    |

## ⚠️ Common Mistakes to Avoid

1. ❌ Using `next/link` instead of `@/i18n/routing`
2. ❌ Using `next/navigation` hooks instead of `@/i18n/routing`
3. ❌ Forgetting to await `params` in Next.js 15+
4. ❌ Adding translations to only one language file
5. ❌ Using hardcoded text instead of translation keys

## 📖 Full Documentation

For complete documentation, see `I18N_SETUP.md`

## 🎯 Example Component

See `/src/components/examples/TranslationExample.tsx` for a working example!
