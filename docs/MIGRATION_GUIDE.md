# Documentation Reorganization Guide

This guide helps you reorganize the documentation files from the root directory into the structured `/docs` folder.

## 📋 File Migration Map

### Keep in Root (3 files)

These files should stay in the project root as they're expected there by GitHub and developers:

```
✅ README.md                     # Project overview (keep in root)
✅ CONTRIBUTING.md               # GitHub standard (keep in root)
✅ LICENSE                       # License file (if exists)
```

### Move to `/docs/standards/` (4 files)

```bash
mv AI_AGENT_GUIDELINES.md docs/standards/ai-agent-guidelines.md
mv CODING_STANDARDS.md docs/standards/coding-standards.md
mv STANDARDS_ENFORCEMENT.md docs/standards/standards-enforcement.md
mv PROJECT_STANDARDS_SUMMARY.md docs/standards/project-summary.md
```

### Move to `/docs/guides/` (4 files)

```bash
mv I18N_SETUP.md docs/guides/i18n-setup.md
mv QUICK_START_STANDARDS.md docs/guides/quick-start.md
mv QUICK_I18N_REFERENCE.md docs/guides/i18n-reference.md
mv API_INTEGRATION.md docs/guides/api-integration.md
```

### Move to `/docs/development/` (3 files)

```bash
mv ERROR_HANDLING.md docs/development/error-handling.md
mv VALIDATION_ERRORS_SUMMARY.md docs/development/validation-errors.md
mv PROJECT_STANDARDS_AUDIT.md docs/development/standards-audit.md
```

### Move to `/docs/features/` (4 files)

Create feature-specific subdirectories:

```bash
# Megamenu feature
mkdir -p docs/features/megamenu
mv MEGAMENU_COMPLIANCE_AUDIT.md docs/features/megamenu/compliance-audit.md
mv MEGAMENU_FINAL_SUMMARY.md docs/features/megamenu/implementation.md
mv PRECOMMIT_CHECKLIST.md docs/features/megamenu/precommit-checklist.md

# Authentication feature
mkdir -p docs/features/authentication
mv SIGNUP_QUICKSTART.md docs/features/authentication/signup-guide.md
```

## 🚀 Quick Migration (Copy-Paste Commands)

### Windows CMD

```cmd
:: Standards
move AI_AGENT_GUIDELINES.md docs\standards\ai-agent-guidelines.md
move CODING_STANDARDS.md docs\standards\coding-standards.md
move STANDARDS_ENFORCEMENT.md docs\standards\standards-enforcement.md
move PROJECT_STANDARDS_SUMMARY.md docs\standards\project-summary.md

:: Guides
move I18N_SETUP.md docs\guides\i18n-setup.md
move QUICK_START_STANDARDS.md docs\guides\quick-start.md
move QUICK_I18N_REFERENCE.md docs\guides\i18n-reference.md
move API_INTEGRATION.md docs\guides\api-integration.md

:: Development
move ERROR_HANDLING.md docs\development\error-handling.md
move VALIDATION_ERRORS_SUMMARY.md docs\development\validation-errors.md
move PROJECT_STANDARDS_AUDIT.md docs\development\standards-audit.md

:: Features - Megamenu
mkdir docs\features\megamenu
move MEGAMENU_COMPLIANCE_AUDIT.md docs\features\megamenu\compliance-audit.md
move MEGAMENU_FINAL_SUMMARY.md docs\features\megamenu\implementation.md
move PRECOMMIT_CHECKLIST.md docs\features\megamenu\precommit-checklist.md

:: Features - Authentication
mkdir docs\features\authentication
move SIGNUP_QUICKSTART.md docs\features\authentication\signup-guide.md
```

### Windows PowerShell

```powershell
# Standards
Move-Item AI_AGENT_GUIDELINES.md docs/standards/ai-agent-guidelines.md
Move-Item CODING_STANDARDS.md docs/standards/coding-standards.md
Move-Item STANDARDS_ENFORCEMENT.md docs/standards/standards-enforcement.md
Move-Item PROJECT_STANDARDS_SUMMARY.md docs/standards/project-summary.md

# Guides
Move-Item I18N_SETUP.md docs/guides/i18n-setup.md
Move-Item QUICK_START_STANDARDS.md docs/guides/quick-start.md
Move-Item QUICK_I18N_REFERENCE.md docs/guides/i18n-reference.md
Move-Item API_INTEGRATION.md docs/guides/api-integration.md

# Development
Move-Item ERROR_HANDLING.md docs/development/error-handling.md
Move-Item VALIDATION_ERRORS_SUMMARY.md docs/development/validation-errors.md
Move-Item PROJECT_STANDARDS_AUDIT.md docs/development/standards-audit.md

# Features - Megamenu
New-Item -ItemType Directory -Path docs/features/megamenu -Force
Move-Item MEGAMENU_COMPLIANCE_AUDIT.md docs/features/megamenu/compliance-audit.md
Move-Item MEGAMENU_FINAL_SUMMARY.md docs/features/megamenu/implementation.md
Move-Item PRECOMMIT_CHECKLIST.md docs/features/megamenu/precommit-checklist.md

# Features - Authentication
New-Item -ItemType Directory -Path docs/features/authentication -Force
Move-Item SIGNUP_QUICKSTART.md docs/features/authentication/signup-guide.md
```

### Linux/Mac

```bash
# Standards
mv AI_AGENT_GUIDELINES.md docs/standards/ai-agent-guidelines.md
mv CODING_STANDARDS.md docs/standards/coding-standards.md
mv STANDARDS_ENFORCEMENT.md docs/standards/standards-enforcement.md
mv PROJECT_STANDARDS_SUMMARY.md docs/standards/project-summary.md

# Guides
mv I18N_SETUP.md docs/guides/i18n-setup.md
mv QUICK_START_STANDARDS.md docs/guides/quick-start.md
mv QUICK_I18N_REFERENCE.md docs/guides/i18n-reference.md
mv API_INTEGRATION.md docs/guides/api-integration.md

# Development
mv ERROR_HANDLING.md docs/development/error-handling.md
mv VALIDATION_ERRORS_SUMMARY.md docs/development/validation-errors.md
mv PROJECT_STANDARDS_AUDIT.md docs/development/standards-audit.md

# Features - Megamenu
mkdir -p docs/features/megamenu
mv MEGAMENU_COMPLIANCE_AUDIT.md docs/features/megamenu/compliance-audit.md
mv MEGAMENU_FINAL_SUMMARY.md docs/features/megamenu/implementation.md
mv PRECOMMIT_CHECKLIST.md docs/features/megamenu/precommit-checklist.md

# Features - Authentication
mkdir -p docs/features/authentication
mv SIGNUP_QUICKSTART.md docs/features/authentication/signup-guide.md
```

## 📝 Update References

After moving files, update any internal links in:

1. **README.md** - Update documentation links
2. **.cursorrules** - Update paths if referenced
3. **AI_AGENT_GUIDELINES.md** → Update "Reference Files" section
4. **CONTRIBUTING.md** - Update documentation paths

### Example Updates

**Before:**

```markdown
See [CODING_STANDARDS.md](./CODING_STANDARDS.md)
```

**After:**

```markdown
See [Coding Standards](./docs/standards/coding-standards.md)
```

## ✅ Verification

After migration, verify:

1. Root directory is clean (only 2-3 .md files)
2. All docs are in `/docs/` subdirectories
3. Links in README.md work correctly
4. .gitignore doesn't exclude docs folder

## 🔄 Git Commands

After reorganization:

```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "docs: reorganize documentation into /docs directory

- Move standards to docs/standards/
- Move guides to docs/guides/
- Move development docs to docs/development/
- Move feature docs to docs/features/
- Keep README.md and CONTRIBUTING.md in root
- Add docs/README.md as documentation index"

# Push changes
git push origin asif
```

---

## 📚 Final Structure

After migration, your root should look like:

```
hometexV3/
├── docs/                    # ✅ All documentation here
│   ├── README.md
│   ├── standards/
│   ├── guides/
│   ├── development/
│   └── features/
├── src/                     # ✅ Source code
├── public/                  # ✅ Static assets
├── README.md                # ✅ Keep in root
├── CONTRIBUTING.md          # ✅ Keep in root
├── package.json
├── tsconfig.json
└── ...other config files
```

**Much cleaner!** ✨
