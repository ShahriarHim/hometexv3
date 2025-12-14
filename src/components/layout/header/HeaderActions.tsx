"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Link } from "@/i18n/routing";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { FaBriefcase, FaCommentDots, FaGift, FaMapMarkerAlt } from "react-icons/fa";

interface HeaderActionsProps {
  onSearchClick: () => void;
  onChatToggle?: () => void;
  _isChatOpen?: boolean;
}

const HeaderActions = ({ onSearchClick, onChatToggle, _isChatOpen }: HeaderActionsProps) => {
  const t = useTranslations("navigation");
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const _cartCount = getTotalItems();
  const _wishlistCount = wishlistItems.length;

  const handleChatToggle = () => {
    onChatToggle?.();
  };

  return (
    <div className="flex items-center justify-end gap-4">
      {/* Mobile Search */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onSearchClick}>
        <Search className="h-5 w-5" />
      </Button>

      <Link
        href="/stores"
        className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-primary"
      >
        <div className="text-yellow-600">
          <FaMapMarkerAlt className="h-5 w-5" />
        </div>
        <span>{t("findStore")}</span>
      </Link>

      <Link
        href="/gift-someone"
        className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-primary"
      >
        <div className="text-yellow-600">
          <FaGift className="h-5 w-5" />
        </div>
        <span>{t("giftSomeone")}</span>
      </Link>

      <Link
        href="/daily-deals"
        className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-primary"
      >
        <div className="text-yellow-600">
          <FaBriefcase className="h-5 w-5" />
        </div>
        <span>{t("dailyDeals")}</span>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        className="hidden lg:flex items-center gap-2 px-2 hover:bg-transparent hover:text-primary"
        onClick={handleChatToggle}
      >
        <div className="text-yellow-600">
          <FaCommentDots className="h-5 w-5" />
        </div>
        <span>{t("message")}</span>
      </Button>

      {/* Account, Wishlist, Cart Icons */}
      {/* <Link
        href="/account"
        className="hidden md:flex items-center justify-center p-2 hover:text-primary transition-colors"
      >
        <User className="h-5 w-5" />
      </Link>

      <Link
        href="/account?tab=wishlist"
        className="hidden md:flex items-center justify-center p-2 hover:text-primary transition-colors relative"
      >
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link
        href="/cart"
        className="flex items-center justify-center p-2 hover:text-primary transition-colors relative"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link> */}
    </div>
  );
};

export { HeaderActions };
