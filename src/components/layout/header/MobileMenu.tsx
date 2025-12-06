"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { TransformedCategory } from "./types";
import { createCategorySlug } from "./types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: TransformedCategory[];
  categoriesLoading: boolean;
  categoriesError: string | null;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  categories,
  categoriesLoading,
  categoriesError,
}: MobileMenuProps) => {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");

  if (!isOpen) return null;

  return (
    <nav className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5">
      <div className="flex flex-col space-y-1">
        <Link
          href="/"
          className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
          onClick={onClose}
        >
          {t("home")}
        </Link>
        <Link
          href="/shop"
          className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
          onClick={onClose}
        >
          {t("shop")}
        </Link>

        {/* Mobile Categories */}
        <div className="px-4 py-2">
          <div className="font-semibold mb-2 text-primary">{t("categories")}</div>
          {categoriesLoading ? (
            <div className="text-sm text-gray-500">{tCommon("loading")}</div>
          ) : categoriesError ? (
            <div className="text-sm text-red-500">{categoriesError}</div>
          ) : (
            <div className="pl-4 space-y-2 border-l-2 border-secondary">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${createCategorySlug(cat.name)}`}
                  className="block text-sm text-gray-600 hover:text-primary"
                  onClick={onClose}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/corporate"
          className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
          onClick={onClose}
        >
          {t("corporate")}
        </Link>
        <Link
          href="/account"
          className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
          onClick={onClose}
        >
          {tCommon("account")}
        </Link>
      </div>
    </nav>
  );
};
