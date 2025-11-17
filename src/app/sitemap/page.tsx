import Link from "next/link";
import type { Route } from "next";
import StaticPage from "@/views/StaticPage";

const links: Array<{ label: string; href: Route }> = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Products", href: "/products" },
  { label: "Corporate", href: "/corporate" },
  { label: "Contact", href: "/contact" },
  { label: "Gift Someone", href: "/gift-someone" },
  { label: "FAQ", href: "/faq" },
  { label: "Account", href: "/account" },
  { label: "Cart", href: "/cart" },
];

export default function SitemapPage() {
  return (
    <StaticPage
      title="Sitemap"
      description="Quick access to every public surface across the Hometex storefront."
    >
      <ul className="grid grid-cols-2 gap-3 text-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}

