"use client";

import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { FaCaretRight, FaBars, FaMapMarkerAlt, FaGift, FaBriefcase, FaCommentDots } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useRef, useEffect } from "react";
import SearchPopup from "@/components/layout/SearchPopup";
import PreHeader from "@/components/layout/PreHeader";

// Dummy Data for Categories
const DUMMY_CATEGORIES = [
  {
    id: 1,
    name: "Bedding",
    image: null, 
    sub: [
      {
        id: 11,
        name: "Bed Sheets",
        child: [
          { id: 111, name: "Cotton Bed Sheets" },
          { id: 112, name: "Satin Bed Sheets" },
          { id: 113, name: "Solid Color Bed Sheets" },
          { id: 114, name: "Printed Bed Sheets" },
        ],
      },
      {
        id: 12,
        name: "Pillows & Covers",
        child: [
          { id: 121, name: "Sleeping Pillows" },
          { id: 122, name: "Decorative Pillows" },
          { id: 123, name: "Pillow Covers" },
        ],
      },
      {
        id: 13,
        name: "Comforters & Quilts",
        child: [
            { id: 131, name: "Winter Comforters" },
            { id: 132, name: "AC Quilts" }
        ],
      },
      {
          id: 14,
          name: "Mosquito Nets",
          child: []
      }
    ],
  },
  {
    id: 2,
    name: "Bath",
    image: null,
    sub: [
      {
        id: 21,
        name: "Towels",
        child: [
          { id: 211, name: "Bath Towels" },
          { id: 212, name: "Hand Towels" },
          { id: 213, name: "Face Towels" },
        ],
      },
      {
        id: 22,
        name: "Bath Robes",
        child: [
            { id: 221, name: "Cotton Bath Robes" },
            { id: 222, name: "Waffle Bath Robes" }
        ],
      },
      {
        id: 23,
        name: "Bath Mats",
        child: [],
      },
    ],
  },
  {
    id: 3,
    name: "Living & Decor",
    image: null,
    sub: [
      {
        id: 31,
        name: "Curtains",
        child: [
            { id: 311, name: "Door Curtains" },
            { id: 312, name: "Window Curtains" },
            { id: 313, name: "Shower Curtains" }
        ],
      },
      {
        id: 32,
        name: "Carpets & Rugs",
        child: [],
      },
      {
        id: 33,
        name: "Cushions",
        child: [],
      },
    ],
  },
  {
    id: 4,
    name: "Kitchen & Dining",
    image: null,
    sub: [
      {
        id: 41,
        name: "Table Linen",
        child: [
            { id: 411, name: "Table Cloths" },
            { id: 412, name: "Table Runners" },
            { id: 413, name: "Placemats" }
        ],
      },
      {
        id: 42,
        name: "Aprons & Gloves",
        child: [],
      },
    ],
  },
  {
      id: 5,
      name: "Kids",
      image: null,
      sub: [
          {
              id: 51,
              name: "Kids Bedding",
              child: []
          },
          {
              id: 52,
              name: "Kids Bath",
              child: []
          }
      ]
  }
];

export const Header = () => {
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = getTotalItems();
  const wishlistCount = wishlistItems.length;

  // Dropdown States
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (!target.closest('.categories-dropdown-container')) {
              setShowAllCategories(false);
              setIsDropdownOpen(false);
          }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSearchClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <>
    {showPopup && <SearchPopup onClose={closePopup} />}
    <PreHeader />
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      {/* <div className="bg-primary text-primary-foreground py-2 text-center text-sm hidden sm:block">
        Free shipping on orders over BDT 3,000 | Call: +880 1234-567890
      </div> */}

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between relative">
          
           {/* Left Section: Categories & Search */}
           <div className="flex items-center gap-4 flex-1">
             {/* All Categories Dropdown (Desktop) */}
             <div 
              className="hidden md:block relative categories-dropdown-container z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Button 
                  variant="outline" 
                  className="flex items-center gap-2 bg-secondary/50 border-primary/20 hover:bg-secondary hover:text-primary"
                  onClick={toggleCategories}
              >
                  <img src="/images/icons/icon-menu.png" alt="Menu Icon" className="w-4 h-4" />
                  <span className="font-semibold">All Categories</span>
                  <FaCaretRight 
                      className={`h-3 w-3 transition-transform duration-200 ${showAllCategories || isDropdownOpen ? 'rotate-90' : ''}`} 
                  />
              </Button>

              {/* Main Dropdown Menu */}
              {(showAllCategories || isDropdownOpen) && (
                  <div 
                      className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2"
                  >
                      <ul className="flex flex-col">
                          {DUMMY_CATEGORIES.map((category) => {
                              const hasSub = category.sub && category.sub.length > 0;
                              return (
                                  <li key={category.id} className="group relative px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0">
                                      <Link href={`/categories/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="flex items-center justify-between w-full text-sm font-medium text-gray-700 group-hover:text-primary">
                                          <div className="flex items-center gap-3">
                                              {/* Placeholder for Icon/Image if needed */}
                                              {/* <div className="w-6 h-6 bg-gray-100 rounded-full"></div> */}
                                              <span>{category.name}</span>
                                          </div>
                                          {hasSub && <FaCaretRight className="h-3 w-3 text-gray-400 group-hover:text-primary" />}
                                      </Link>

                                      {/* Sub Menu */}
                                      {hasSub && (
                                          <div className="hidden group-hover:block absolute left-full top-0 ml-0 w-[600px] min-h-full bg-white border border-gray-200 rounded-r-lg shadow-xl p-6 z-50 -mt-2">
                                              <div className="grid grid-cols-2 gap-6">
                                                  {category.sub.map((sub) => (
                                                      <div key={sub.id} className="break-inside-avoid">
                                                          <Link href={`/categories/${category.name.toLowerCase().replace(/ /g, '-')}/${sub.name.toLowerCase().replace(/ /g, '-')}` as any}>
                                                              <h4 className="font-bold text-gray-900 mb-2 hover:text-primary cursor-pointer text-sm">{sub.name}</h4>
                                                          </Link>
                                                          {sub.child && sub.child.length > 0 && (
                                                              <ul className="space-y-1.5">
                                                                  {sub.child.map((child) => (
                                                                      <li key={child.id}>
                                                                          <Link 
                                                                              href={`/categories/${category.name.toLowerCase().replace(/ /g, '-')}/${sub.name.toLowerCase().replace(/ /g, '-')}/${child.name.toLowerCase().replace(/ /g, '-')}` as any}
                                                                              className="text-sm text-gray-500 hover:text-primary transition-colors block"
                                                                          >
                                                                              {child.name}
                                                                          </Link>
                                                                      </li>
                                                                  ))}
                                                              </ul>
                                                          )}
                                                      </div>
                                                  ))}
                                              </div>
                                              {/* Optional Promo Banner inside dropdown similar to reference */}
                                              <div className="mt-6 pt-4 border-t border-gray-100">
                                                  <div className="bg-primary/5 rounded-md p-3 text-center">
                                                      <p className="text-xs font-medium text-primary">
                                                          Special Offer: Get 10% off on {category.name} items!
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>
                                      )}
                                  </li>
                              );
                          })}
                      </ul>
                  </div>
              )}
            </div>
            
            <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-transparent p-0 hover:text-primary"
                onClick={handleSearchClick}
            >
               <Search className="h-5 w-5 text-yellow-600" />
               <span>Search</span>
            </Button>
           </div>


          {/* Center Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center">
              <img src="/images/hometex-logo.png" alt="Hometex" width={120} height={80} className="h-[65px] w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden as requested to match v2 layout more closely */}
          <nav className="hidden lg:hidden items-center space-x-6">
             {/* ... navigation items ... */}
          </nav>

          {/* Right Section: Actions */}
          <div className="flex items-center justify-end gap-4 flex-1">
            <Link href={"/stores" as any} className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary">
               <div className="text-yellow-600"><FaMapMarkerAlt className="h-5 w-5" /></div>
               <span>Find a Store</span>
            </Link>
            
             <Link href={"/gift-someone" as any} className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary">
               <div className="text-yellow-600"><FaGift className="h-5 w-5" /></div>
               <span>Gift Someone</span>
            </Link>

            <Link href={"/daily-deals" as any} className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-primary">
               <div className="text-yellow-600"><FaBriefcase className="h-5 w-5" /></div>
               <span>Daily Deals</span>
            </Link>
            
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 px-2 hover:bg-transparent hover:text-primary">
                <div className="text-yellow-600"><FaCommentDots className="h-5 w-5" /></div>
                <span>Message</span>
            </Button>

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
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5">
            <div className="flex flex-col space-y-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
               <Link href="/shop" className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors" onClick={() => setIsMenuOpen(false)}>
                Shop All
              </Link>
              
              {/* Mobile Categories */}
              <div className="px-4 py-2">
                <div className="font-semibold mb-2 text-primary">Categories</div>
                <div className="pl-4 space-y-2 border-l-2 border-secondary">
                    {DUMMY_CATEGORIES.map((cat) => (
                         <Link 
                            key={cat.id}
                            href={`/categories/${cat.name.toLowerCase().replace(/ /g, '-')}`}
                            className="block text-sm text-gray-600 hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                         >
                            {cat.name}
                         </Link>
                    ))}
                </div>
              </div>

              <Link
                href="/corporate"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Corporate
              </Link>
              <Link
                href="/account"
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                My Account
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
    </>
  );
};
