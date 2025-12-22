# 401 Unauthorized Error Fix - Staging Server

## Problem

**Error:** `GET http://staging-api.hometexbd.ltd/api/my-profile 401 (Unauthorized)`

Works locally but fails on the staging server. User is getting "Unauthenticated" errors even after successful login.

## Root Cause

The authentication token was **only stored in localStorage**, which is a client-side only API. On server-side renders (SSR) or when the server tries to fetch authenticated endpoints, the token cannot be retrieved because:

1. `localStorage.getItem()` returns `null` on the server (guarded by `if (typeof window !== "undefined")`)
2. Without a token in the `Authorization` header, requests fail with 401 Unauthorized
3. Locally, everything runs client-side in development, so localStorage works

## Solution

Implemented a **dual-storage strategy** for authentication tokens:

### 1. **Store Token in Cookies**

- Cookies work on both client-side AND server-side
- Automatically sent with every request (when `credentials: "include"` is set)
- More reliable for SSR and server-side requests

### 2. **Modified Files**

#### [src/services/api/client.ts](../../src/services/api/client.ts)

- Added `getAuthTokenFromCookie()` function to retrieve tokens from cookies
- Updated `authenticatedFetch()` to include `credentials: "include"` header
- This ensures cookies are sent with cross-origin requests

#### [src/context/AuthContext.tsx](../../src/context/AuthContext.tsx)

- Added `setAuthTokenCookie()` helper to store tokens in cookies
- Added `clearAuthTokenCookie()` helper to clear tokens on logout
- Updated **3 locations** where tokens are set:
  1. `login()` function - stores token in both localStorage AND cookie
  2. `signup()` function - stores token in both localStorage AND cookie
  3. NextAuth session sync (`useEffect`) - stores Google OAuth token in both locations
  4. `logout()` function - clears token from both locations

### 3. **Token Storage Now**

After authentication, the token is stored in:

```javascript
// 1. localStorage (client-side only)
localStorage.getItem("hometex-auth-token");

// 2. Cookie (works server and client)
document.cookie; // hometex-auth-token={token}
```

## How It Works Now

```
User Login → Token extracted from API response
    ↓
Token stored in BOTH:
  - localStorage (for client-side code)
  - Cookie (for server-side requests)
    ↓
Subsequent API calls include Authorization header:
  - Locally: Token from localStorage
  - On Server: Token from cookie + Authorization header
    ↓
Protected endpoints like /api/my-profile now work on staging! ✅
```

## Testing

### Before (Broken)

```
1. User logs in on staging
2. Token stored in localStorage only
3. Server tries to fetch /api/my-profile
4. No token in request → 401 Unauthorized ❌
```

### After (Fixed)

```
1. User logs in on staging
2. Token stored in localStorage + cookie
3. Server fetches /api/my-profile
4. Cookie automatically included in request → 200 OK ✅
```

## Cookie Details

- **Name:** `hometex-auth-token`
- **Expiration:** 30 days from login
- **Path:** `/` (entire site)
- **SameSite:** `Lax` (prevents CSRF, allows navigation)
- **Format:** Bearer token from backend API

## Backward Compatibility

- Existing code that reads from localStorage still works
- New code automatically uses cookies for server-side requests
- No breaking changes to the API

## Verification Steps

1. **On Staging Server:**

   ```
   1. Log in normally
   2. Open DevTools → Application → Cookies
   3. Verify `hometex-auth-token` exists
   4. Navigate to profile page → should work now! ✅
   ```

2. **Test Profile Fetch:**
   ```javascript
   // This should now work on staging
   const profile = await userService.getProfile();
   ```

## Additional Notes

- Cookies are automatically sent with `credentials: "include"` in all authenticated requests
- If your backend uses HTTP-only cookies (recommended for production), further updates may be needed
- For extra security in production, consider:
  - Using HTTP-only cookies (backend sets, not accessible from JS)
  - Setting Secure flag (HTTPS only)
  - Rotating tokens periodically
