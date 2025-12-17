import StaticPage from "@/views/StaticPage";
import type { Route } from "next";
import Link from "next/link";

const links: Array<{ label: string; href: Route | string }> = [
  { label: "Home", href: "/" as Route },
  { label: "Shop", href: "/products" as Route },
  { label: "Products", href: "/products" as Route },
  { label: "Corporate", href: "/corporate" as Route },
  { label: "Contact", href: "/contact" as Route },
  { label: "Gift Someone", href: "/gift-someone" as Route },
  { label: "FAQ", href: "/faq" as Route },
  { label: "Account", href: "/account" as Route },
  { label: "Cart", href: "/cart" as Route },
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
            <Link href={link.href as never} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </StaticPage>
  );
}
