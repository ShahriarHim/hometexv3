"use client";

/**
 * Color Palette Showcase Component
 *
 * This component displays all available colors in your design system.
 * Add this to a page to see your complete color palette.
 *
 * USAGE:
 * ```tsx
 * import ColorPalette from '@/components/ColorPalette';
 *
 * export default function DesignSystemPage() {
 *   return <ColorPalette />;
 * }
 * ```
 */

export default function ColorPalette() {
  const colorGroups = [
    {
      title: "Primary - Brand Yellow",
      colors: [
        { name: "Primary", class: "bg-primary text-primary-foreground", var: "--primary" },
        {
          name: "Primary Hover",
          class: "bg-primary-hover text-primary-foreground",
          var: "--primary-hover",
        },
        {
          name: "Primary Light",
          class: "bg-primary-light text-primary-foreground",
          var: "--primary-light",
        },
      ],
    },
    {
      title: "Secondary - Deep Navy",
      colors: [
        { name: "Secondary", class: "bg-secondary text-secondary-foreground", var: "--secondary" },
        {
          name: "Secondary Hover",
          class: "bg-secondary-hover text-secondary-foreground",
          var: "--secondary-hover",
        },
        {
          name: "Secondary Light",
          class: "bg-secondary-light text-text-primary",
          var: "--secondary-light",
        },
      ],
    },
    {
      title: "Accent - Emerald Green",
      colors: [
        { name: "Accent", class: "bg-accent text-accent-foreground", var: "--accent" },
        {
          name: "Accent Hover",
          class: "bg-accent-hover text-accent-foreground",
          var: "--accent-hover",
        },
        { name: "Accent Light", class: "bg-accent-light text-accent", var: "--accent-light" },
      ],
    },
    {
      title: "Accent Secondary - Burnt Orange",
      colors: [
        {
          name: "Accent Secondary",
          class: "bg-accent-secondary text-white",
          var: "--accent-secondary",
        },
        {
          name: "Accent Secondary Hover",
          class: "bg-accent-secondary-hover text-white",
          var: "--accent-secondary-hover",
        },
        {
          name: "Accent Secondary Light",
          class: "bg-accent-secondary-light text-accent-secondary",
          var: "--accent-secondary-light",
        },
      ],
    },
    {
      title: "Text Colors",
      colors: [
        { name: "Text Primary", class: "bg-text-primary text-white", var: "--text-primary" },
        { name: "Text Secondary", class: "bg-text-secondary text-white", var: "--text-secondary" },
        { name: "Text Tertiary", class: "bg-text-tertiary text-white", var: "--text-tertiary" },
        { name: "Text Muted", class: "bg-text-muted text-white", var: "--text-muted" },
      ],
    },
    {
      title: "Semantic Colors",
      colors: [
        { name: "Success", class: "bg-success text-success-foreground", var: "--success" },
        { name: "Warning", class: "bg-warning text-warning-foreground", var: "--warning" },
        { name: "Error", class: "bg-error text-error-foreground", var: "--error" },
        { name: "Info", class: "bg-info text-info-foreground", var: "--info" },
      ],
    },
    {
      title: "E-commerce",
      colors: [
        { name: "Price", class: "bg-price text-white", var: "--price" },
        { name: "Discount", class: "bg-discount text-white", var: "--discount" },
        { name: "Badge", class: "bg-badge text-white", var: "--badge" },
        { name: "Stock High", class: "bg-stock-high text-white", var: "--stock-high" },
        { name: "Stock Low", class: "bg-stock-low text-white", var: "--stock-low" },
        { name: "Stock Out", class: "bg-stock-out text-white", var: "--stock-out" },
      ],
    },
  ];

  const buttons = [
    { label: "Primary Button", class: "btn-primary" },
    { label: "Secondary Button", class: "btn-secondary" },
    { label: "Accent Button", class: "btn-accent" },
    { label: "Outline Button", class: "btn-outline" },
    { label: "Ghost Button", class: "btn-ghost" },
  ];

  const badges = [
    { label: "Primary", class: "badge-primary" },
    { label: "Success", class: "badge-success" },
    { label: "Warning", class: "badge-warning" },
    { label: "Error", class: "badge-error" },
  ];

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-text-primary">Hometex Design System</h1>
          <p className="text-text-secondary text-lg">
            Complete color palette and component showcase
          </p>
        </div>

        {/* Color Swatches */}
        {colorGroups.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {group.colors.map((color) => (
                <div key={color.name} className="space-y-2">
                  <div
                    className={`${color.class} h-32 rounded-lg shadow-md flex items-center justify-center font-semibold transition-transform hover:scale-105`}
                  >
                    {color.name}
                  </div>
                  <div className="text-sm text-text-secondary font-mono">{color.var}</div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            {buttons.map((btn) => (
              <button key={btn.label} className={btn.class}>
                {btn.label}
              </button>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span key={badge.label} className={badge.class}>
                {badge.label}
              </span>
            ))}
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-elevated p-6 space-y-2">
              <h3 className="text-xl font-bold">Elevated Card</h3>
              <p className="text-text-secondary">Card with shadow and hover effect</p>
            </div>
            <div className="card-flat p-6 space-y-2">
              <h3 className="text-xl font-bold">Flat Card</h3>
              <p className="text-text-secondary">Card with border, no shadow</p>
            </div>
          </div>
        </section>

        {/* Gradients */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-primary h-32 rounded-lg shadow-md flex items-center justify-center font-bold text-white">
              Primary Gradient
            </div>
            <div className="bg-gradient-dark h-32 rounded-lg shadow-md flex items-center justify-center font-bold text-white">
              Dark Gradient
            </div>
            <div className="bg-gradient-accent h-32 rounded-lg shadow-md flex items-center justify-center font-bold text-white">
              Accent Gradient
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Typography</h2>
          <div className="space-y-3">
            <h1 className="text-5xl">Heading 1</h1>
            <h2 className="text-4xl">Heading 2</h2>
            <h3 className="text-3xl">Heading 3</h3>
            <p className="text-text-primary text-lg">Primary text - Lorem ipsum dolor sit amet</p>
            <p className="text-text-secondary">Secondary text - Lorem ipsum dolor sit amet</p>
            <p className="text-text-tertiary">Tertiary text - Lorem ipsum dolor sit amet</p>
            <p className="text-text-muted">Muted text - Lorem ipsum dolor sit amet</p>
          </div>
        </section>
      </div>
    </div>
  );
}
