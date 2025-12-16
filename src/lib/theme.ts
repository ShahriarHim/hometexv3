/**
 * HOMETEX Theme Configuration
 * Central place to manage all theme colors and design tokens
 *
 * HOW TO USE:
 * 1. Change colors in this file
 * 2. Run: npm run build (or restart dev server)
 * 3. All components will automatically use new colors
 *
 * COLOR FORMAT: HSL (Hue Saturation Lightness)
 * - Easier to create variations (lighter/darker)
 * - Better for accessibility
 */

export const theme = {
  colors: {
    // ===== NEUTRALS =====
    white: "hsl(0, 0%, 100%)",
    black: "hsl(0, 0%, 9%)",

    // ===== PRIMARY - Brand Yellow =====
    primary: {
      main: "hsl(61, 100%, 50%)", // #E8FE00 - Electric Yellow
      hover: "hsl(61, 100%, 45%)", // Darker yellow
      active: "hsl(61, 100%, 40%)", // Even darker
      light: "hsl(61, 100%, 88%)", // Light tint
      foreground: "hsl(0, 0%, 9%)", // Black text
    },

    // ===== SECONDARY - Deep Navy =====
    secondary: {
      main: "hsl(215, 45%, 20%)", // #1C2E45 - Professional navy
      hover: "hsl(215, 45%, 16%)", // Darker navy
      light: "hsl(215, 45%, 92%)", // Light tint
      foreground: "hsl(0, 0%, 100%)", // White text
    },

    // ===== ACCENTS =====
    accent: {
      emerald: {
        main: "hsl(155, 65%, 40%)", // #24A868 - Success/CTA
        hover: "hsl(155, 65%, 35%)", // Darker
        light: "hsl(155, 65%, 92%)", // Light tint
      },
      orange: {
        main: "hsl(20, 95%, 55%)", // #FA6B3D - Highlights
        hover: "hsl(20, 95%, 48%)", // Darker
        light: "hsl(20, 95%, 94%)", // Light tint
      },
    },

    // ===== SEMANTIC =====
    success: "hsl(155, 65%, 40%)", // Emerald
    warning: "hsl(38, 100%, 55%)", // Orange
    error: "hsl(0, 72%, 51%)", // Red
    info: "hsl(215, 100%, 50%)", // Blue

    // ===== TEXT =====
    text: {
      primary: "hsl(0, 0%, 9%)", // Rich black
      secondary: "hsl(0, 0%, 40%)", // Medium gray
      tertiary: "hsl(0, 0%, 60%)", // Light gray
      muted: "hsl(0, 0%, 70%)", // Very light gray
    },

    // ===== E-COMMERCE SPECIFIC =====
    ecommerce: {
      price: "hsl(155, 65%, 40%)", // Emerald for prices
      discount: "hsl(0, 72%, 51%)", // Red for discount badges
      badge: "hsl(38, 100%, 55%)", // Orange for badges
      inStock: "hsl(155, 65%, 40%)", // Emerald
      lowStock: "hsl(38, 100%, 55%)", // Orange
      outOfStock: "hsl(0, 0%, 60%)", // Gray
    },
  },

  // ===== QUICK REFERENCE =====
  usage: {
    buttons: {
      primary: "Use for main CTAs (Add to Cart, Buy Now)",
      secondary: "Use for navigation, less important actions",
      accent: "Use for success states, special offers",
      outline: "Use for secondary actions",
      ghost: "Use for subtle interactions",
    },
    text: {
      headings: "text-text-primary",
      body: "text-text-secondary",
      subtle: "text-text-tertiary",
      muted: "text-text-muted",
    },
    backgrounds: {
      main: "bg-background (white)",
      surface: "bg-surface (off-white)",
      cards: "bg-card with shadow",
      dark: "bg-secondary (navy)",
    },
    borders: {
      default: "border-border",
      light: "border-border-light",
    },
  },
};

/**
 * COLOR PALETTE SUMMARY
 *
 * Primary Yellow (#E8FE00) - Your brand hero
 * - Use for: Logo, primary CTAs, highlights, badges
 * - Pairs with: Black text, navy backgrounds
 *
 * Deep Navy (#1C2E45) - Professional anchor
 * - Use for: Headers, footers, buttons, text blocks
 * - Pairs with: White text, yellow accents
 *
 * Emerald (#24A868) - Success & CTAs
 * - Use for: Add to cart, prices, in-stock, success messages
 * - Conveys: Growth, trust, action
 *
 * Burnt Orange (#FA6B3D) - Energy & highlights
 * - Use for: Sale badges, hot deals, warnings
 * - Conveys: Urgency, warmth, excitement
 *
 * Rich Black (#171717) - Text & contrast
 * - Use for: Body text, headings, icons
 * - Professional and readable
 *
 * White & Off-white - Clean canvas
 * - Use for: Backgrounds, cards, spacing
 * - Creates breathing room
 */

export default theme;
