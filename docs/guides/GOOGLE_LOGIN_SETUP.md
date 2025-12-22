# Google Login Implementation - Setup Guide

## Overview

Google OAuth login has been successfully integrated into your authentication system using NextAuth.js. This guide walks you through the setup and usage.

## What Was Implemented

### 1. **NextAuth Configuration** (`src/app/api/auth/[...nextauth]/route.ts`)

- NextAuth API route handler configured for both Google OAuth and email/password authentication
- JWT-based session strategy
- Google OAuth provider integration
- Credentials provider for email/password login

### 2. **Updated Components**

- **Auth View** (`src/views/Auth.tsx`): Updated Google login button to use NextAuth
- **NextAuth Provider** (`src/components/providers/NextAuthProvider.tsx`): New session provider wrapper
- **Root Providers** (`src/app/providers.tsx`): Integrated NextAuth provider

### 3. **Environment Variables**

Added new environment variables:

- `NEXTAUTH_SECRET`: Session encryption key
- `NEXTAUTH_URL`: Your application URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

## Setup Instructions

### Step 1: Get Google OAuth Credentials

✅ **COMPLETED** - Your credentials are already configured:

- **Project ID**: your_google_project_id
- **Client ID**: your_google_client_id_here
- **Client Secret**: your_google_client_secret_here
- **Valid Origins**:
  - `http://localhost:3000` (local development)
  - `http://hometexbd.ltd` (production)
  - `http://staging.hometexbd.ltd` (staging)

### Step 2: Update Environment Variables

✅ **COMPLETED** - Your credentials are already configured in `.env.local`:

```env
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**For Production Deployment:**

Set these environment variables in your hosting platform (Vercel, AWS, etc.):

```env
NEXTAUTH_SECRET=your_production_secret_here
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Step 3: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Update your `.env.local` with the generated secret.

### Step 4: Test Google Login

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Click "Continue with Google"
4. You should be redirected to Google's login
5. After successful authentication, you'll be redirected back to your app

## How It Works

### Login Flow

1. **User clicks "Continue with Google"**
   - `handleSocialLogin("google")` is called in Auth.tsx
   - Calls NextAuth's `signIn("google")`

2. **NextAuth Redirects to Google**
   - User logs in with Google credentials
   - Google redirects back with authorization code

3. **Token Exchange**
   - NextAuth exchanges authorization code for access token
   - Creates a JWT session token

4. **User Authenticated**
   - User data is stored in session
   - Redirected to home page

### Session Management

The session contains:

- User ID from Google
- User email
- User name
- Provider (google)
- Access token

Access the session in components:

```typescript
import { useSession } from "next-auth/react";

export function MyComponent() {
  const { data: session } = useSession();

  if (session) {
    return <p>Welcome, {session.user?.email}</p>;
  }

  return <p>Not logged in</p>;
}
```

## Email/Password Login

Email and password login still works through the existing flow:

1. User enters email and password
2. `handleLogin()` calls your backend API
3. Backend validates credentials and returns token
4. User is authenticated

## Next Steps (Optional)

### Connect Google Login to Your Backend

If you want to create a user record in your backend when they sign up with Google:

1. Update `authOptions` in `route.ts`:

```typescript
async jwt({ token, user, account }) {
  if (account?.provider === "google" && user) {
    // Call your backend to create/update user with Google data
    await createOrUpdateGoogleUser({
      googleId: user.id,
      email: user.email,
      name: user.name,
    });
  }
  return token;
}
```

### Add Facebook Login

To add Facebook login:

1. Create Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Get your App ID and App Secret
3. Add redirect URI: `https://yourdomain.com/api/auth/callback/facebook`
4. Update `route.ts`:

```typescript
import FacebookProvider from "next-auth/providers/facebook";

FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID || "",
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
});
```

### Customize Session Data

Edit the `callbacks` in `route.ts` to modify what data is stored in the session:

```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    // Add custom fields
    session.user.customField = token.customField;
  }
  return session;
}
```

## Troubleshooting

### "Cannot read properties of undefined (reading 'data')"

Make sure `NEXTAUTH_SECRET` is set in your `.env.local`

### Redirect URI mismatch

Ensure your redirect URI in Google Console matches exactly:

- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://yourdomain.com/api/auth/callback/google`

### Session not persisting

Make sure the `NextAuthProvider` is wrapping your app in `providers.tsx`

### CORS errors

These are normal during development. Make sure your backend allows requests from `http://localhost:3000`

## File Changes Summary

| File                                            | Change                                             |
| ----------------------------------------------- | -------------------------------------------------- |
| `src/app/api/auth/[...nextauth]/route.ts`       | ✨ New - NextAuth configuration                    |
| `src/components/providers/NextAuthProvider.tsx` | ✨ New - Session provider                          |
| `src/views/Auth.tsx`                            | 📝 Updated - Google login button now uses NextAuth |
| `src/app/providers.tsx`                         | 📝 Updated - Added NextAuthProvider                |
| `.env.example`                                  | 📝 Updated - Added NextAuth variables              |
| `.env.local`                                    | 📝 Updated - Added NextAuth credentials            |

## Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- Use strong `NEXTAUTH_SECRET` in production
- Keep `GOOGLE_CLIENT_SECRET` private
- Use HTTPS in production
- Regularly rotate secrets

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://next-auth.js.org/providers/google)
- [NextAuth Security Best Practices](https://next-auth.js.org/getting-started/example)
