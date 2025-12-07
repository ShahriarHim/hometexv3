# Contributing to Hometex V3

Thank you for contributing to Hometex V3! This document provides guidelines and standards for contributing to the project.

## 🚀 Getting Started

1. **Read the Documentation**
   - [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Comprehensive coding standards
   - [README.md](./README.md) - Project overview and setup

2. **Set Up Your Environment**

   ```bash
   git clone <repo-url>
   cd hometexV3
   npm install
   cp .env.example .env.local
   npm run dev
   ```

3. **Install Recommended VS Code Extensions**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

## 📋 Development Workflow

### Before You Start

1. **Check Existing Code**: Look at similar features to understand patterns
2. **Plan Your Changes**: Understand what you're building
3. **Check Standards**: Review `CODING_STANDARDS.md`

### During Development

1. **Follow Naming Conventions**: See `CODING_STANDARDS.md`
2. **Use TypeScript**: All code must be typed
3. **Format Code**: Run `npm run format` before committing
4. **Check Types**: Run `npm run type-check`
5. **Lint Code**: Run `npm run lint`

### Before Committing

Run these commands:

```bash
npm run type-check  # Check TypeScript
npm run lint         # Check ESLint
npm run format       # Format code
npm run build        # Ensure build works
```

## 📝 Code Standards

### Must Follow

- ✅ Use `env` from `@/lib/env` for environment variables
- ✅ Use `api` from `@/lib/api` for API calls
- ✅ Define TypeScript types for all code
- ✅ Use Server Components by default
- ✅ Add error handling for async operations
- ✅ Format code with Prettier
- ✅ Follow naming conventions

### Must Avoid

- ❌ Hardcoding URLs or API endpoints
- ❌ Using `any` type
- ❌ Using `process.env` directly
- ❌ Using `fetch` directly (use `api` from `@/lib/api`)
- ❌ Skipping error handling
- ❌ Creating files in wrong locations

## 🧪 Testing

Before submitting code:

1. Test your changes locally
2. Ensure TypeScript compiles
3. Ensure ESLint passes
4. Test in browser
5. Check console for errors

## 📤 Submitting Changes

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:

```
feat(products): add product search functionality
fix(auth): resolve login token expiration issue
docs(readme): update installation instructions
```

### Pull Request Checklist

- [ ] Code follows coding standards
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Code is formatted with Prettier
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if needed)
- [ ] No console errors
- [ ] Works in browser

## 🎯 AI Agent Guidelines

If you're using AI agents (Cursor, GitHub Copilot, etc.):

1. **Read `.cursorrules`**: Contains AI-specific guidelines
2. **Reference Existing Code**: AI should follow existing patterns
3. **Verify Output**: Always review AI-generated code
4. **Run Checks**: Ensure AI code passes all checks

## ❓ Getting Help

- Check `CODING_STANDARDS.md` for patterns
- Look at existing similar code
- Ask in team discussions
- Review project documentation

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Project Coding Standards](./CODING_STANDARDS.md)

---

Thank you for contributing! 🎉
