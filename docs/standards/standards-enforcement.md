# Standards Enforcement Guide

This document explains how coding standards are enforced in the Hometex V3 project.

## 🔧 Automatic Enforcement

### 1. ESLint

**Location**: `eslint.config.mjs`

ESLint automatically enforces:

- Next.js best practices
- React hooks rules
- TypeScript rules
- Code quality rules
- Security rules

**Run**: `npm run lint`
**Auto-fix**: `npm run lint:fix`

### 2. Prettier

**Location**: `.prettierrc.json`

Prettier automatically formats:

- Code style
- Indentation
- Quotes
- Semicolons
- Line length

**Run**: `npm run format`
**Check**: `npm run format:check`

### 3. TypeScript

**Location**: `tsconfig.json`

TypeScript enforces:

- Type safety
- Strict mode
- Path aliases
- Module resolution

**Run**: `npm run type-check`

### 4. EditorConfig

**Location**: `.editorconfig`

EditorConfig ensures:

- Consistent indentation
- Line endings
- Character encoding
- File formatting

**Works**: Automatically in supported editors

## 🎯 IDE Configuration

### VS Code

**Location**: `.vscode/settings.json`

Automatically:

- Formats on save
- Fixes ESLint on save
- Organizes imports
- Enforces Prettier
- Configures TypeScript

**Extensions Required**:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

### Cursor AI

**Location**: `.cursorrules`

Provides:

- AI-specific guidelines
- Code generation rules
- Pattern enforcement
- Standards reference

## 📋 Pre-commit Checks

Before committing code, run:

```bash
npm run type-check  # TypeScript
npm run lint         # ESLint
npm run format       # Prettier
npm run build        # Build check
```

## 🚀 CI/CD Enforcement

**Location**: `.github/workflows/code-quality.yml`

GitHub Actions automatically:

- Runs ESLint
- Runs TypeScript check
- Checks code formatting
- Builds the project

**Triggers**: On push and pull requests

## 📚 Documentation

### For Developers

- **CODING_STANDARDS.md** - Complete coding standards
- **CONTRIBUTING.md** - Contribution guidelines
- **README.md** - Project overview

### For AI Agents

- **.cursorrules** - Cursor AI rules
- **AI_AGENT_GUIDELINES.md** - AI agent guidelines
- **.mcp/project-context.json** - MCP server context

## ✅ Enforcement Checklist

When adding new code:

- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Code is formatted (`npm run format`)
- [ ] Uses `env` from `@/lib/env`
- [ ] Uses `api` from `@/lib/api`
- [ ] All types defined (no `any`)
- [ ] Error handling implemented
- [ ] Follows naming conventions
- [ ] File in correct location
- [ ] Follows existing patterns

## 🛠️ Setup for New Developers

1. **Install VS Code Extensions**:

   ```bash
   # Extensions are auto-suggested via .vscode/extensions.json
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   ```bash
   cp .env.example .env.local
   ```

4. **Read Documentation**:
   - `CODING_STANDARDS.md`
   - `CONTRIBUTING.md`
   - `README.md`

5. **Verify Setup**:
   ```bash
   npm run type-check
   npm run lint
   npm run format:check
   ```

## 🔍 How Standards Are Enforced

### During Development

1. **VS Code**: Auto-formats and lints as you type
2. **Pre-commit**: Run checks before committing
3. **CI/CD**: Automated checks on push/PR

### For AI Agents

1. **.cursorrules**: Cursor AI reads this automatically
2. **AI_AGENT_GUIDELINES.md**: Reference for AI agents
3. **.mcp/project-context.json**: MCP server context

## 📖 Quick Reference

| Tool       | Command              | Purpose            |
| ---------- | -------------------- | ------------------ |
| ESLint     | `npm run lint`       | Check code quality |
| Prettier   | `npm run format`     | Format code        |
| TypeScript | `npm run type-check` | Check types        |
| Build      | `npm run build`      | Verify build       |

## 🎓 Learning Resources

- [Next.js Best Practices](https://nextjs.org/docs)
- [React Patterns](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Project Standards](./CODING_STANDARDS.md)

---

**Remember**: Standards are enforced automatically. Follow them to avoid build failures and code review issues!
