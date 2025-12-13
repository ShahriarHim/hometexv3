"use client";

import { Check, Copy, Download, Palette, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

interface ColorVariable {
  name: string;
  variable: string;
  value: string;
  description: string;
  category: string;
}

export default function ThemeEditor() {
  const [colors, setColors] = useState<ColorVariable[]>([
    // Primary Colors
    {
      name: "Primary",
      variable: "--primary",
      value: "#AF6F09",
      description: "Main brand color",
      category: "Primary",
    },
    {
      name: "Primary Hover",
      variable: "--primary-hover",
      value: "#8A5807",
      description: "Hover state",
      category: "Primary",
    },
    {
      name: "Primary Active",
      variable: "--primary-active",
      value: "#6B4405",
      description: "Active state",
      category: "Primary",
    },
    {
      name: "Primary Light",
      variable: "--primary-light",
      value: "#F5EBE0",
      description: "Light tint",
      category: "Primary",
    },

    // Secondary Colors
    {
      name: "Secondary",
      variable: "--secondary",
      value: "#1C2E45",
      description: "Professional anchor",
      category: "Secondary",
    },
    {
      name: "Secondary Hover",
      variable: "--secondary-hover",
      value: "#15233A",
      description: "Hover state",
      category: "Secondary",
    },
    {
      name: "Secondary Light",
      variable: "--secondary-light",
      value: "#E8ECF3",
      description: "Light tint",
      category: "Secondary",
    },

    // Accent Colors
    {
      name: "Accent",
      variable: "--accent",
      value: "#24A868",
      description: "Success/CTAs",
      category: "Accent",
    },
    {
      name: "Accent Hover",
      variable: "--accent-hover",
      value: "#1D8A56",
      description: "Hover state",
      category: "Accent",
    },
    {
      name: "Accent Light",
      variable: "--accent-light",
      value: "#E6F7EF",
      description: "Light tint",
      category: "Accent",
    },
    {
      name: "Accent Secondary",
      variable: "--accent-secondary",
      value: "#FA6B3D",
      description: "Highlights/urgency",
      category: "Accent",
    },
    {
      name: "Accent Secondary Hover",
      variable: "--accent-secondary-hover",
      value: "#E8542A",
      description: "Hover state",
      category: "Accent",
    },

    // Semantic Colors
    {
      name: "Success",
      variable: "--success",
      value: "#24A868",
      description: "Success messages",
      category: "Semantic",
    },
    {
      name: "Warning",
      variable: "--warning",
      value: "#FB9F3C",
      description: "Warnings",
      category: "Semantic",
    },
    {
      name: "Error",
      variable: "--error",
      value: "#DC3545",
      description: "Errors",
      category: "Semantic",
    },
    {
      name: "Info",
      variable: "--info",
      value: "#0D6EFD",
      description: "Information",
      category: "Semantic",
    },

    // E-commerce
    {
      name: "Price",
      variable: "--price",
      value: "#24A868",
      description: "Price display",
      category: "E-commerce",
    },
    {
      name: "Discount",
      variable: "--discount",
      value: "#DC3545",
      description: "Discount badge",
      category: "E-commerce",
    },
    {
      name: "Stock High",
      variable: "--stock-high",
      value: "#24A868",
      description: "In stock",
      category: "E-commerce",
    },
    {
      name: "Stock Low",
      variable: "--stock-low",
      value: "#FB9F3C",
      description: "Low stock",
      category: "E-commerce",
    },
  ]);

  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(colors.map((c) => c.category)))];

  // Apply colors to CSS variables in real-time
  useEffect(() => {
    colors.forEach((color) => {
      const hsl = hexToHSL(color.value);
      document.documentElement.style.setProperty(color.variable, hsl);
    });
  }, [colors]);

  // Convert HEX to HSL
  function hexToHSL(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      return "0 0% 50%";
    }

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
  }

  // Update color
  const updateColor = (variable: string, newValue: string) => {
    setColors(
      colors.map((color) => (color.variable === variable ? { ...color, value: newValue } : color))
    );
  };

  // Generate CSS code
  const generateCSS = () => {
    let css = ":root {\n";
    colors.forEach((color) => {
      const hsl = hexToHSL(color.value);
      css += `  ${color.variable}: ${hsl}; /* ${color.value} - ${color.description} */\n`;
    });
    css += "}";
    return css;
  };

  // Copy to clipboard
  const copyCSS = async () => {
    await navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download CSS file
  const downloadCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theme-colors.css";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Reset to defaults
  const resetColors = () => {
    if (confirm("Reset all colors to default values?")) {
      window.location.reload();
    }
  };

  const filteredColors =
    activeCategory === "All" ? colors : colors.filter((c) => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Theme Editor</h1>
                <p className="text-gray-600">Customize your site colors instantly</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetColors}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={downloadCSS}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={copyCSS}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy CSS"}
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredColors.map((color) => (
            <div
              key={color.variable}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Color Preview */}
              <div className="h-32 relative group" style={{ backgroundColor: color.value }}>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-mono">
                      {color.value}
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900">{color.name}</h3>
                  <p className="text-sm text-gray-500">{color.description}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{color.variable}</p>
                </div>

                {/* Color Input */}
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={color.value}
                    onChange={(e) => updateColor(color.variable, e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={color.value}
                    onChange={(e) => updateColor(color.variable, e.target.value)}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg font-mono text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                {/* HSL Preview */}
                <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
                  HSL: {hexToHSL(color.value)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Live Preview</h2>

          {/* Buttons Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Buttons</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-accent">Accent Button</button>
              <button className="btn-outline">Outline Button</button>
            </div>
          </div>

          {/* Badges Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Badges</h3>
            <div className="flex flex-wrap gap-3">
              <span className="badge-primary">Primary</span>
              <span className="badge-success">Success</span>
              <span className="badge-warning">Warning</span>
              <span className="badge-error">Error</span>
            </div>
          </div>

          {/* Cards Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card-elevated p-6">
                <h4 className="font-bold mb-2">Elevated Card</h4>
                <p className="text-text-secondary">Card with shadow effect</p>
              </div>
              <div className="card-flat p-6">
                <h4 className="font-bold mb-2">Flat Card</h4>
                <p className="text-text-secondary">Card with border</p>
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">E-commerce Elements</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="price-text">৳1,299</span>
              <span className="price-old">৳1,599</span>
              <span className="discount-badge">-25%</span>
              <span className="text-stock-high font-semibold">In Stock</span>
              <span className="text-stock-low font-semibold">Low Stock</span>
            </div>
          </div>
        </div>

        {/* CSS Code Display */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Generated CSS</h2>
            <button
              onClick={copyCSS}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="text-green-400 text-sm overflow-x-auto font-mono">{generateCSS()}</pre>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 How to Use</h3>
          <ol className="text-blue-800 space-y-2 text-sm">
            <li>
              <strong>1.</strong> Click on any color swatch or use the color picker to change colors
            </li>
            <li>
              <strong>2.</strong> Type hex codes directly (e.g., #AF6F09) or use the picker
            </li>
            <li>
              <strong>3.</strong> See live preview of your changes instantly
            </li>
            <li>
              <strong>4.</strong> Copy the generated CSS or download it
            </li>
            <li>
              <strong>5.</strong> Paste into your{" "}
              <code className="bg-blue-100 px-1 rounded">globals.css</code> file
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
