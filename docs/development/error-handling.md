# Error Handling - Signup & Login API

## Overview

The authentication system now includes comprehensive error handling that displays both **toast notifications** and **inline field-specific errors** for validation failures.

## Error Response Format

The API returns validation errors in the following format:

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

## Implementation

### 1. **AuthContext Error Handling** (`src/context/AuthContext.tsx`)

Both `signup()` and `login()` functions now:

- Parse field-specific errors from API responses
- Display toast notifications for each error
- Attach field errors to the thrown error object
- Support the `error.fieldErrors` property

#### Error Extraction Logic:

```typescript
if (data.error && typeof data.error === "object") {
  const errorMessages: string[] = [];
  const fieldErrors: Record<string, string[]> = {};

  // Extract all field errors
  Object.keys(data.error).forEach((field) => {
    const fieldErrorArray = data.error[field];
    if (Array.isArray(fieldErrorArray)) {
      fieldErrors[field] = fieldErrorArray;
      fieldErrorArray.forEach((errorMsg) => {
        errorMessages.push(errorMsg);
        toast.error(errorMsg);
      });
    }
  });

  // Throw error with field errors attached
  const error: any = new Error(errorMessages.join(", "));
  error.fieldErrors = fieldErrors;
  throw error;
}
```

### 2. **Auth View Error Display** (`src/views/Auth.tsx`)

The signup and login forms now:

- Maintain field-specific error state
- Display inline error messages below each field
- Show red border on fields with errors
- Clear errors when user starts typing

#### State Management:

```typescript
const [signupErrors, setSignupErrors] = useState<Record<string, string[]>>({});
const [loginErrors, setLoginErrors] = useState<Record<string, string[]>>({});
```

#### Error Display Example:

```typescript
<Input
  id="signup-email"
  type="email"
  value={signupData.email}
  onChange={(e) => {
    setSignupData({ ...signupData, email: e.target.value });
    // Clear error when user starts typing
    if (signupErrors.email) {
      setSignupErrors({ ...signupErrors, email: [] });
    }
  }}
  className={signupErrors.email?.length ? "border-red-500" : ""}
/>
{signupErrors.email?.map((error, index) => (
  <p key={index} className="text-sm text-red-500">{error}</p>
))}
```

## Supported Field Validations

### Signup Form:

- ✅ `first_name` - First name validation errors
- ✅ `last_name` - Last name validation errors
- ✅ `email` - Email validation (format, duplicate)
- ✅ `phone` - Phone validation (format, duplicate)
- ✅ `password` - Password validation (length, complexity)
- ✅ `conf_password` - Password confirmation (must match)

### Login Form:

- ✅ `email` - Email validation
- ✅ `password` - Password validation

## User Experience Flow

### When Validation Errors Occur:

1. **User submits form** with invalid/duplicate data
2. **API returns 400** with field-specific errors
3. **Toast notifications appear** for each error
4. **Field borders turn red** for fields with errors
5. **Inline error messages show** below each affected field
6. **User starts typing** in a field
7. **Error for that field clears** automatically
8. **Red border disappears** when error is cleared

## Visual Indicators

### Red Border:

Fields with errors get a red border using Tailwind class:

```typescript
className={signupErrors.email?.length ? "border-red-500" : ""}
```

### Error Message Styling:

```typescript
<p className="text-sm text-red-500">{error}</p>
```

## Example Error Scenarios

### Scenario 1: Duplicate Email

**API Response:**

```json
{
  "status": 400,
  "message": "validation_err",
  "error": {
    "email": ["The email has already been taken."]
  }
}
```

**User Sees:**

- 🔴 Toast notification: "The email has already been taken."
- 🔴 Red border on email input field
- 🔴 Error message below email field

### Scenario 2: Multiple Validation Errors

**API Response:**

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

**User Sees:**

- 🔴 Toast notification: "The email has already been taken."
- 🔴 Toast notification: "The phone has already been taken."
- 🔴 Red border on email input field
- 🔴 Red border on phone input field
- 🔴 Error messages below both fields

### Scenario 3: Password Mismatch (Client-side)

**User Action:** Enters different passwords

**User Sees:**

- 🔴 Red border on confirm password field
- 🔴 Error message: "Passwords do not match!"
- ⚠️ Form does not submit

## Code Examples

### Access Field Errors in Component:

```typescript
import { useAuth } from "@/context/AuthContext";

function MySignupForm() {
  const { signup } = useAuth();
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (formData) => {
    setErrors({}); // Clear previous errors

    try {
      await signup(formData);
    } catch (error: any) {
      if (error.fieldErrors) {
        setErrors(error.fieldErrors);
        // Now you can display errors per field
      }
    }
  };
}
```

### Display Multiple Errors for a Field:

```typescript
{errors.email?.map((error, index) => (
  <p key={index} className="text-sm text-red-500">{error}</p>
))}
```

### Clear Error on Input Change:

```typescript
onChange={(e) => {
  setFormData({ ...formData, email: e.target.value });

  // Clear the error for this field
  if (errors.email) {
    setErrors({ ...errors, email: [] });
  }
}}
```

## TypeScript Types

### ValidationError Type:

```typescript
export interface ValidationError {
  fieldErrors?: Record<string, string[]>;
  message: string;
}
```

### Error State Type:

```typescript
Record<string, string[]>

// Example:
{
  email: ["The email has already been taken."],
  phone: ["The phone has already been taken.", "Phone must be 11 digits."]
}
```

## Testing Error Handling

### Test Duplicate Email/Phone:

1. Sign up with an email/phone that already exists
2. Verify toast notifications appear
3. Verify red borders on affected fields
4. Verify error messages below fields
5. Start typing in a field
6. Verify error clears for that field

### Test Password Mismatch:

1. Enter different passwords in password fields
2. Click "Sign Up"
3. Verify error shows on confirm password field
4. Verify form does not submit
5. Match passwords
6. Verify error clears

### Test Multiple Errors:

1. Use duplicate email AND phone
2. Verify both errors show simultaneously
3. Verify both fields have red borders
4. Fix one field
5. Verify only that field's error clears

## Benefits

✅ **Dual Notification System:**

- Toast notifications for immediate feedback
- Inline errors for persistent context

✅ **Field-Specific Feedback:**

- Users know exactly which fields need fixing
- Clear, actionable error messages

✅ **Progressive Error Clearing:**

- Errors clear as user types
- Reduces frustration and confusion

✅ **Multiple Error Support:**

- Can display multiple errors per field
- Can display errors on multiple fields simultaneously

✅ **Accessible:**

- Clear visual indicators (color + text)
- Screen reader friendly with proper semantics

## Customization

### Change Error Color:

Replace `border-red-500` and `text-red-500` with your preferred Tailwind color classes.

### Change Error Message Style:

Modify the `<p>` element's className:

```typescript
<p className="text-sm text-red-600 font-medium mt-1">{error}</p>
```

### Add Icons to Errors:

```typescript
import { AlertCircle } from "lucide-react";

{errors.email?.map((error, index) => (
  <div key={index} className="flex items-center gap-2 text-sm text-red-500">
    <AlertCircle className="h-4 w-4" />
    <p>{error}</p>
  </div>
))}
```

### Disable Toast Notifications:

Remove the `toast.error()` calls from AuthContext if you only want inline errors.

---

**Error handling is now fully functional!** 🎉

The system provides comprehensive feedback through both toast notifications and inline field errors, ensuring users always know what went wrong and how to fix it.
