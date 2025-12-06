# AI Agent Automation Guide

## Overview

This document explains how to ensure AI agents (like Cursor AI, GitHub Copilot, etc.) automatically read and follow project standards before generating code.

## 📁 Key Configuration Files

### 1. `.ai-context.md` (Root Directory)

**Purpose**: Quick reference file that AI agents should read FIRST.

**Contains**:

- List of mandatory files to read
- Common patterns to follow
- Quick decision trees (Server vs Client, file placement, etc.)
- Common mistakes to avoid
- Pre-generation checklist

**Location**: `/.ai-context.md` (root of project)

### 2. `.cursorrules` (Root Directory)

**Purpose**: Cursor AI-specific rules and guidelines.

**Contains**:

- Reference to `.ai-context.md` at the top
- Environment variable rules
- API call patterns
- TypeScript requirements
- Component structure guidelines
- Import organization rules

**Location**: `/.cursorrules` (root of project)

**Updated**: Now includes a prominent warning at the top:

```markdown
⚠️ **IMPORTANT**: Before generating ANY code, read `.ai-context.md` first!
```

### 3. Documentation Structure

**Purpose**: Comprehensive guides for complex topics.

**Structure**:

```
docs/
├── standards/
│   ├── ai-agent-guidelines.md      # AI agent specific guidelines
│   ├── coding-standards.md         # Complete coding standards
│   └── standards-enforcement.md    # How to enforce standards
├── guides/
│   ├── quick-start.md              # Quick start guide
│   ├── api-integration.md          # API integration guide
│   └── i18n-setup.md               # Internationalization guide
├── development/
│   └── error-handling.md           # Error handling guide
└── features/
    └── similar-products.md         # Feature-specific docs
```

## 🤖 How AI Agents Access This Information

### For Cursor AI

1. **Automatic**: Cursor reads `.cursorrules` automatically on startup
2. **Explicit Reference**: `.cursorrules` now tells agents to read `.ai-context.md` first
3. **Context Window**: Both files are small enough to fit in the AI's context window

### For GitHub Copilot

1. **Workspace Context**: Copilot automatically indexes workspace files
2. **File Discovery**: Looks for common config files like `.cursorrules`, `README.md`
3. **Explicit Mention**: Users can mention `.ai-context.md` in comments

### For Other AI Tools (Cline, Continue, Aider, etc.)

1. **MCP Server**: Can be configured with Model Context Protocol to auto-load files
2. **Prompts**: Include reference to `.ai-context.md` in initial prompt
3. **Tool Configuration**: Most tools support reading project-specific config files

## ✅ Verification Checklist

### For Developers

Before starting work:

- [ ] `.ai-context.md` exists in root directory
- [ ] `.cursorrules` references `.ai-context.md` at the top
- [ ] Documentation is organized in `docs/` folder
- [ ] All standards files are up to date

### For AI Agents (Manual Check)

When generating code, verify you've read:

- [ ] `.ai-context.md` (quick reference)
- [ ] `.cursorrules` (if using Cursor AI)
- [ ] Relevant documentation from `docs/` (for complex features)
- [ ] Similar existing code (for patterns)

## 🚀 Automatic Enforcement Mechanisms

### 1. File Location Strategy

**Why it works**: AI agents automatically look for config files in root directory.

**Files**:

- `.cursorrules` → Cursor AI reads this automatically
- `.ai-context.md` → Easy to discover, short name, clear purpose
- `.github/copilot-instructions.md` → GitHub Copilot can read this (future)

### 2. Cross-References

**Why it works**: Each file references the others, creating a web of documentation.

**Implementation**:

- `.cursorrules` → References `.ai-context.md` at the top
- `.ai-context.md` → References `docs/` for detailed guides
- `docs/README.md` → References `.ai-context.md` for quick start

### 3. Naming Conventions

**Why it works**: Clear, discoverable names that AI agents recognize.

**Conventions**:

- `.ai-*` → Signals "this is for AI agents"
- `docs/standards/` → Industry-standard location for standards
- `docs/guides/` → Industry-standard location for guides

### 4. Small, Focused Files

**Why it works**: AI agents have context window limits.

**Strategy**:

- `.ai-context.md` → ~500 lines (fits in any AI context window)
- `.cursorrules` → ~300 lines (small, focused)
- Documentation → Split into focused topics

## 📊 Compliance Monitoring

### Pre-Commit Checks

Create git hooks to verify AI-generated code:

```bash
# .git/hooks/pre-commit
# Check for common mistakes
npm run lint
npm run type-check
```

### Code Review Checklist

When reviewing AI-generated code:

- [ ] Uses `env` from `@/lib/env` (not `process.env`)
- [ ] Uses `api` from `@/lib/api` (not `fetch`)
- [ ] All types defined (no `any`)
- [ ] Follows file structure conventions
- [ ] Imports organized correctly
- [ ] Server/Client component correctly chosen

### Automated Tests

Create tests that verify standards:

```typescript
// Example: Verify no process.env usage
test("should not use process.env directly", () => {
  const files = getAllSourceFiles();
  files.forEach((file) => {
    const content = readFileSync(file, "utf-8");
    expect(content).not.toMatch(/process\.env\./);
  });
});
```

## 🔧 Future Enhancements

### 1. MCP Server Configuration

Create a Model Context Protocol server that:

- Automatically loads project context
- Provides real-time access to standards
- Validates code against rules

**File**: `.mcp/server-config.json`

### 2. GitHub Copilot Instructions

Create GitHub-specific instructions:

**File**: `.github/copilot-instructions.md`

### 3. Pre-Generation Templates

Create templates for common tasks:

**Location**: `docs/templates/`

- `component-template.tsx`
- `page-template.tsx`
- `api-route-template.ts`

## 📝 Maintenance

### Regular Updates

**Monthly**:

- [ ] Review `.ai-context.md` for accuracy
- [ ] Update `.cursorrules` with new patterns
- [ ] Add new examples to documentation

**After Major Changes**:

- [ ] Update `.ai-context.md` with new utilities
- [ ] Document new patterns in `docs/standards/`
- [ ] Update code examples

### Feedback Loop

**Track Issues**:

- When AI generates incorrect code, identify which rule was missed
- Update `.ai-context.md` to make the rule more prominent
- Add examples of the mistake to avoid

**Metrics to Track**:

- Number of "wrong pattern" occurrences
- Pre-commit check failures
- Code review corrections

## 🎯 Success Metrics

**Good Indicators**:

- ✅ AI-generated code passes linting on first try
- ✅ AI-generated code passes type checking on first try
- ✅ Fewer "use the utility instead" comments in code reviews
- ✅ Consistent patterns across different AI-generated code
- ✅ New developers quickly understand the standards

**Warning Signs**:

- ⚠️ Frequent "wrong import" mistakes
- ⚠️ Repeated use of anti-patterns
- ⚠️ Multiple attempts needed to get code working
- ⚠️ Inconsistent code style across files

## 💡 Best Practices

### For Project Maintainers

1. **Keep `.ai-context.md` short** → AI context windows are limited
2. **Update immediately** → When you add a new utility, update docs
3. **Use examples** → Show correct and incorrect patterns
4. **Cross-reference** → Link related documents
5. **Test with AI** → Actually try generating code to verify rules work

### For Developers Using AI

1. **Start with `.ai-context.md`** → Read it when joining the project
2. **Reference explicitly** → Mention the file in prompts
3. **Verify generated code** → Check it follows the standards
4. **Report issues** → If AI consistently misses something, update docs
5. **Share patterns** → Document new patterns you discover

## 🔗 Related Documentation

- [Coding Standards](../standards/coding-standards.md) - Complete coding standards
- [AI Agent Guidelines](../standards/ai-agent-guidelines.md) - AI-specific guidelines
- [Standards Enforcement](../standards/standards-enforcement.md) - How to enforce standards
- [Quick Start Guide](./quick-start.md) - Get started quickly

---

**Remember**: The goal is to make it **impossible** for AI agents to miss the standards, not to punish them when they do. Good documentation structure + clear references = consistent code quality.
