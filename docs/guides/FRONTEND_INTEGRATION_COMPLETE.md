# Frontend Integration Complete: Google OAuth with Backend

## ✅ Implementation Status

Your frontend is now fully integrated with the backend Google OAuth flow!

### Files Updated:

1. ✅ `src/app/api/auth/[...nextauth]/route.ts` - Added backend token handling
2. ✅ `src/types/next-auth.d.ts` - Created NextAuth TypeScript types
3. ✅ `src/lib/api-auth.ts` - Created authenticated API helper
4. ✅ `src/views/Auth.tsx` - Already has Google login with icon
5. ✅ `src/components/providers/NextAuthProvider.tsx` - Already wrapping app
6. ✅ `.env.example` - Already has API URL configuration

## 🚀 How Google OAuth Now Works

```
User clicks "Continue with Google" button
         ↓
NextAuth redirects to Google OAuth
         ↓
User authorizes on Google consent screen
         ↓
Google redirects back with OAuth token
         ↓
NextAuth signIn callback triggered:
  - Extracts: email, name, google_id, avatar
  - Calls: authService.googleAuth()
  - Sends to: /api/customer-google-login (your backend)
         ↓
Backend receives request:
  - Creates or updates user
  - Returns JWT token
         ↓
JWT callback stores token:
  - token.backendToken = JWT from backend
  - token.accessToken = Google access token
  - token.provider = "google"
         ↓
Session callback exposes to app:
  - session.backendToken (use for authenticated API calls)
  - session.user (basic user info)
  - session.provider (Google)
         ↓
AuthContext syncs with NextAuth session
         ↓
User is logged in and authenticated ✅
```

## 📝 Configuration Required

### 1. Update `.env.local`

```dotenv
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### 2. Backend Endpoint Required

Your backend should have this endpoint:

```
POST /api/customer-google-login
```

**Request:**

```json
{
  "email": "user@gmail.com",
  "name": "John Doe",
  "google_id": "oauth-google-id",
  "avatar": "https://...",
  "user_type": 3
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "1",
    "email": "user@gmail.com",
    "name": "John Doe"
  }
}
```

## 🛠️ Using Authenticated API Calls

The frontend now has a helper function for authenticated API calls:

### Import the Helper

```typescript
import { fetchWithAuth } from "@/lib/api-auth";
```

### Example Usage

**Get user profile:**

```typescript
const profile = await fetchWithAuth("/api/customer-profile");
```

**Place an order:**

```typescript
const order = await fetchWithAuth("/api/place-order", {
  method: "POST",
  body: JSON.stringify({
    items: [{ id: 1, qty: 2 }],
    address_id: 1,
  }),
});
```

**Update user info:**

```typescript
const updated = await fetchWithAuth("/api/update-profile", {
  method: "PUT",
  body: JSON.stringify({ name: "New Name" }),
});
```

**Delete cart item:**

```typescript
await fetchWithAuth(`/api/cart-item/${itemId}`, {
  method: "DELETE",
});
```

### How It Works

The `fetchWithAuth` helper automatically:

- ✅ Gets the session from NextAuth
- ✅ Extracts the backend JWT token
- ✅ Adds `Authorization: Bearer {token}` header
- ✅ Sends to your backend API
- ✅ Handles errors and authentication failures

## 📦 Using Session in Components

### Client Component Example

```typescript
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api-auth";

export function UserDashboard() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to login
      window.location.href = "/en/auth";
      return;
    }

    if (status === "authenticated" && session?.backendToken) {
      // Fetch user's orders
      fetchWithAuth("/api/my-orders")
        .then((data) => setOrders(data.orders))
        .catch((error) => console.error("Failed to load orders:", error))
        .finally(() => setLoading(false));
    }
  }, [status, session]);

  if (loading) return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div className="p-8">
      <h1>Welcome, {session.user?.name}!</h1>
      <img
        src={session.user?.image || "/default-avatar.png"}
        alt="Avatar"
        className="w-16 h-16 rounded-full"
      />

      <div className="mt-8">
        <h2>Your Orders ({orders.length})</h2>
        {orders.map((order) => (
          <div key={order.id} className="border p-4 mt-2">
            <p>Order #{order.id}</p>
            <p>Total: ${order.total}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔒 Protected Routes Pattern

### Protect a Layout

```typescript
// app/dashboard/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/en/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <nav className="bg-gray-100 p-4">
        <p>Welcome, {session.user?.name}</p>
      </nav>
      {children}
    </div>
  );
}
```

### Protect a Component

```typescript
// components/OrderHistory.tsx
"use client";

import { useSession } from "next-auth/react";

export function OrderHistory() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## 🧪 Testing the Integration

### 1. Start Dev Server

```bash
npm run dev
```

### 2. Visit Auth Page

Navigate to: `http://localhost:3000/en/auth`

### 3. Click Google Button

- Should see Google logo and "Continue with Google" button
- Click it

### 4. Google Login Flow

- Redirects to Google
- Sign in with your Google account
- Returns to your app

### 5. Check Backend

- Verify user was created in database
- Check if JWT token was returned

### 6. Test Protected Route

Create a test page that uses `fetchWithAuth`:

```typescript
"use client";

import { fetchWithAuth } from "@/lib/api-auth";
import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    fetchWithAuth("/api/customer-profile")
      .then(data => console.log("Profile:", data))
      .catch(err => console.error("Error:", err));
  }, []);

  return <div>Check console for profile data</div>;
}
```

## 🐛 Troubleshooting

### Issue: "Not authenticated" Error

**Cause:** `session.backendToken` is undefined
**Solution:**

- Check that NextAuth callback is setting the token
- Verify backend is returning `token` field
- Check `.env.local` has correct API URL

### Issue: CORS Error

**Cause:** Backend doesn't allow cross-origin requests
**Solution:** Update backend CORS config

```php
// config/cors.php (Laravel)
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
],
'supports_credentials' => true,
```

### Issue: 401 Unauthorized

**Cause:** JWT token is invalid or expired
**Solution:**

- Check token format (should be `Bearer {token}`)
- Verify token is being returned from backend
- Check token expiration time

### Issue: Session Not Persisting

**Cause:** NextAuth session callback not working
**Solution:**

- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Check that JWT callback is returning token
- Ensure session strategy is "jwt"

## 📚 Key Files Reference

| File                                      | Purpose                                              |
| ----------------------------------------- | ---------------------------------------------------- |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth configuration with Google provider          |
| `src/types/next-auth.d.ts`                | TypeScript types for NextAuth                        |
| `src/lib/api-auth.ts`                     | Helper for authenticated API calls                   |
| `src/views/Auth.tsx`                      | Login/signup UI with Google button                   |
| `src/context/AuthContext.tsx`             | Local auth state synced with NextAuth                |
| `.env.local`                              | Environment variables (Google credentials + API URL) |

## 🎯 Next Steps

1. **Test Google login** on auth page
2. **Verify backend** creates user and returns token
3. **Update your pages** to use `fetchWithAuth` for API calls
4. **Protect routes** that require authentication
5. **Deploy** to staging/production

## ✨ Benefits of This Setup

✅ **Secure:** JWT tokens in HTTP-only cookies
✅ **Seamless:** Automatic token injection on API calls
✅ **Flexible:** Support for multiple login methods (Google + email/password)
✅ **User-friendly:** No manual token management
✅ **Scalable:** Works with any REST API backend
✅ **Type-safe:** Full TypeScript support

## 📞 Support

For issues:

1. Check browser DevTools → Network tab
2. Check backend logs
3. Verify `.env.local` variables
4. Test backend endpoint with Postman first
5. Check NextAuth documentation: https://next-auth.js.org

---

**Your Google OAuth integration is complete and ready to use! 🚀**
