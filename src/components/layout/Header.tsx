import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

export const Header = () => {
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm">
        Free shipping on orders over BDT 3,000 | Call: +880 1234-567890
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-primary">Hometex</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors">
              Shop All
            </Link>
            <Link to="/categories/bedding" className="text-foreground hover:text-primary transition-colors">
              Bedding
            </Link>
            <Link to="/categories/bath" className="text-foreground hover:text-primary transition-colors">
              Bath
            </Link>
            <Link to="/categories/kitchen-dining" className="text-foreground hover:text-primary transition-colors">
              Kitchen
            </Link>
            <Link to="/categories/living-decor" className="text-foreground hover:text-primary transition-colors">
              Living
            </Link>
            <Link to="/corporate" className="text-foreground hover:text-primary transition-colors">
              Corporate
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/account/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link to="/account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Shop All
              </Link>
              <Link to="/categories/bedding" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Bedding
              </Link>
              <Link to="/categories/bath" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Bath
              </Link>
              <Link to="/categories/kitchen-dining" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Kitchen & Dining
              </Link>
              <Link to="/categories/living-decor" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Living Décor
              </Link>
              <Link to="/corporate" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Corporate
              </Link>
              <Link to="/account" className="text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                My Account
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
