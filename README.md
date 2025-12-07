# Hometex Bangladesh - E-commerce Platform

Modern e-commerce experience for Hometex Bangladesh, built with Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui, and TanStack Query.

## 🚀 Features

- **Next.js 16** with App Router for optimal performance
- **TypeScript** for type safety
- **Internationalization (i18n)** with next-intl (English & Bengali)
- **Responsive Design** with Tailwind CSS
- **Component Library** using shadcn/ui and Radix UI
- **State Management** with React Context API
- **Data Fetching** with TanStack Query
- **Form Handling** with React Hook Form and Zod validation
- **Error Handling** with Error Boundaries
- **SEO Optimized** with metadata and Open Graph tags
- **Security Headers** configured for production

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Git

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd hometexV3
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=https://www.hometexbd.ltd
NEXT_PUBLIC_API_LOCAL_URL=http://localhost:8000
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
hometexV3/
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── [locale]/      # Internationalized routes
│   │   ├── globals.css    # Global styles
│   │   ├── providers.tsx  # App-level providers
│   │   └── not-found.tsx  # 404 page
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   ├── products/    # Product-related components
│   │   └── home/        # Home page components
│   ├── context/          # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── WishlistContext.tsx
│   │   └── OrderContext.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and configurations
│   │   ├── api.ts        # API client
│   │   ├── env.ts        # Environment variables
│   │   └── utils.ts      # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── views/            # Page-level components
│   ├── i18n/             # Internationalization configuration
│   ├── styles/            # CSS modules
│   └── middleware.ts      # Next.js middleware
├── .editorconfig         # Editor configuration
├── .eslintrc.json        # ESLint configuration
├── .gitignore           # Git ignore rules
├── .prettierrc.json     # Prettier configuration
├── next.config.mjs      # Next.js configuration
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## � Documentation

All project documentation is organized in the [`/docs`](./docs) directory:

- **[Documentation Index](./docs/README.md)** - Complete documentation overview
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Quick Start Guide](./docs/guides/quick-start.md)** - Get started quickly

### Standards & Best Practices

- **[Coding Standards](./docs/standards/coding-standards.md)** - Complete coding standards
- **[AI Agent Guidelines](./docs/standards/ai-agent-guidelines.md)** - For AI-assisted development
- **[Standards Enforcement](./docs/standards/standards-enforcement.md)** - How we enforce quality

### Guides

- **[API Integration](./docs/guides/api-integration.md)** - Working with the API
- **[Internationalization](./docs/guides/i18n-setup.md)** - Adding translations
- **[Quick Reference](./docs/guides/i18n-reference.md)** - i18n quick reference

### Development

- **[Error Handling](./docs/development/error-handling.md)** - Error handling patterns
- **[Validation Errors](./docs/development/validation-errors.md)** - Form validation
- **[Standards Audit](./docs/development/standards-audit.md)** - Code quality audit

## 📐 Coding Standards & Enforcement

This project enforces strict coding standards to maintain production-grade code quality.

### Automatic Enforcement

- **ESLint** - Code quality and Next.js best practices
- **Prettier** - Code formatting (auto-format on save)
- **TypeScript** - Type safety (strict mode)
- **EditorConfig** - Editor consistency
- **VS Code Settings** - Auto-formatting and linting
- **CI/CD** - Automated checks on push/PR

### For AI Agents

If you're using AI agents (Cursor AI, GitHub Copilot, etc.):

- Read `.cursorrules` for AI-specific rules
- Follow **[Coding Standards](./docs/standards/coding-standards.md)** for all code
- Reference **[AI Agent Guidelines](./docs/standards/ai-agent-guidelines.md)** for quick reference
- Check `.mcp/project-context.json` for MCP server context

### Quick Standards Checklist

Before submitting code:

- ✅ Uses `env` from `@/lib/env` (never `process.env`)
- ✅ Uses `api` from `@/lib/api` (never `fetch` directly)
- ✅ All TypeScript types defined (no `any`)
- ✅ Error handling implemented
- ✅ Code formatted with Prettier
- ✅ No ESLint errors
- ✅ TypeScript compiles

## 🔧 Configuration

### Environment Variables

All environment variables are managed through `src/lib/env.ts` for type safety and centralized configuration.

Required variables:

- `NEXT_PUBLIC_SITE_URL` - Your site URL
- `NEXT_PUBLIC_API_BASE_URL` - Production API URL
- `NEXT_PUBLIC_API_LOCAL_URL` - Local development API URL

Optional variables:

- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager ID
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable analytics (true/false)
- `NEXT_PUBLIC_ENABLE_CHAT` - Enable chat feature (true/false)

### TypeScript

The project uses strict TypeScript configuration. Path aliases are configured in `tsconfig.json`:

- `@/*` maps to `./src/*`

### Code Quality

- **ESLint** - Code linting with Next.js recommended rules
- **Prettier** - Code formatting
- **EditorConfig** - Editor consistency

## 🌐 Internationalization

The project supports multiple languages using `next-intl`:

- English (en)
- Bengali (bn)

Add new languages by:

1. Adding locale files in `messages/`
2. Updating `src/i18n/routing.ts`

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **CSS Modules** - Component-scoped styles
- **shadcn/ui** - Pre-built accessible components

## 📦 Key Dependencies

### Core

- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety

### UI & Styling

- `tailwindcss` - CSS framework
- `@radix-ui/*` - Accessible component primitives
- `lucide-react` - Icon library

### State & Data

- `@tanstack/react-query` - Data fetching
- React Context API - State management

### Forms & Validation

- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation resolvers

### Internationalization

- `next-intl` - i18n support

## 🏗️ Architecture

### Component Organization

- **UI Components** (`src/components/ui/`) - Reusable, accessible components
- **Feature Components** (`src/components/`) - Feature-specific components
- **Page Views** (`src/views/`) - Page-level components

### State Management

- **Context API** - Global state (Auth, Cart, Wishlist, Orders)
- **React Query** - Server state and caching
- **Local State** - Component-level state with useState

### API Integration

- Centralized API client in `src/lib/api.ts`
- Environment-based URL configuration
- Automatic fallback between local and production APIs
- Type-safe API responses

### Error Handling

- **Error Boundaries** - Catch React component errors
- **API Error Handling** - Centralized error handling in API client
- **Form Validation** - Field-level error display

## 🚢 Deployment

### Build Output

The project uses Next.js standalone output mode for optimized deployments.

### Deployment Platforms

**Vercel (Recommended)**

```bash
npm install -g vercel
vercel
```

**Other Platforms**

- Ensure Node.js 18+ is available
- Set environment variables
- Run `npm run build`
- Start with `npm run start`

### Environment Variables in Production

Make sure to set all required environment variables in your deployment platform's settings.

## 🔒 Security

- Security headers configured in `next.config.mjs`
- Environment variables for sensitive data
- XSS protection
- CSRF protection via Next.js built-in features

## 📝 Code Style

- **Naming Conventions**
  - Components: PascalCase (e.g., `ProductCard.tsx`)
  - Utilities: camelCase (e.g., `formatPrice.ts`)
  - Types/Interfaces: PascalCase (e.g., `Product`, `CartItem`)
  - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

- **File Organization**
  - One component per file
  - Co-locate related files
  - Use index files for clean imports

## 🧪 Testing

Testing setup is recommended for production:

- Unit tests with Jest/Vitest
- Component tests with React Testing Library
- E2E tests with Playwright/Cypress

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and type checking
4. Format code with Prettier
5. Submit a pull request

## 📄 License

UNLICENSED - Proprietary software

## 📞 Support

For issues and questions, please contact the development team.

---

**Built with ❤️ for Hometex Bangladesh**
