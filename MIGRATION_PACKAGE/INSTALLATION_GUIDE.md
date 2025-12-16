# Installation & Migration Guide

Step-by-step guide to integrate the Hometex components into your new project.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Installation](#step-by-step-installation)
3. [Configuration](#configuration)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ Next.js project (v12+) set up with Pages Router
- ✅ Node.js 16+ installed
- ✅ npm, yarn, or pnpm package manager
- ✅ Tailwind CSS configured (optional but recommended)
- ✅ TypeScript or JavaScript project
- ✅ API endpoints ready (or mock data for testing)

---

## Step-by-Step Installation

### Step 1: Copy Files to Your Project

**Option A: Copy Entire Folder**
```bash
# Copy the entire components folder
cp -r MIGRATION_PACKAGE/components/* your-project/components/

# Copy context files
cp -r MIGRATION_PACKAGE/context/* your-project/context/

# Copy utility files
cp -r MIGRATION_PACKAGE/ults/* your-project/ults/

# Copy styles
cp -r MIGRATION_PACKAGE/styles/* your-project/styles/
```

**Option B: Manual Copy**
1. Copy `MIGRATION_PACKAGE/components/` → `your-project/components/`
2. Copy `MIGRATION_PACKAGE/context/` → `your-project/context/`
3. Copy `MIGRATION_PACKAGE/ults/` → `your-project/ults/`
4. Copy `MIGRATION_PACKAGE/styles/` → `your-project/styles/`

### Step 2: Install Dependencies

```bash
npm install swiper react-rating-stars-component react-tabs reactjs-popup sweetalert2 react-icons cookies-next react-geolocated
```

Or with yarn:
```bash
yarn add swiper react-rating-stars-component react-tabs reactjs-popup sweetalert2 react-icons cookies-next react-geolocated
```

### Step 3: Update Constants File

Edit `ults/Constant.js` (or `ults/constants.ts`):

```javascript
const Constants = {
  BASE_URL: "https://your-api-url.com",  // ← Change this to your API URL
  
  // Add any other constants you need
  API_KEY: "your-api-key",
  IMAGE_BASE_URL: "https://your-cdn.com",
};

export default Constants;
```

### Step 4: Set Up Path Aliases

Update `jsconfig.json` (JavaScript) or `tsconfig.json` (TypeScript):

**For JavaScript (`jsconfig.json`):**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/context/*": ["context/*"],
      "@/ults/*": ["ults/*"],
      "@/styles/*": ["styles/*"]
    }
  }
}
```

**For TypeScript (`tsconfig.json`):**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/context/*": ["context/*"],
      "@/ults/*": ["ults/*"],
      "@/styles/*": ["styles/*"]
    },
    "jsx": "preserve",
    // ... other options
  }
}
```

### Step 5: Set Up Context Providers

Update your `pages/_app.js` (or `pages/_app.tsx`):

```javascript
import { CartProvider } from '@/context/CartContext';
import { WishListProvider } from '@/context/WishListContext';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <WishListProvider>
        <Component {...pageProps} />
      </WishListProvider>
    </CartProvider>
  );
}

export default MyApp;
```

### Step 6: Configure Next.js for External Images

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.pexels.com',
      'media.istockphoto.com',
      'www.shutterstock.com',
      'i0.wp.com',
      'media1.giphy.com',
      'colchonesnaco.com',
      // Add your own image domains here
    ],
  },
}

module.exports = nextConfig
```

### Step 7: Import Global Styles

In your `pages/_app.js`, make sure to import necessary CSS:

```javascript
import '@/styles/globals.css';
// These are imported automatically by components, but you can add them here too:
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
```

---

## Configuration

### 1. Context Configuration

The contexts are already set up, but you may want to customize them:

**CartContext (`context/CartContext.js`):**
- Manages shopping cart state
- Stores cart items in localStorage/cookies
- Provides: `cart`, `addToCart`, `removeFromCart`, `updateQuantity`, etc.

**WishListContext (`context/WishListContext.js`):**
- Manages wishlist state
- Stores wishlist items
- Provides: `wishlist`, `addToWishlist`, `removeFromWishlist`, etc.

### 2. API Configuration

Update API endpoints in components if needed:

**MainSlider** uses:
```javascript
fetch(`${Constants.BASE_URL}/api/banner/slider`)
```

**DesignThree** uses:
```javascript
fetch(`${Constants.BASE_URL}/api/products-web`)
```

**FloatingBar** uses:
```javascript
fetch(`${Constants.BASE_URL}/api/product-menu/horizontal`)
```

Make sure these endpoints exist or update the fetch URLs.

### 3. Styling Configuration

If using Tailwind CSS, ensure `tailwind.config.js` includes:

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom colors, fonts, etc.
    },
  },
  plugins: [],
}
```

---

## Usage Examples

### Example 1: Using Components on Homepage

Create or update `pages/index.js`:

```javascript
import MainSlider from "@/components/home/MainSlider";
import FloatingBar from "@/components/FloatingBar";
import DesignSix from "@/components/newDesigns/DesignSix";
import DesignOne from "@/components/newDesigns/DesignOne";
import ProductsTabs from "@/components/home/ProductsTabs";
import DesignFifteen from "@/components/newDesigns/DesignFifteen";
import DesignThree from "@/components/newDesigns/DesignThree";
import DesignSeven from "@/components/newDesigns/DesignSeven";
import DesignEleven from "@/components/newDesigns/DesignEleven";
import HoverImageOverlay from "@/components/newDesigns/NewDeal";
import Prefooter2 from "@/components/layout/Prefooter2";
import DesignTwelve from "@/components/newDesigns/DesignTwilve";

export default function Home({ products }) {
  return (
    <div>
      {/* Hero Section */}
      <MainSlider />
      
      {/* Floating Action Bar */}
      <FloatingBar />
      
      {/* Collections Grid */}
      <DesignSix />
      
      {/* Info Section */}
      <DesignOne />
      
      {/* Product Tabs */}
      {products && <ProductsTabs products={products} />}
      
      {/* Category Showcase */}
      <DesignFifteen />
      
      {/* Hot Deals */}
      <DesignThree />
      
      {/* Brand Carousel */}
      <DesignSeven />
      
      {/* Promotional Grid */}
      <DesignEleven />
      
      {/* Best Deals */}
      <HoverImageOverlay />
      
      {/* Newsletter */}
      <DesignTwelve />
      
      {/* Pre-footer */}
      <Prefooter2 />
    </div>
  );
}

// Fetch products on server side
export async function getServerSideProps() {
  try {
    const res = await fetch('https://your-api.com/api/products');
    const products = await res.json();
    
    return {
      props: { products: products.data || [] }
    };
  } catch (error) {
    return {
      props: { products: [] }
    };
  }
}
```

### Example 2: Using Individual Components

```javascript
// Just the slider
import MainSlider from "@/components/home/MainSlider";

export default function LandingPage() {
  return (
    <div>
      <MainSlider />
      {/* Other content */}
    </div>
  );
}
```

```javascript
// Just the hot deals
import DesignThree from "@/components/newDesigns/DesignThree";

export default function DealsPage() {
  return (
    <div>
      <h1>Today's Hot Deals</h1>
      <DesignThree />
    </div>
  );
}
```

### Example 3: Using Context in Custom Components

```javascript
import { useContext } from 'react';
import CartContext from '@/context/CartContext';
import WishListContext from '@/context/WishListContext';

export default function MyCustomComponent() {
  const { cart, addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist } = useContext(WishListContext);
  
  const handleAddToCart = (product) => {
    addToCart(product);
  };
  
  return (
    <div>
      <p>Cart items: {cart?.cartItems?.length || 0}</p>
      <p>Wishlist items: {wishlist?.length || 0}</p>
      {/* Your UI */}
    </div>
  );
}
```

---

## Testing

### Step 1: Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000`

### Step 2: Test Each Component

Create a test page (`pages/test-components.js`):

```javascript
import MainSlider from "@/components/home/MainSlider";
import DesignOne from "@/components/newDesigns/DesignOne";
import DesignSix from "@/components/newDesigns/DesignSix";
// ... import others

export default function TestPage() {
  return (
    <div>
      <h1>Component Testing</h1>
      
      <section>
        <h2>MainSlider</h2>
        <MainSlider />
      </section>
      
      <section>
        <h2>DesignOne</h2>
        <DesignOne />
      </section>
      
      <section>
        <h2>DesignSix</h2>
        <DesignSix />
      </section>
      
      {/* Add more components to test */}
    </div>
  );
}
```

### Step 3: Test Checklist

- [ ] MainSlider loads and transitions work
- [ ] Products display in ProductsTabs
- [ ] Hot deals carousel scrolls
- [ ] FloatingBar appears on scroll
- [ ] Cart/wishlist modals open/close
- [ ] Add to cart functionality works
- [ ] Add to wishlist works
- [ ] All images load correctly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] API calls succeed

### Step 4: Test Responsive Design

Test on different screen sizes:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1440px, 1920px

### Step 5: Test Browser Compatibility

Test in:
- Chrome
- Firefox
- Safari
- Edge

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Import Path Errors

**Error:** `Module not found: Can't resolve '@/components/...'`

**Solution:**
- Check `jsconfig.json` or `tsconfig.json` has correct paths
- Restart dev server after changing config
- Use relative paths if aliases don't work: `../../components/...`

#### 2. CSS Not Loading

**Error:** Components look unstyled

**Solution:**
- Make sure Tailwind CSS is installed and configured
- Check `globals.css` imports Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Import CSS modules correctly
- Check CSS module files are copied to `styles/`

#### 3. Swiper Not Working

**Error:** Slider doesn't appear or transition

**Solution:**
- Install swiper: `npm install swiper`
- Import CSS:
  ```javascript
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination';
  ```
- Check Swiper version (should be v11+)

#### 4. Context Errors

**Error:** `Cannot read property 'cartItems' of undefined`

**Solution:**
- Make sure context providers wrap your app in `_app.js`
- Check context import paths are correct
- Verify contexts export properly

#### 5. API Errors

**Error:** `Failed to fetch` or `404 Not Found`

**Solution:**
- Update `ults/Constant.js` with correct API URL
- Check API endpoints exist
- Verify CORS is enabled on your API
- Check network tab in browser DevTools
- Use mock data for testing:
  ```javascript
  // Temporarily replace API call
  const mockData = [/* your mock data */];
  setProducts(mockData);
  ```

#### 6. Image Loading Errors

**Error:** Images not displaying or 403 errors

**Solution:**
- Add image domains to `next.config.js`
- Use local images instead of external URLs
- Check image paths are correct
- Use Next.js `<Image>` component for optimization

#### 7. Cookie Issues

**Error:** Cart/wishlist not persisting

**Solution:**
- Check cookies-next is installed
- Clear browser cookies and test again
- Check browser doesn't block cookies
- Use localStorage as fallback

#### 8. TypeScript Errors

**Error:** Type errors in TypeScript project

**Solution:**
- Create type definitions for components
- Use `// @ts-ignore` temporarily
- Convert `.jsx` files to `.tsx`
- Add proper type annotations

#### 9. Build Errors

**Error:** Build fails in production

**Solution:**
- Run `npm run build` locally to test
- Check for dynamic imports that need SSR disable:
  ```javascript
  import dynamic from 'next/dynamic';
  const FloatingBar = dynamic(() => import('@/components/FloatingBar'), {
    ssr: false
  });
  ```
- Check all dependencies are in `package.json`
- Clear `.next` folder and rebuild

#### 10. Performance Issues

**Error:** Page loads slowly

**Solution:**
- Use dynamic imports for heavy components
- Lazy load images
- Optimize API calls
- Use `getStaticProps` instead of `getServerSideProps` when possible
- Enable Next.js image optimization

---

## Advanced Configuration

### Custom Styling

Override component styles by adding custom CSS:

```css
/* In your globals.css or component-specific CSS */

/* Override MainSlider styles */
.mySwiper {
  /* Your custom styles */
}

/* Override ProductsTabs styles */
.react-tabs__tab--selected {
  /* Your custom styles */
}
```

### Custom Hooks

Create custom hooks for reusable logic:

```javascript
// hooks/useProducts.js
import { useState, useEffect } from 'react';
import Constants from '@/ults/Constant';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${Constants.BASE_URL}/api/products-web`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.data || []);
        setLoading(false);
      });
  }, []);
  
  return { products, loading };
}
```

### Environment Variables

Use `.env.local` for sensitive data:

```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_API_KEY=your-api-key
```

Update `ults/Constant.js`:

```javascript
const Constants = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  API_KEY: process.env.NEXT_PUBLIC_API_KEY,
};
```

---

## Deployment

### Before Deploying

1. Test build locally:
   ```bash
   npm run build
   npm start
   ```

2. Check environment variables are set on hosting platform

3. Verify API endpoints are accessible from production

4. Test all features in production mode

### Deployment Platforms

**Vercel (Recommended for Next.js):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
- Build command: `npm run build`
- Publish directory: `.next`

**Other Platforms:**
- Make sure Node.js version matches your local environment
- Set environment variables
- Configure build settings

---

## Next Steps

After successful installation:

1. ✅ Customize component content and styling
2. ✅ Connect to your actual API endpoints
3. ✅ Add your branding (logo, colors, fonts)
4. ✅ Optimize images and assets
5. ✅ Add analytics tracking
6. ✅ Set up error monitoring (Sentry, etc.)
7. ✅ Implement SEO best practices
8. ✅ Add unit tests
9. ✅ Performance optimization
10. ✅ Deploy to production

---

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Swiper:** https://swiperjs.com/react

---

**Congratulations! Your components are ready to use! 🎉**
