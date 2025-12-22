# Pusher Real-Time Viewer Tracking Setup

This guide explains how to set up Pusher for real-time product viewer tracking.

## Overview

The application uses Pusher to track how many people are viewing each product page in real-time. This provides authentic social proof instead of fake/random numbers.

## Features

- ✅ Real-time viewer count per product
- ✅ Automatic join/leave tracking
- ✅ WebSocket-based updates (no polling)
- ✅ Free tier: 100 concurrent connections, 200k messages/day

## Setup Instructions

### 1. Create a Pusher Account

1. Go to [https://pusher.com/](https://pusher.com/)
2. Sign up for a free account
3. Create a new app (choose "Channels" product)
4. Select your region (recommend: `ap2` for Asia Pacific)

### 2. Get Your Credentials

From your Pusher dashboard:

1. Go to "App Keys" section
2. Copy the following values:
   - `app_id`
   - `key`
   - `secret`
   - `cluster`

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Pusher Configuration
PUSHER_APP_ID=your_app_id_here
PUSHER_SECRET=your_secret_here
NEXT_PUBLIC_PUSHER_KEY=your_key_here
NEXT_PUBLIC_PUSHER_CLUSTER=ap2
```

> **Important**: Replace the values with your actual Pusher credentials.

### 4. Restart Development Server

```bash
npm run dev
```

## How It Works

### Component Integration

The `ProductPopularityPopup` component automatically:

1. Connects to Pusher when a user views a product
2. Joins the product's presence channel
3. Receives real-time updates when other users join/leave
4. Displays accurate viewer count
5. Cleans up connection when user leaves

### API Endpoints

#### POST `/api/product-viewers`

Tracks user join/leave actions

```json
{
  "productId": 123,
  "action": "join" | "leave",
  "userId": "unique-session-id"
}
```

#### GET `/api/product-viewers?productId=123`

Returns current viewer count

```json
{
  "viewerCount": 5
}
```

## Usage Example

```tsx
import { ProductPopularityPopup } from "@/components/products/ProductPopularityPopup";

// In your product page
<ProductPopularityPopup productId={product.id} />;
```

The component will automatically:

- Show "X others are looking at this right now" with real count
- Update in real-time when others join/leave
- Clean up connections on unmount

## Free Tier Limits

Pusher free tier includes:

- **100 concurrent connections**
- **200,000 messages per day**
- **Unlimited channels**

For a typical e-commerce site:

- Average session: 5-10 minutes
- 100 concurrent = ~1,000-2,000 visitors/day
- Should be sufficient for small-medium traffic

## Scaling (Optional)

If you exceed free tier limits:

### Option 1: Upgrade Pusher

- $49/month for 500 concurrent connections

### Option 2: Switch to Self-Hosted

- Use Socket.io with Redis
- Requires custom server setup
- See `docs/guides/SOCKET_IO_MIGRATION.md`

## Testing

To test locally:

1. Open product page in multiple browsers/tabs
2. Watch viewer count update in real-time
3. Close a tab and see count decrease

## Troubleshooting

### Viewer count not updating

- Check environment variables are set correctly
- Verify Pusher credentials in dashboard
- Check browser console for connection errors

### Connection errors

- Ensure `NEXT_PUBLIC_` prefix for client-side variables
- Verify cluster matches your app region
- Check firewall/proxy settings

### Count inaccurate

- Clear browser cache and restart dev server
- Check that cleanup function runs on unmount
- Verify API endpoints are accessible

## Production Considerations

### 1. Redis for State (Recommended)

Current implementation uses in-memory Map. For production with multiple servers, use Redis:

```typescript
// Example with Redis
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Track viewers
await redis.sadd(`product:${productId}:viewers`, userId);
const count = await redis.scard(`product:${productId}:viewers`);
```

### 2. Cleanup Stale Connections

Set up periodic cleanup for users who didn't properly disconnect:

```typescript
// Clean up viewers inactive for 5+ minutes
setInterval(async () => {
  // Remove entries older than 5 minutes
  await redis.zremrangebyscore(`product:${productId}:viewers`, 0, Date.now() - 5 * 60 * 1000);
}, 60000);
```

### 3. Rate Limiting

Add rate limiting to prevent abuse:

```typescript
// Limit join/leave actions per user
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
});
```

## Alternative Solutions

If Pusher doesn't fit your needs:

| Solution      | Pros                | Cons               | Cost      |
| ------------- | ------------------- | ------------------ | --------- |
| **Pusher**    | Easy setup, managed | Limited free tier  | $0-$49/mo |
| **Socket.io** | Full control, free  | Need custom server | Free      |
| **Ably**      | Better free tier    | Similar to Pusher  | $0-$29/mo |
| **Supabase**  | If using Supabase   | Requires Supabase  | $0-$25/mo |
| **PartyKit**  | Next.js optimized   | Newer, less stable | $0-$10/mo |

## Support

For issues or questions:

- Check Pusher docs: https://pusher.com/docs/channels
- Pusher dashboard: https://dashboard.pusher.com
- Contact: your-team@hometexbd.com
