# API Integration - Hometex v3

## Signup API Implementation

The signup API has been successfully integrated into the Hometex v3 project.

### API Endpoint
```
POST https://www.hometexbd.ltd/api/customer-signup
```

### Request Format
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "01712345679",
  "password": "password123",
  "conf_password": "password123"
}
```

### Response Format
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

## Implementation Details

### 1. AuthContext (`src/context/AuthContext.tsx`)
The main authentication context handles:
- User signup with the API
- Token extraction and storage
- User state management
- Local storage persistence

**Key Features:**
- Stores authentication token in `localStorage` as `hometex-auth-token`
- Stores user data in `localStorage` as `hometex-user`
- Provides `signup()` method that accepts SignupData
- Automatically logs user in after successful signup
- Shows toast notifications for success/error states

### 2. Auth View (`src/views/Auth.tsx`)
The authentication page provides:
- Login form
- Signup form with all required fields:
  - First Name
  - Last Name
  - Email
  - Phone
  - Password
  - Confirm Password
- Password validation
- Loading states
- Error handling

### 3. API Utilities (`src/lib/api.ts`)
Helper functions for making API calls:
- `getAuthToken()` - Retrieves stored auth token
- `authenticatedFetch()` - Makes authenticated API requests with Bearer token
- `api.auth.signup()` - Direct API method for signup

## Usage

### Using the Signup Form
Navigate to `/auth` and use the "Sign Up" tab. All fields are required.

### Programmatic Signup
```typescript
import { useAuth } from "@/context/AuthContext";

const { signup } = useAuth();

await signup({
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  phone: "01712345679",
  password: "password123",
  conf_password: "password123"
});
```

### Making Authenticated Requests
```typescript
import { authenticatedFetch } from "@/lib/api";

const response = await authenticatedFetch("https://api.example.com/endpoint", {
  method: "GET"
});
```

The `authenticatedFetch` helper automatically adds the Bearer token to requests.

## Token Management

### Storage
- Token is stored in `localStorage` under the key `hometex-auth-token`
- User data (including token) is stored under `hometex-user`

### Retrieval
```typescript
const token = localStorage.getItem("hometex-auth-token");
```

### Usage in API Calls
The token is automatically included in authenticated requests as:
```
Authorization: Bearer {token}
```

## Error Handling

All API operations include comprehensive error handling:
- Network errors
- API response errors
- Field-specific validation errors
- Validation errors (password mismatch)
- User-friendly toast notifications
- Inline field error displays

### Error Response Format

The API returns validation errors in this format:
```json
{
  "status": 400,
  "message": "validation_err",
  "error": {
    "email": ["The email has already been taken."],
    "phone": ["The phone has already been taken."]
  }
}
```

### Error Display

Errors are displayed in two ways:
1. **Toast Notifications** - Immediate feedback at the top of the screen
2. **Inline Field Errors** - Red borders and error messages below affected fields

See `ERROR_HANDLING.md` for detailed information about error handling.

## Testing

To test the signup functionality:
1. Navigate to `/auth`
2. Click on "Sign Up" tab
3. Fill in all required fields
4. Submit the form
5. Check the browser console and localStorage for the token
6. Verify redirection to home page on success

## Security Notes

- Passwords are sent securely via HTTPS
- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- Token is automatically included in authenticated API requests
- Logout clears both user data and token from localStorage

