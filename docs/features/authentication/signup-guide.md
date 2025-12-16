# Signup API - Quick Start Guide

## ✅ What's Been Implemented

The signup API has been fully integrated into Hometex v3 with the following features:

### 1. **Complete Authentication Flow**

- ✅ Signup form with all required fields
- ✅ API integration with `https://www.hometexbd.ltd/api/customer-signup`
- ✅ Token management (Bearer authentication)
- ✅ Local storage persistence
- ✅ User session management
- ✅ Toast notifications for feedback

### 2. **Files Modified/Created**

#### Updated Files:

- `src/context/AuthContext.tsx` - Enhanced to handle tokens
- `src/lib/api.ts` - Added authentication helpers and types
- `src/views/Auth.tsx` - Already had the signup form

#### New Files:

- `API_INTEGRATION.md` - Complete API documentation
- `SIGNUP_QUICKSTART.md` - This file

## 🚀 How to Use

### Access the Signup Page

Navigate to: `http://localhost:3000/auth` (or your domain + `/auth`)

### Fill in the Form

Required fields:

- First Name
- Last Name
- Email
- Phone (format: 01712345678)
- Password (min 6 characters)
- Confirm Password

### What Happens on Submit:

1. Password validation (must match)
2. API call to signup endpoint
3. Token extraction and storage
4. User logged in automatically
5. Redirect to home page
6. Success toast notification

## 🔐 Token Storage

After successful signup:

```javascript
// Token stored in localStorage
localStorage.getItem("hometex-auth-token");
// Returns: "828|4hZZnXcptyk9Y5XH1VFq5veppAm7QOfbRakaxyni6e68201a"

// User data stored in localStorage
localStorage.getItem("hometex-user");
// Returns: {"id":"123","email":"john@example.com","name":"John Doe","token":"..."}
```

## 💻 Code Examples

### Use Signup in Your Component

```typescript
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { signup, isAuthenticated, user } = useAuth();

  const handleSignup = async () => {
    try {
      await signup({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "01712345679",
        password: "password123",
        conf_password: "password123"
      });

      // User is now logged in, token is stored
      console.log("Signup successful!");
    } catch (error) {
      // Error is automatically shown via toast
      console.error("Signup failed:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleSignup}>Sign Up</button>
      )}
    </div>
  );
}
```

### Make Authenticated API Calls

```typescript
import { authenticatedFetch } from "@/lib/api";

// The token is automatically added to the request
async function fetchUserProfile() {
  const response = await authenticatedFetch("https://www.hometexbd.ltd/api/user/profile", {
    method: "GET",
  });

  const data = await response.json();
  return data;
}
```

### Access User Data and Token

```typescript
import { useAuth } from "@/context/AuthContext";

function UserInfo() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <p>Not logged in</p>;
  }

  return (
    <div>
      <p>User ID: {user?.id}</p>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Token: {user?.token}</p>
    </div>
  );
}
```

## 🧪 Testing the Integration

### Test in Browser DevTools:

```javascript
// 1. Open DevTools Console
// 2. Go to /auth page and sign up
// 3. After signup, check localStorage:

localStorage.getItem("hometex-auth-token");
// Should return a token string

localStorage.getItem("hometex-user");
// Should return user JSON

// 4. Test authenticated request:
const token = localStorage.getItem("hometex-auth-token");
fetch("https://www.hometexbd.ltd/api/some-protected-endpoint", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

### Test Signup Flow:

1. ✅ Navigate to `/auth`
2. ✅ Click "Sign Up" tab
3. ✅ Fill all fields
4. ✅ Submit form
5. ✅ Check for success toast
6. ✅ Verify redirect to home page
7. ✅ Check localStorage for token
8. ✅ Verify user is logged in (check header/nav)

## 📊 API Response Structure

### Successful Signup Response:

```json
{
  "success": {
    "name": "John Doe",
    "statue": 200,
    "message": "Registration & Authentication successfully done",
    "authorisation": {
      "token": "828|4hZZnXcptyk9Y5XH1VFq5veppAm7QOfbRakaxyni6e68201a",
      "type": "bearer"
    }
  }
}
```

### Error Response:

```json
{
  "error": {
    "message": "Email already exists",
    "status": 422
  }
}
```

## 🔄 Complete User Flow

```
User visits /auth
    ↓
Fills signup form
    ↓
Clicks "Sign Up"
    ↓
Frontend validates passwords match
    ↓
POST request to API with user data
    ↓
API returns success with token
    ↓
Token stored in localStorage (2 places)
    ↓
User object stored in state & localStorage
    ↓
Success toast shown
    ↓
Redirect to home page
    ↓
User is now logged in
    ↓
Token automatically included in future API calls
```

## 🛠️ Available Helper Functions

### In `src/lib/api.ts`:

```typescript
// Get stored token
getAuthToken(): string | null

// Make authenticated request
authenticatedFetch(url: string, options?: RequestInit)

// Direct API methods
api.auth.signup(signupData)
api.auth.login(email, password)
api.auth.logout()
```

### In `src/context/AuthContext.tsx`:

```typescript
// Hook: useAuth()
const {
  user, // Current user object (or null)
  isAuthenticated, // Boolean: is user logged in?
  signup, // Function to signup
  login, // Function to login
  logout, // Function to logout
  socialLogin, // Function for OAuth (Google, etc.)
} = useAuth();
```

## 🎯 Next Steps

1. **Test the signup flow** - Navigate to `/auth` and create an account
2. **Verify token storage** - Check browser DevTools → Application → Local Storage
3. **Use authenticated requests** - Import `authenticatedFetch` for protected API calls
4. **Check user state** - Use `useAuth()` hook to access user data anywhere
5. **Handle logout** - Call `logout()` to clear token and user data

## 📝 Notes

- Token is stored in 2 places: `hometex-auth-token` (token only) and `hometex-user` (full user object with token)
- Token format: `{id}|{random_string}`
- Token type: Bearer
- Auto-redirect after signup: `/` (home page)
- Toast library: Sonner (already configured)
- Form validation: Built-in HTML5 + custom password matching

## 🐛 Troubleshooting

**Signup not working?**

- Check browser console for errors
- Verify API endpoint is accessible
- Check network tab for API response
- Ensure all required fields are filled

**Token not stored?**

- Check if localStorage is enabled
- Verify API response contains token
- Check browser console for errors

**Not redirected after signup?**

- Check browser console for errors
- Verify router is working
- Check if AuthProvider is wrapping the app

**Validation errors (email/phone already taken)?**

- Error will show as toast notification
- Field will have red border
- Error message appears below the field
- Start typing to clear the error

## 📋 Error Handling

The system provides comprehensive error handling:

### Toast Notifications:

- Appear at the top of the screen
- Show for each validation error
- Auto-dismiss after a few seconds

### Inline Field Errors:

- Red border on fields with errors
- Error message displayed below field
- Automatically clear when user starts typing
- Support multiple errors per field

### Common Validation Errors:

- "The email has already been taken."
- "The phone has already been taken."
- "Passwords do not match!"

See `ERROR_HANDLING.md` for complete documentation.

---

**Ready to test!** Navigate to `/auth` and create your first account! 🎉
