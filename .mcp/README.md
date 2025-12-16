# MCP Server Configuration for Hometex V3

This directory contains configuration for Model Context Protocol (MCP) servers to understand and work with this Next.js project.

## What is MCP?

Model Context Protocol (MCP) is a protocol that allows AI assistants to understand project context, coding standards, and architecture patterns.

## Configuration Files

- `project-context.json` - Project structure and rules for MCP servers
- `README.md` - This file

## For MCP Server Setup

If you're setting up an MCP server for this project:

1. **Load `project-context.json`** - Contains all project rules and patterns
2. **Reference `CODING_STANDARDS.md`** - Comprehensive coding standards
3. **Reference `.cursorrules`** - AI agent specific rules
4. **Reference `AI_AGENT_GUIDELINES.md`** - Guidelines for AI agents

## Key Rules for MCP Servers

When generating code, MCP servers MUST:

1. ✅ Use `env` from `@/lib/env` (never `process.env`)
2. ✅ Use `api` from `@/lib/api` (never `fetch` directly)
3. ✅ Define TypeScript types (no `any`)
4. ✅ Follow folder structure strictly
5. ✅ Use Server Components by default
6. ✅ Handle errors properly
7. ✅ Follow naming conventions
8. ✅ Format code with Prettier

## Project Context

The project uses:

- Next.js 16 App Router
- TypeScript (strict mode)
- React 18
- Tailwind CSS
- shadcn/ui components
- next-intl for i18n
- TanStack Query for data fetching

## Critical Files

- `src/lib/env.ts` - Environment variables
- `src/lib/api.ts` - API client
- `src/types/index.ts` - Type definitions
- `CODING_STANDARDS.md` - Full standards
- `.cursorrules` - AI rules

## Example MCP Server Integration

```json
{
  "mcpServers": {
    "hometex-v3": {
      "command": "node",
      "args": ["path/to/mcp-server.js"],
      "env": {
        "PROJECT_CONTEXT": "./.mcp/project-context.json"
      }
    }
  }
}
```

## Resources

- [MCP Documentation](https://modelcontextprotocol.io)
- [Project Coding Standards](../CODING_STANDARDS.md)
- [AI Agent Guidelines](../AI_AGENT_GUIDELINES.md)
