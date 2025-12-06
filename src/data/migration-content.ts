import type { LucideIcon } from "lucide-react";
import { Compass, Globe2, Leaf, Sparkles, Star, Sunrise, Crown, Diamond } from "lucide-react";

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  cta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  stats: {
    label: string;
    value: string;
  };
  accentPalette: {
    left: string[];
    right: string[];
  };
};

export const heroSlides: HeroSlide[] = [
  {
    id: "linen-lab",
    eyebrow: "Signature Drop",
    title: "Tailored Textiles For Every Sanctuary",
    description:
      "Layer modern Bangladeshi artistry with buttery-soft European linens. We pair bold geometry with calm neutrals so every room feels curated, collected, and comfortably yours.",
    image: "/images/mslider/Slider-1920x601.webp",
    cta: {
      label: "Shop the Capsule",
      href: "/shop",
    },
    secondaryCta: {
      label: "View Lookbook",
      href: "/categories/bedding",
    },
    stats: {
      label: "Artisan edits",
      value: "32",
    },
    accentPalette: {
      left: ["#d7f068", "#f3fcd1", "#fefef6"],
      right: ["#c5cee8", "#e5e9f7", "#f9f9ff"],
    },
  },
  {
    id: "hotel-suite",
    eyebrow: "Hotel Suite Essentials",
    title: "Boutique-Level Bedding Without The Markup",
    description:
      "Cloud-like duvets, architectural throws, and tactile contrast piping reinvent every master suite. Engineered stitching resists wear and stays crisp after 200+ washes.",
    image: "/images/mslider/Curtains-1920x601.webp",
    cta: {
      label: "Design My Bed",
      href: "/categories/bedding",
    },
    secondaryCta: {
      label: "Order Swatches",
      href: "/contact",
    },
    stats: {
      label: "Thread count",
      value: "1,000",
    },
    accentPalette: {
      left: ["#b9f2ff", "#dff8ff", "#f5feff"],
      right: ["#f5f8ff", "#eaf0ff", "#dde4ff"],
    },
  },
  {
    id: "wellness",
    eyebrow: "Day-to-Night Living",
    title: "Breathable Wellness Textiles That Reset Spaces",
    description:
      "From spa-grade towels to cooling eucalyptus loungewear, our newest drop brings elevated comfort to daily rituals with mindful palettes inspired by Dhaka’s skyline.",
    image: "/images/mslider/Bath Support-1920x601.webp",
    cta: {
      label: "Explore Collections",
      href: "/categories/bath",
    },
    secondaryCta: {
      label: "Talk to a Stylist",
      href: "/contact",
    },
    stats: {
      label: "Wellness must-haves",
      value: "18",
    },
    accentPalette: {
      left: ["#b4f0da", "#d5f8ec", "#f2fffb"],
      right: ["#fefae0", "#fff2c7", "#ffe9a3"],
    },
  },
];

export type InfoHighlight = {
  id: string;
  title: string;
  description: string;
  icon: string; // Image path
};

export const infoHighlights: InfoHighlight[] = [
  {
    id: "search",
    title: "Your Search Ends Here!",
    description:
      "We believe in innovation, simplification, modernization, implementing something extraordinary that wasn't adopted before ...",
    icon: "/images/icons/i1.png",
  },
  {
    id: "experience",
    title: "Experience with us!",
    description:
      "We'll never let you down\"-providing the most compelling shopping experience possible.",
    icon: "/images/icons/i2.png",
  },
  {
    id: "global",
    title: "Happiness; It's Global!",
    description:
      "We spread happiness throughout the world from Hometex Bangladesh. Get to know more from our Shipping & Delivery Page.",
    icon: "/images/icons/i3.png",
  },
];

export type CollectionSpotlight = {
  id: string;
  name: string;
  image: string;
  accent: string;
};

export const collectionSpotlight: CollectionSpotlight[] = [
  {
    id: "summer-quilts",
    name: "Summer Quilts",
    image: "/images/designSix/Summer_Quilt_Banner.png",
    accent: "#72d2c7",
  },
  {
    id: "bathrobes",
    name: "Spa Robes",
    image: "/images/designSix/bathrobes.png",
    accent: "#e481e1",
  },
  {
    id: "handmade-rugs",
    name: "Handmade Rugs",
    image: "/images/designSix/Handmade_Rugs.png",
    accent: "#7ed957",
  },
  {
    id: "linen-pillows",
    name: "Linen Pillows",
    image: "/images/designSix/feather_pillow.png",
    accent: "#ffd700",
  },
  {
    id: "organic-throws",
    name: "Organic Throws",
    image: "/images/designSix/Summer_Quilt_Banner.png",
    accent: "#68c8d1",
  },
];

export type BrandSpot = {
  id: string;
  logo: string;
  name: string;
  tagline: string;
};

export const brandSpotlight: BrandSpot[] = [
  {
    id: "sealy",
    logo: "/images/prefooter/vivo-350x150.webp",
    name: "Vivo",
    tagline: "Signature Suites",
  },
  {
    id: "linen-house",
    logo: "/images/prefooter/ziska_pharma-350x150.png",
    name: "Ziska Pharma",
    tagline: "Spa Retreats",
  },
  {
    id: "muji",
    logo: "/images/prefooter/Perfetti_Van_Melle_logo-350x150.webp",
    name: "Perfetti Van Melle",
    tagline: "Corporate Suites",
  },
  {
    id: "ikea",
    logo: "/images/prefooter/PWD_hometex-350x150.webp",
    name: "PWD Bangladesh",
    tagline: "Government Supply",
  },
  {
    id: "artisan",
    logo: "/images/prefooter/hometexbrand1-350x150.webp",
    name: "Hometex Studios",
    tagline: "Editors' Picks",
  },
];

export type PromoTile = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  accent: {
    background: string;
    badge: string;
  };
};

export const promoTiles: PromoTile[] = [
  {
    id: "linen-edit",
    title: "Layered Linen Edit",
    subtitle: "Save up to 40%",
    badge: "Limited Time",
    image: "/images/22L.png",
    accent: {
      background: "linear-gradient(135deg,#87f1ff,#e2f9ff)",
      badge: "#e8fe00",
    },
  },
  {
    id: "season-sale",
    title: "End Of Season Sale",
    subtitle: "Members get extra 10%",
    badge: "Use code: SEASON10",
    image: "/images/hero-bath.jpg",
    accent: {
      background: "linear-gradient(135deg,#f53c78,#ff8fb1)",
      badge: "#ffffff",
    },
  },
  {
    id: "sun-shield",
    title: "Sunset Shades",
    subtitle: "Buy 1, gift 1 free",
    badge: "New Arrivals",
    image: "/images/11L.png",
    accent: {
      background: "linear-gradient(135deg,#fff7ae,#ffe4a1)",
      badge: "#111111",
    },
  },
];

export type CategorySpotlightTile = {
  id: string;
  name: string;
  image: string;
};

export const categorySpotlightTiles: CategorySpotlightTile[] = [
  {
    id: "home-textiles",
    name: "Home Textiles",
    image: "/images/catagories/Bed.jpg",
  },
  {
    id: "cozy-cushions",
    name: "Cozy Cushions",
    image: "/images/catagories/Living D.jpg",
  },
  {
    id: "warm-blankets",
    name: "Warm Blankets",
    image: "/images/catagories/Curtainssss.jpg",
  },
];

export type DealHighlight = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
};

export const dealHighlights: DealHighlight[] = [
  {
    id: "audio",
    title: "Awesome Quality",
    subtitle: "High-Fidelity Sound",
    image: "/images/BATH SUPPORT/Newbath.png",
    gradient: "from-purple-600 to-blue-500",
  },
  {
    id: "smart-sheet",
    title: "Smart Bedsheet",
    subtitle: "Track your recovery",
    image: "/images/hhh/Hotelfab.jpg",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "summer-outfit",
    title: "Summer Outfit",
    subtitle: "Trendy & light",
    image: "/images/BATH SUPPORT/Healing Power-270x520.webp",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export const newsletterContent = {
  title: "Join Our Newsletter",
  description: "Get styling advice, VIP previews, and exclusive drop alerts.",
  placeholder: "Enter your email address",
  cta: "Subscribe",
};

export const blogHighlight = {
  image: "/images/blog/b1.jpg",
  title: "Daily Outfits: How We Layer Soft Geometry",
  excerpt:
    "Subscribers asked for breakdowns of our go-to everyday textiles, so we rounded up three tonal looks with bonus styling tricks straight from the Dhaka studio.",
  category: "Daily Outfits",
  author: "Edna Barton",
  commentsLabel: "Comments",
  ctaLabel: "Read Full Story",
  href: "/blog/daily-outfits",
};

export const storeSummary = {
  title: "About Our Atelier",
  summary:
    "We are more than another online retailer. Hometex curates premium textiles with concierge service, modern logistics, and warm human support across every touchpoint.",
  socials: [
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/hometex.ltd" },
    { id: "twitter", label: "Twitter", href: "https://twitter.com/HometexBD" },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/hometex_bangladesh",
    },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com" },
    { id: "pinterest", label: "Pinterest", href: "https://www.pinterest.com" },
  ],
};

export const floatingFacts = [
  {
    id: "shipping",
    label: "Global shipping",
    value: "40+ destinations",
    icon: Globe2,
  },
  {
    id: "quality",
    label: "Quality checks",
    value: "12-stage lab test",
    icon: Star,
  },
  {
    id: "craft",
    label: "Craft partners",
    value: "90+ artisan teams",
    icon: Leaf,
  },
  {
    id: "designers",
    label: "In-house stylists",
    value: "6 textile designers",
    icon: Crown,
  },
  {
    id: "turnaround",
    label: "Turnaround",
    value: "48h sample dispatch",
    icon: Sunrise,
  },
  {
    id: "awards",
    label: "Awards",
    value: "2024 Design Asia",
    icon: Diamond,
  },
];
