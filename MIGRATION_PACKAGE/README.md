# Hometex Components Migration Package

This package contains all the components and dependencies needed to migrate the key homepage features to your new project.

## 📦 Package Contents

This migration package includes:
- **12 Main Components** (MainSlider, FloatingBar, ProductsTabs, and 9 Design components)
- **10 Supporting Components** (ProductCard, ProductModal, Loader, etc.)
- **2 Context Files** (CartContext, WishListContext)
- **1 Utility File** (Constants)
- **2 CSS Module Files**

## 📁 Folder Structure

```
MIGRATION_PACKAGE/
├── components/
│   ├── home/
│   │   ├── MainSlider.jsx           ← Hero slider component
│   │   └── ProductsTabs.jsx         ← Product tabs with categories
│   │
│   ├── newDesigns/
│   │   ├── DesignOne.jsx           ← Info section with icons
│   │   ├── DesignSix.jsx           ← Shop by collections (circular images)
│   │   ├── DesignSeven.jsx         ← Brand carousel with Swiper
│   │   ├── DesignEleven.jsx        ← Promotional grid (3 columns)
│   │   ├── DesignFifteen.jsx       ← Category showcase
│   │   ├── DesignThree.jsx         ← Hot Deals carousel
│   │   ├── DesignTwilve.jsx        ← Newsletter subscription
│   │   ├── NewDeal.jsx             ← Today's best deals (HoverImageOverlay)
│   │   └── ProductCard.jsx         ← Reusable product card
│   │
│   ├── layout/
│   │   ├── Prefooter2.jsx          ← Pre-footer section
│   │   ├── CartComponent/
│   │   │   └── CartComponent.js     ← Shopping cart UI
│   │   └── WishComponent/
│   │       └── WishComponent.js     ← Wishlist UI
│   │
│   ├── common/
│   │   ├── ProductModal.js         ← Product quick view modal
│   │   ├── Loader.jsx              ← Loading spinner
│   │   └── Spinner.js              ← Alternative spinner
│   │
│   ├── FloatingBar.js              ← Floating action bar (cart, wishlist, etc.)
│   ├── ChatPopup.js                ← Chat popup component
│   └── UseGeolocation.js           ← Geolocation hook
│
├── context/
│   ├── CartContext.js              ← Cart state management
│   └── WishListContext.js          ← Wishlist state management
│
├── ults/
│   └── Constant.js                 ← API constants and base URLs
│
├── styles/
│   ├── DesignThree.module.css      ← Styles for HotDeals component
│   └── ProductModal.module.css     ← Styles for product modal
│
├── README.md                       ← This file
├── DEPENDENCIES.md                 ← NPM packages needed
└── INSTALLATION_GUIDE.md           ← Step-by-step migration guide
```

## 🚀 Quick Start

1. **Copy the entire `MIGRATION_PACKAGE` folder to your new project**
2. **Read `DEPENDENCIES.md`** to install required npm packages
3. **Follow `INSTALLATION_GUIDE.md`** for step-by-step integration
4. **Update API URLs** in `ults/Constant.js` to match your new project

## 📋 Components Overview

### Main Feature Components

| Component | File | Purpose | Lines | Complexity |
|-----------|------|---------|-------|------------|
| MainSlider | `components/home/MainSlider.jsx` | Hero slider with animations | 218 | Medium |
| FloatingBar | `components/FloatingBar.js` | Floating action bar | 1,646 | High |
| ProductsTabs | `components/home/ProductsTabs.jsx` | Product tabs display | 714 | High |
| DesignThree | `components/newDesigns/DesignThree.jsx` | Hot Deals carousel | 288 | Medium |
| Prefooter2 | `components/layout/Prefooter2.jsx` | Pre-footer section | 158 | Low |

### Design Components (Simple)

| Component | File | Purpose | Lines |
|-----------|------|---------|-------|
| DesignOne | `components/newDesigns/DesignOne.jsx` | Info section | 48 |
| DesignSix | `components/newDesigns/DesignSix.jsx` | Collections grid | 48 |
| DesignSeven | `components/newDesigns/DesignSeven.jsx` | Brand carousel | 99 |
| DesignEleven | `components/newDesigns/DesignEleven.jsx` | Promo grid | 60 |
| DesignFifteen | `components/newDesigns/DesignFifteen.jsx` | Category cards | 46 |
| NewDeal | `components/newDesigns/NewDeal.jsx` | Best deals | 98 |
| DesignTwilve | `components/newDesigns/DesignTwilve.jsx` | Newsletter | 41 |

## ⚠️ Important Notes

### Before Integration:

1. **Check Next.js Version**: These components are built for Next.js (Pages Router)
2. **Update Import Paths**: Change `@/` alias to match your project structure
3. **API Endpoints**: Update base URLs in `ults/Constant.js`
4. **Context Providers**: Wrap your app with CartContext and WishListContext
5. **CSS Modules**: Ensure your project supports CSS Modules

### Known Dependencies:

- React 17+ or React 18+
- Next.js 12+ (Pages Router)
- Swiper.js for carousels
- React Icons for icons
- cookies-next for cookie management
- Several other packages (see DEPENDENCIES.md)

## 🔧 Configuration Required

### 1. Update Constants
Edit `ults/Constant.js` and update:
```javascript
const Constants = {
  BASE_URL: "https://your-api-url.com", // ← Change this
  // ... other constants
};
```

### 2. Set Up Contexts
In your `_app.js` or `_app.tsx`:
```javascript
import CartContext from '@/context/CartContext';
import WishListContext from '@/context/WishListContext';

function MyApp({ Component, pageProps }) {
  return (
    <CartContext.Provider>
      <WishListContext.Provider>
        <Component {...pageProps} />
      </WishListContext.Provider>
    </CartContext.Provider>
  );
}
```

### 3. Update Import Aliases
If your project uses a different path alias (not `@/`), do a find-and-replace:
- Find: `@/components`
- Replace: `your-alias/components`
- Find: `@/context`
- Replace: `your-alias/context`
- And so on...

## 📊 API Endpoints Used

These components make API calls to:
1. `/api/banner/slider` - Banner/slider data (MainSlider)
2. `/api/products-web` - Product listings (DesignThree, ProductsTabs)
3. `/api/product-menu/horizontal` - Category menu (FloatingBar)

Make sure these endpoints exist in your new project or update the components accordingly.

## 🎨 Assets Required

Some components reference image files. Make sure you have:
- `/images/icons/` - Icon images (i1.png, i2.png, i3.png)
- `/images/designSix/` - Category images
- `/images/blog/` - Blog images
- `/images/bestql.png` - Quality stamp image
- `/images/22L.png`, `/images/11L.png` - Product images

## 🔄 Migration Order

For best results, migrate in this order:

**Phase 1 - Foundation:**
1. Copy `ults/Constant.js` and update URLs
2. Copy context files (`context/`)
3. Install all dependencies (see DEPENDENCIES.md)

**Phase 2 - Supporting Components:**
4. Copy `components/common/` (Loader, Spinner, ProductModal)
5. Copy `components/UseGeolocation.js`
6. Copy `components/ChatPopup.js`

**Phase 3 - Complex Components:**
7. Copy `components/layout/CartComponent/`
8. Copy `components/layout/WishComponent/`
9. Copy `components/newDesigns/ProductCard.jsx`

**Phase 4 - Main Components:**
10. Copy all `components/newDesigns/Design*.jsx` files
11. Copy `components/home/MainSlider.jsx`
12. Copy `components/home/ProductsTabs.jsx`
13. Copy `components/FloatingBar.js`
14. Copy `components/layout/Prefooter2.jsx`

**Phase 5 - Styles:**
15. Copy all files from `styles/`

## 🧪 Testing

After integration, test these features:
- [ ] Hero slider loads and animates correctly
- [ ] Product tabs display products
- [ ] Hot deals carousel works
- [ ] Add to cart functionality
- [ ] Wishlist functionality
- [ ] Floating bar appears on scroll
- [ ] All modals open/close properly
- [ ] Responsive design on mobile/tablet
- [ ] API calls return data correctly

## 📝 Customization

Feel free to customize:
- Colors and styling in component files
- Animation speeds and effects
- Layout and spacing
- Text content
- Image sources

## 🐛 Troubleshooting

**Import errors?**
- Check your path aliases in `jsconfig.json` or `tsconfig.json`
- Update import statements to match your project structure

**API errors?**
- Verify `ults/Constant.js` has correct URLs
- Check API endpoints exist and return correct data format
- Check CORS settings on your API

**Style issues?**
- Ensure CSS Modules are enabled
- Copy corresponding CSS files from `styles/`
- Check Tailwind CSS is installed and configured

**Context errors?**
- Make sure CartContext and WishListContext wrap your app
- Verify context providers are properly set up

## 📞 Support

If you encounter issues:
1. Check INSTALLATION_GUIDE.md for detailed steps
2. Review DEPENDENCIES.md for missing packages
3. Compare file structure with original project
4. Verify all imports are correct

## ✅ Checklist

- [ ] Copied all files to new project
- [ ] Installed all dependencies
- [ ] Updated Constants with new API URLs
- [ ] Set up Context providers
- [ ] Updated import paths
- [ ] Copied CSS modules
- [ ] Copied required image assets
- [ ] Tested all components
- [ ] Responsive design works
- [ ] API integration works

---

**Good luck with your migration! 🚀**
