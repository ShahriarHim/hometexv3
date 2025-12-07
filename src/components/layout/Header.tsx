"use client";

import PreHeader from "@/components/layout/PreHeader";
import SearchPopup from "@/components/layout/SearchPopup";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/api";
import { Menu, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CategoriesMenuBar } from "./header/CategoriesMenuBar";
import { CategoriesMenuBarSkeleton } from "./header/CategoriesMenuBarSkeleton";
import { HeaderActions } from "./header/HeaderActions";
import { HeaderLogo } from "./header/HeaderLogo";
import { MobileMenu } from "./header/MobileMenu";
import { ShowCategoriesButton } from "./header/ShowCategoriesButton";
import {
  getFeaturedCategories,
  transformCategories,
  type TransformedCategory,
} from "./header/types";

export const Header = () => {
  const tCommon = useTranslations("common");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCategoriesBar, setShowCategoriesBar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Categories State
  const [categories, setCategories] = useState<TransformedCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await productService.getMenu();
        if (response.success) {
          const transformedCategories = transformCategories(response.data);
          setCategories(transformedCategories);
        } else {
          setCategoriesError("Failed to load categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategoriesError("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close categories bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        showCategoriesBar &&
        !target.closest(".categories-menu-bar") &&
        !target.closest(".show-categories-button")
      ) {
        setShowCategoriesBar(false);
      }
    };

    if (showCategoriesBar) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
    return undefined;
  }, [showCategoriesBar]);

  const handleSearchClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const featuredCategories = getFeaturedCategories(categories);

  return (
    <>
      {showPopup && <SearchPopup onClose={closePopup} />}
      <PreHeader />
      <header
        className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        suppressHydrationWarning
      >
        {/* Main Header */}
        <div className="container mx-auto px-4" suppressHydrationWarning>
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Logo + Show Categories Button + Search */}
            <div className="flex items-center gap-4">
              <HeaderLogo />

              <div className="hidden md:flex items-center gap-2">
                <ShowCategoriesButton
                  isOpen={showCategoriesBar}
                  onClick={() => setShowCategoriesBar(!showCategoriesBar)}
                />

                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-transparent p-0 hover:text-primary"
                  onClick={handleSearchClick}
                >
                  <Search className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium">{tCommon("search")}</span>
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {/* Right Section: Actions */}
            <HeaderActions onSearchClick={handleSearchClick} />
          </div>

          {/* Categories Menu Bar (Animated) */}
          {showCategoriesBar && (
            <>
              {categoriesLoading ? (
                <CategoriesMenuBarSkeleton />
              ) : (
                <CategoriesMenuBar
                  categories={categories}
                  featuredCategories={featuredCategories}
                />
              )}
            </>
          )}

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            categories={categories}
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
          />
        </div>
      </header>
    </>
  );
};
