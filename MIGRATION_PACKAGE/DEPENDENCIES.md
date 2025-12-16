# NPM Dependencies Required

This document lists all the npm packages required for the migrated components to work properly.

## 📦 Required Packages

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0"
  }
}
```

### UI & Animation Libraries

```json
{
  "dependencies": {
    "swiper": "^11.0.0",
    "react-rating-stars-component": "^2.2.0",
    "react-tabs": "^6.0.0",
    "reactjs-popup": "^2.0.0",
    "sweetalert2": "^11.0.0"
  }
}
```

### Icon Libraries

```json
{
  "dependencies": {
    "react-icons": "^4.12.0"
  }
}
```

### Utility Libraries

```json
{
  "dependencies": {
    "cookies-next": "^4.1.0",
    "react-geolocated": "^4.1.0"
  }
}
```

### Styling (if not already installed)

```json
{
  "dependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 🚀 Quick Installation

### Install All at Once

Run this command in your project root:

```bash
npm install swiper react-rating-stars-component react-tabs reactjs-popup sweetalert2 react-icons cookies-next react-geolocated
```

Or with yarn:

```bash
yarn add swiper react-rating-stars-component react-tabs reactjs-popup sweetalert2 react-icons cookies-next react-geolocated
```

Or with pnpm:

```bash
pnpm add swiper react-rating-stars-component react-tabs reactjs-popup sweetalert2 react-icons cookies-next react-geolocated
```

## 📋 Detailed Package Information

### 1. Swiper (^11.0.0)
- **Used by:** MainSlider, DesignThree, DesignSeven
- **Purpose:** Modern touch slider/carousel
- **Docs:** https://swiperjs.com/react
- **Import examples:**
  ```javascript
  import { Swiper, SwiperSlide } from 'swiper/react';
  import { Autoplay, Pagination, EffectFade, Navigation, FreeMode } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/pagination';
  import 'swiper/css/effect-fade';
  import 'swiper/css/navigation';
  import 'swiper/css/free-mode';
  ```

### 2. React Rating Stars Component (^2.2.0)
- **Used by:** ProductsTabs
- **Purpose:** Star rating display
- **Docs:** https://www.npmjs.com/package/react-rating-stars-component
- **Import:**
  ```javascript
  import ReactStars from "react-rating-stars-component";
  ```

### 3. React Tabs (^6.0.0)
- **Used by:** ProductsTabs
- **Purpose:** Accessible tab navigation
- **Docs:** https://reactcommunity.org/react-tabs/
- **Import:**
  ```javascript
  import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
  import 'react-tabs/style/react-tabs.css';
  ```

### 4. Reactjs Popup (^2.0.0)
- **Used by:** FloatingBar
- **Purpose:** Modal/popup dialogs
- **Docs:** https://react-popup.elazizi.com/
- **Import:**
  ```javascript
  import Popup from 'reactjs-popup';
  ```

### 5. SweetAlert2 (^11.0.0)
- **Used by:** ProductsTabs
- **Purpose:** Beautiful alert messages
- **Docs:** https://sweetalert2.github.io/
- **Import:**
  ```javascript
  import Swal from 'sweetalert2';
  ```

### 6. React Icons (^4.12.0)
- **Used by:** FloatingBar, ProductsTabs, Prefooter2
- **Purpose:** Popular icon packs (Font Awesome, Material Design, etc.)
- **Docs:** https://react-icons.github.io/react-icons/
- **Import examples:**
  ```javascript
  import { FaShoppingCart, FaHeart, FaEye } from 'react-icons/fa';
  import { MdFavorite } from 'react-icons/md';
  import { RiShoppingBasketFill } from 'react-icons/ri';
  ```

### 7. Cookies Next (^4.1.0)
- **Used by:** FloatingBar, DesignThree, ProductsTabs
- **Purpose:** Cookie management for Next.js
- **Docs:** https://www.npmjs.com/package/cookies-next
- **Import:**
  ```javascript
  import { getCookie, setCookie } from 'cookies-next';
  ```

### 8. React Geolocated (^4.1.0)
- **Used by:** FloatingBar
- **Purpose:** Geolocation hook
- **Docs:** https://www.npmjs.com/package/react-geolocated
- **Import:**
  ```javascript
  import { useGeolocated } from 'react-geolocated';
  ```

## 🎨 CSS & Styling

### Tailwind CSS

Most components use Tailwind CSS classes. If not already installed:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then configure `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### CSS Modules

The project uses CSS Modules for some components. Next.js supports this by default.

Required CSS module files (already included in styles folder):
- `DesignThree.module.css`
- `ProductModal.module.css`

## 🔍 Version Compatibility

### Minimum Versions
- Node.js: 16.x or higher
- React: 17.x or higher
- Next.js: 12.x or higher

### Recommended Versions
- Node.js: 18.x or 20.x
- React: 18.x
- Next.js: 14.x

## ⚙️ Configuration

### Next.js Configuration

Ensure your `next.config.js` includes:

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
  // ... other config
}

module.exports = nextConfig
```

### Path Aliases

Ensure `jsconfig.json` or `tsconfig.json` has proper path aliases:

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

## 📊 Package Size Impact

Approximate bundle size impact:

| Package | Minified Size | Gzipped |
|---------|---------------|---------|
| swiper | ~150 KB | ~40 KB |
| react-icons | ~3 KB per icon | ~1 KB per icon |
| sweetalert2 | ~45 KB | ~15 KB |
| react-tabs | ~8 KB | ~3 KB |
| react-rating-stars-component | ~5 KB | ~2 KB |
| reactjs-popup | ~6 KB | ~2 KB |
| cookies-next | ~2 KB | ~1 KB |
| react-geolocated | ~3 KB | ~1 KB |

**Total additional size: ~220 KB minified (~65 KB gzipped)**

## 🔄 Update Strategy

To update packages in the future:

```bash
# Check for outdated packages
npm outdated

# Update all packages to latest (be careful!)
npm update

# Update specific package
npm install swiper@latest

# Or use npm-check-updates
npx npm-check-updates -u
npm install
```

## 🐛 Troubleshooting

### Swiper Issues

**Error: "Cannot find module 'swiper'"**
```bash
npm install swiper
```

**Styles not loading:**
Make sure to import CSS files:
```javascript
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
```

### React Icons Issues

**Icons not showing:**
```bash
npm install react-icons
```

**Wrong icon style:**
- `fa` = Font Awesome
- `md` = Material Design
- `ri` = Remix Icon
- `ai` = Ant Design
- `bi` = Bootstrap Icons

### Cookie Issues

**Cookies not working:**
- Make sure cookies-next is installed
- Check browser privacy settings
- Ensure HTTPS in production

### SweetAlert2 Issues

**Alerts not styled:**
SweetAlert2 includes its own styles. No additional CSS needed.

### Next.js Image Issues

**External images not loading:**
Add image domains to `next.config.js`:
```javascript
images: {
  domains: ['your-domain.com'],
}
```

## ✅ Installation Checklist

After installing packages:

- [ ] Run `npm install` successfully
- [ ] No peer dependency warnings
- [ ] Dev server starts without errors
- [ ] Components import correctly
- [ ] Swiper carousels work
- [ ] Icons display properly
- [ ] Modals/popups open
- [ ] Cookies save/load
- [ ] Alerts display
- [ ] Tabs switch correctly
- [ ] Star ratings show

## 📝 package.json Reference

Here's a complete `package.json` dependencies section for reference:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "swiper": "^11.0.0",
    "react-rating-stars-component": "^2.2.0",
    "react-tabs": "^6.0.0",
    "reactjs-popup": "^2.0.0",
    "sweetalert2": "^11.0.0",
    "react-icons": "^4.12.0",
    "cookies-next": "^4.1.0",
    "react-geolocated": "^4.1.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

**Ready to install? Run the installation command and continue to INSTALLATION_GUIDE.md!**
