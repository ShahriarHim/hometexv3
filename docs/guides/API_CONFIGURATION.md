# API Configuration Guide

## Current Setup

Your backend API is configured to use: **`http://123.176.58.209`**

All API calls in the project dynamically use the base URL defined in `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://123.176.58.209
```

## How It Works

1. **Environment Variable**: `NEXT_PUBLIC_API_BASE_URL` in `.env` file
2. **Centralized Config**: `src/lib/env.ts` reads and exports this value
3. **API Services**: All services in `src/services/api/` use `env.apiBaseUrl`
4. **Smart URL Detection**: On first API call, checks which URL works (localhost or production) and caches it for the session
5. **No Repeated Checks**: After first detection, all subsequent requests use the cached URL (fast and efficient)

## API Endpoint Structure

All API calls follow this pattern:

```
http://123.176.58.209/api/{endpoint}
```

Examples:

- Products: `http://123.176.58.209/api/products`
- Categories: `http://123.176.58.209/api/categories`
- Orders: `http://123.176.58.209/api/orders`
- Wishlist: `http://123.176.58.209/api/wishlist`

## When You Get a Domain

Simply update the `.env` file:

```env
# Before (IP address)
NEXT_PUBLIC_API_BASE_URL=http://123.176.58.209

# After (Domain)
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

**That's it!** No code changes needed. All API calls will automatically use the new domain.

## Important Notes

1. **Protocol**: Currently using `http://` - Change to `https://` when you have SSL on your domain
2. **No Trailing Slash**: Don't add `/` at the end of the base URL
3. **Restart Required**: After changing `.env`, restart your dev server (`npm run dev`)
4. **Build Required**: For production, rebuild your app after changing `.env` (`npm run build`)

## Environment-Specific Configuration

- **Development**: Checks `localhost:8000` first (500ms timeout), falls back to production URL
- **Production**: Always uses `NEXT_PUBLIC_API_BASE_URL`
- **Session Cache**: Working URL is cached for the entire browser session (only checks once)
- **Manual Reset**: You can call `resetBaseUrlCache()` from console if needed

### Developer Tools

In browser console, you can:

```javascript
// Check which URL is being used
import { getCachedBaseUrl } from "@/services/api/client";
console.log(getCachedBaseUrl());

// Reset cache to re-detect URL
import { resetBaseUrlCache } from "@/services/api/client";
resetBaseUrlCache();
```

## Files Involved

- `.env` - Your environment variables (not committed to git)
- `.env.example` - Template for environment variables (committed to git)
- `src/lib/env.ts` - Centralized environment configuration
- `src/services/api/client.ts` - API client with fallback logic
- `src/services/api/*.service.ts` - All service modules use `env.apiBaseUrl`
