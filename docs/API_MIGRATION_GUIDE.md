# API Architecture Migration Guide

## Overview

The API layer has been successfully modularized from a single 1239-line `src/lib/api.ts` file into a well-structured, domain-driven service architecture following Next.js best practices.

## New Architecture

### Directory Structure

```
src/
├── services/
│   └── api/
│       ├── index.ts              # Barrel exports
│       ├── client.ts             # Core HTTP client utilities
│       ├── auth.service.ts       # Authentication APIs
│       ├── user.service.ts       # User profile APIs
│       ├── product.service.ts    # Product APIs
│       ├── order.service.ts      # Order APIs
│       ├── cart.service.ts       # Cart APIs
│       └── wishlist.service.ts   # Wishlist APIs
└── types/
    └── api/
        ├── index.ts              # Barrel exports
        ├── common.ts             # Common types (ApiResponse, Pagination, etc.)
        ├── user.ts               # User & auth types
        ├── product.ts            # Product types
        ├── order.ts              # Order types
        └── cart.ts               # Cart & wishlist types
```

### Core Components

#### 1. **Client Utilities** (`src/services/api/client.ts`)

Base HTTP client with:

- `getAuthToken()` - Get auth token from localStorage
- `authenticatedFetch()` - Basic authenticated fetch
- `fetchWithFallback()` - Authenticated fetch with localhost fallback
- `fetchPublicWithFallback()` - Public fetch with localhost fallback
- `ApiError` - Custom error class
- `handleApiResponse()` - Response handler utility

#### 2. **Service Modules**

Each service follows single responsibility principle:

**Auth Service** (`auth.service.ts`)

```typescript
import { authService } from "@/services/api";

await authService.login({ email, password });
await authService.signup(signupData);
await authService.logout();
```

**User Service** (`user.service.ts`)

```typescript
import { userService } from "@/services/api";

const profile = await userService.getProfile();
await userService.updateProfile(data);
```

**Product Service** (`product.service.ts`)

```typescript
import { productService } from "@/services/api";

const products = await productService.getProducts({ page: 1, category: "bedding" });
const product = await productService.getProduct("123");
const banners = await productService.getHeroBanners();
const menu = await productService.getMenu();
```

**Order Service** (`order.service.ts`)

```typescript
import { orderService } from "@/services/api";

const order = await orderService.createOrder(orderData);
const orders = await orderService.getOrders(page);
const orderDetail = await orderService.getOrder(orderId);
const tracking = await orderService.trackOrder(orderNumber);
await orderService.cancelOrder(orderId);
```

**Cart Service** (`cart.service.ts`)

```typescript
import { cartService } from "@/services/api";

const cart = await cartService.getCart();
await cartService.addToCart({ product_id: 1, quantity: 2 });
await cartService.updateCartItem(itemId, { quantity: 3 });
await cartService.removeFromCart(itemId);
await cartService.clearCart();
```

**Wishlist Service** (`wishlist.service.ts`)

```typescript
import { wishlistService } from "@/services/api";

const wishlist = await wishlistService.getWishlist();
await wishlistService.addToWishlist(productId);
await wishlistService.removeFromWishlist(productId);
const isInList = await wishlistService.isInWishlist(productId);
```

#### 3. **Type Definitions**

All API types are centralized in `src/types/api/`:

```typescript
import type { UserProfile, LoginResponse, Product, Order, CartItem } from "@/types/api";
```

## Migration Steps

### For Components Using Old API

**Before:**

```typescript
import { fetchWithFallback } from "@/lib/api";
import { env } from "@/lib/env";

const response = await fetchWithFallback("/api/my-profile", env.apiBaseUrl, {
  method: "GET",
  headers: { Accept: "application/json" },
});
const data = await response.json();
```

**After:**

```typescript
import { userService } from "@/services/api";

const data = await userService.getProfile();
```

### For AuthContext

**Migration completed:** `src/context/AuthContext.tsx` now uses `authService`

**Changes:**

- Removed direct `fetchPublicWithFallback` imports
- Uses `authService.login()`, `authService.signup()`, `authService.logout()`
- Cleaner code with automatic error handling and type safety

### For Account Component

**Migration completed:** `src/views/Account.tsx` now uses `userService`

**Changes:**

- Removed complex fetch logic
- Uses `userService.getProfile()` with automatic authentication
- Better type safety with `ProfileResponse` type

## Benefits

### 1. **Separation of Concerns**

- Each service handles one domain (auth, user, products, orders, etc.)
- Easy to locate and modify specific API logic

### 2. **Type Safety**

- Comprehensive TypeScript interfaces for all API requests/responses
- IntelliSense support for better developer experience
- Compile-time error checking

### 3. **Reusability**

- Services can be imported anywhere in the application
- Shared utilities in `client.ts`
- No code duplication

### 4. **Maintainability**

- Small, focused files (50-100 lines each)
- Clear naming conventions
- Easy to add new endpoints

### 5. **Testability**

- Each service can be unit tested independently
- Mock services easily for testing
- Clear interfaces for dependency injection

### 6. **Error Handling**

- Centralized error handling in `handleApiResponse()`
- Custom `ApiError` class with status codes
- Consistent error messages

## API Response Patterns

### Success Response

```typescript
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ }
}
```

### Error Response

```typescript
{
  success: false,
  message: "Error message",
  error: { /* error details */ }
}
```

### Paginated Response

```typescript
{
  success: true,
  data: {
    items: [...],
    pagination: {
      current_page: 1,
      last_page: 10,
      per_page: 20,
      total: 200
    }
  }
}
```

## Authentication Flow

1. **Login/Signup** → Token stored in `localStorage` as `hometex-auth-token`
2. **Protected Requests** → `fetchWithFallback()` automatically adds `Bearer ${token}` header
3. **Token Retrieval** → `getAuthToken()` reads from localStorage
4. **Logout** → Token removed from localStorage

## Fallback Pattern

All API calls try localhost first (3-second timeout), then fallback to production:

```typescript
// Tries http://localhost:8000/api/products
// Falls back to https://www.hometexbd.ltd/api/products
const products = await productService.getProducts();
```

## Environment Configuration

Configured in `src/lib/env.ts`:

- `apiLocalUrl`: `http://localhost:8000` (for development)
- `apiBaseUrl`: `https://www.hometexbd.ltd` (production)

## Old vs New Comparison

| Aspect          | Old (api.ts)     | New (Modular)            |
| --------------- | ---------------- | ------------------------ |
| File Size       | 1239 lines       | 50-150 lines per service |
| Organization    | Single file      | Domain-driven modules    |
| Type Safety     | Minimal          | Comprehensive interfaces |
| Maintainability | Hard to navigate | Easy to find/modify      |
| Reusability     | Function-level   | Service-level            |
| Testing         | Difficult        | Each service testable    |
| Error Handling  | Inconsistent     | Centralized              |

## Deprecation Notice

**`src/lib/api.ts` is now DEPRECATED**

- ⚠️ Do not add new functions to `api.ts`
- ⚠️ Do not import from `api.ts` in new code
- ✅ Use the new service modules instead
- ✅ Migrate existing code gradually to new services

## Next Steps

1. ✅ Core services created (auth, user, products, orders, cart, wishlist)
2. ✅ AuthContext migrated
3. ✅ Account component migrated
4. 🔄 Migrate remaining components using old api.ts
5. 🔄 Create additional services as needed (payment, reviews, etc.)
6. 🔄 Add unit tests for each service
7. 🔄 Remove old api.ts file once all migrations complete

## Questions?

Refer to:

- Service implementations in `src/services/api/`
- Type definitions in `src/types/api/`
- Migrated examples: `AuthContext.tsx`, `Account.tsx`
