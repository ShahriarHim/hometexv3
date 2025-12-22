# Backend Implementation Required: Google OAuth Login/Signup

## Overview

The frontend has been updated to support Google OAuth login. This document outlines what needs to be implemented in the backend to support this feature.

## New Endpoint Required

### 1. Google OAuth Login/Signup Endpoint

**Route:** `POST /api/customer-google-login`

**Purpose:** Create or login a user via Google OAuth

### Request Body

```json
{
  "email": "user@gmail.com",
  "name": "John Doe",
  "google_id": "google-unique-id-from-oauth",
  "avatar": "https://lh3.googleusercontent.com/...",
  "user_type": 3
}
```

**Request Fields:**

- `email` (string, required): User's Google email
- `name` (string, required): User's full name from Google profile
- `google_id` (string, required): Unique Google OAuth ID
- `avatar` (string, optional): Google profile picture URL
- `user_type` (number, required): Always 3 for customer (matches your existing enum)

### Response Format

**Success (HTTP 200):**

```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@gmail.com",
    "name": "John Doe",
    "avatar": "https://..."
  },
  "message": "Login successful"
}
```

**Error (HTTP 401/400):**

```json
{
  "success": false,
  "error": "Error message",
  "message": "Login failed"
}
```

## Business Logic Requirements

### User Creation/Update Flow

1. **Check if Google user exists:**
   - Query by `google_id` field in users table

2. **If user exists:**
   - Update last login timestamp
   - Return existing user + new JWT token
   - Don't modify email/name (in case user changed it on Google)

3. **If user doesn't exist:**
   - Check if email already exists (email login account)
   - **Option A (Recommended):** Link Google to existing email account
     - Add `google_id` to existing user record
     - Return user + JWT token
   - **Option B:** Create new separate account
     - Create new user with Google data
     - Set `google_id`, email, name, avatar
     - Return new user + JWT token

4. **Generate JWT token:**
   - Same token format as email/password login
   - Should work with existing authentication middleware
   - Include user ID, email, and any required claims

### Database Schema Updates

Add these fields to your users/customers table (if not already present):

```sql
ALTER TABLE customers ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS avatar VARCHAR(500);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS oauth_provider VARCHAR(50);
```

**Optional fields for better tracking:**

```sql
ALTER TABLE customers ADD COLUMN IF NOT EXISTS oauth_login_count INT DEFAULT 0;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_oauth_login TIMESTAMP;
```

## Implementation Considerations

### Email Handling

- Google email is always verified (trusted source)
- Safe to auto-verify email when using Google OAuth
- Can skip email verification step

### Profile Picture

- Store Google avatar URL in user record
- Consider periodically fetching fresh avatar from Google
- Have fallback if avatar URL expires

### Account Linking

- Same user can have both:
  - Traditional email/password login
  - Google OAuth login
- Linking happens when same email is used
- User should be able to remove Google link if desired

### Session Management

- Return standard JWT token like email/password login
- Frontend will store in NextAuth session
- Frontend will persist in localStorage as backup

### Security Notes

- Verify Google ID comes from official Google OAuth (already done by NextAuth)
- Don't trust profile data without HTTPS
- Rate limit this endpoint to prevent abuse
- Log OAuth login attempts for audit trail

## API Call from Frontend

**When user clicks "Continue with Google":**

```
NextAuth → Google OAuth → Frontend Callback
  ↓
Extract: email, name, google_id, avatar
  ↓
Frontend calls: POST /api/customer-google-login
  ↓
Backend creates/updates user
  ↓
Backend returns JWT token
  ↓
Frontend stores token in NextAuth session
  ↓
User is authenticated ✅
```

## Testing Checklist

- [ ] Google user can login (new account creation)
- [ ] Google user can login again (returns existing account)
- [ ] Email+password user can login with same email via Google (account linking)
- [ ] JWT token is valid and recognized by protected endpoints
- [ ] User profile displays correct name and avatar
- [ ] Invalid Google data returns appropriate error
- [ ] Rate limiting prevents abuse

## Code Example (Pseudo-code)

```javascript
router.post("/api/customer-google-login", async (req, res) => {
  const { email, name, google_id, avatar, user_type } = req.body;

  try {
    // 1. Find or create user
    let user = await User.findOne({ google_id });

    if (user) {
      // User exists with Google ID
      user.last_login = new Date();
      await user.save();
    } else {
      // Try to find by email for linking
      user = await User.findOne({ email });

      if (user) {
        // Link Google to existing account
        user.google_id = google_id;
      } else {
        // Create new user
        user = await User.create({
          email,
          name,
          google_id,
          avatar,
          user_type,
          email_verified: true, // Google email is verified
        });
      }
      await user.save();
    }

    // 2. Generate JWT token
    const token = generateJWT({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    });

    // 3. Return response
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      message: "Login failed",
    });
  }
});
```

## Integration with Existing Auth

This endpoint should:

- Use the same JWT generation as `/api/customer-login`
- Use the same user model as existing email/password auth
- Return tokens compatible with existing protected routes
- Follow same error response format

## Questions to Answer

1. Should Google users be required to set a password?
   - Recommendation: No, allow passwordless login

2. Should linking be automatic (same email)?
   - Recommendation: Yes, but inform user

3. Should users be able to unlink Google?
   - Recommendation: Yes, if they have a password set

4. Where should avatar be stored?
   - Option A: Store URL, fetch from Google CDN
   - Option B: Download and store locally

## Frontend Information

The frontend will:

- Call this endpoint after Google OAuth
- Expect JWT token in response
- Store token in HTTP-only cookie + localStorage
- Use token for authenticated API requests
- Sync user state across all pages

**NextAuth is handling:**

- Google OAuth flow
- Token management
- Session persistence
- Redirect after login

**Your backend needs to handle:**

- User creation/update
- JWT generation
- Data validation
- Email linking logic
