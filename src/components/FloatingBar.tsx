"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentViews } from "@/hooks/use-recent-views";
import { ChevronLeft, ChevronRight, Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import {
  FaArrowUp,
  FaEye,
  FaHeart,
  FaListUl,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShoppingCart,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "sonner";
import CartPopup from "./CartPopup";
import ChatPopup from "./ChatPopup";
import WishlistPopup from "./WishlistPopup";
import { CategoriesPopup } from "./CategoriesPopup";

const FloatingBar = () => {
  const [showBar, setShowBar] = useState(false); // Visibility based on scroll
  const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishOpen, setIsWishOpen] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get cart and wishlist data from context
  const { getTotalItems, getTotalPrice, setIsCartPopupOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { recentViews, removeRecentView, clearRecentViews } = useRecentViews();

  // Track mount state to prevent hydration mismatch
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  const cartItemsCount = getTotalItems();
  const totalPrice = getTotalPrice();
  const [currentPage, setCurrentPage] = useState(1);
  const [locationPage, setLocationPage] = useState(1);
  const productsPerPage = 8;
  const locationsPerPage = 6;
  const totalPages = Math.ceil(recentViews.length / productsPerPage);

  // Store locations data
  const storeLocations = [
    {
      id: 1,
      name: "Shantinagar Outlet",
      address:
        "Store # 354-355, Level # 03, Twin Tower Concord Shopping Complex, 27 Chamelibag, Santinagar, Dhaka-1217",
      hours: "10:30 AM - 8:30 PM",
      phone: "+8809610963839",
      image: "/images/location/shantinagar.jpg",
    },
    {
      id: 2,
      name: "Gulshan Outlet",
      address: "Store # 464, Level# 04, Police Plaza Concord Shopping Mall, Gulshan-01, Dhaka-1212",
      hours: "11:00 AM - 9:00 PM",
      phone: "+8809610963839",
      image: "/images/location/gulshan.jpg",
    },
    {
      id: 3,
      name: "Elephant Road Outlet",
      address: "1st Floor, House # 307, S J Jahanara Imam Sharani, New Elephant Road, Dhaka-1205",
      hours: "11:00 AM - 9:00 PM",
      phone: "+8809610963839",
      image: "/images/location/elephenroad.jpg",
    },
  ];

  const totalLocationPages = Math.ceil(storeLocations.length / locationsPerPage);

  // Sync cart popup state with context to suppress toast notifications
  useEffect(() => {
    setIsCartPopupOpen(isCartOpen);
  }, [isCartOpen, setIsCartPopupOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (window.scrollY > 250) {
      setShowBar(true);
    } else {
      setShowBar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Placeholder handlers - dismiss toasts when opening popups
  const handleCartClick = () => {
    toast.dismiss();
    setIsCartOpen(!isCartOpen);
  };
  const handleWishClick = () => {
    toast.dismiss();
    setIsWishOpen(!isWishOpen);
  };
  const handleRecentlyViewedClick = () => {
    toast.dismiss();
    setShowRecentlyViewed(!showRecentlyViewed);
    setCurrentPage(1);
  };
  const handleGetCurrentLocation = () => {
    toast.dismiss();
    setShowLocationPanel(!showLocationPanel);
    setLocationPage(1);
  };
  const handleChatToggle = () => {
    toast.dismiss();
    setIsChatVisible(!isChatVisible);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleLocationPrevPage = () => {
    setLocationPage((prev: number) => Math.max(1, prev - 1));
  };

  const handleLocationNextPage = () => {
    setLocationPage((prev: number) => Math.min(totalLocationPages, prev + 1));
  };

  const getProductUrl = (product: (typeof recentViews)[0]) => {
    return `/products/${product.category}/${product.subcategory || "all"}/${product.id}`;
  };

  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Update every minute
    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((currentTime - timestamp) / 1000);
    if (seconds < 60) {
      return "Just now";
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = recentViews.slice(startIndex, startIndex + productsPerPage);

  const locationStartIndex = (locationPage - 1) * locationsPerPage;
  const visibleLocations = storeLocations.slice(
    locationStartIndex,
    locationStartIndex + locationsPerPage
  );

  const buttonData = [
    {
      icon: <FaListUl />,
      tooltip: "All Categories",
      onClick: () => {
        toast.dismiss();
        setShowCategoriesPopup(true);
      },
      className: "floating-btn-first",
      badge: null,
    },
    {
      icon: <FaPhoneAlt />,
      tooltip: "Customer Service",
      onClick: handleChatToggle,
      className: "floating-btn-middle",
      badge: null,
    },
    {
      icon: <FaMapMarkerAlt />,
      tooltip: "Store Location",
      onClick: handleGetCurrentLocation,
      className: "floating-btn-middle",
      badge: null,
    },
    {
      icon: <FaHeart />,
      tooltip: "Wishlist",
      onClick: handleWishClick,
      className: "floating-btn-middle",
      badge: mounted ? wishlistItems.length : null,
    },
    {
      icon: <FaEye />,
      tooltip: "Recently Viewed",
      onClick: handleRecentlyViewedClick,
      className: "floating-btn-middle",
      badge: mounted && recentViews.length > 0 ? recentViews.length : null,
    },
    {
      icon: <FaArrowUp />,
      tooltip: "Back to Top",
      onClick: () => {
        toast.dismiss();
        scrollToTop();
      },
      className: "floating-btn-last",
      badge: null,
    },
  ];

  return (
    <>
      <div className={`floating-bar ${showBar ? "visible" : ""}`}>
        {/* Add to Cart Button */}
        <div className="cart-container">
          <button className="floating-btn-cart green-btn" onClick={handleCartClick}>
            <FaShoppingCart style={{ fontSize: "20px" }} />
            <span className="cart-text">৳{totalPrice}</span>
            {mounted && cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </button>
        </div>

        {/* Grouped Buttons */}
        <div className="grouped-buttons">
          <div className="button-container">
            {buttonData.map((button, index) => (
              <button
                key={index}
                className={`floating-btn ${button.className}`}
                onClick={button.onClick}
              >
                {button.icon}
                <span className="tooltip">{button.tooltip}</span>
                {button.badge !== null && button.badge > 0 && (
                  <span className="icon-badge">{button.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* WhatsApp Button - Moved below grouped buttons */}
        <div className="whatsapp-container">
          <button
            className="floating-btn whatsapp-btn"
            onClick={() => window.open("https://wa.me/8801795256087", "_blank")}
          >
            <FaWhatsapp style={{ fontSize: "20px" }} />
            <span className="tooltip">Chat with us</span>
          </button>
        </div>
      </div>

      {/* Chat Popup */}
      {isChatVisible && <ChatPopup onClose={() => setIsChatVisible(false)} />}

      {/* Cart Popup */}
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Wishlist Popup */}
      <WishlistPopup isOpen={isWishOpen} onClose={() => setIsWishOpen(false)} />

      {/* Categories Popup */}
      <CategoriesPopup isOpen={showCategoriesPopup} onClose={() => setShowCategoriesPopup(false)} />

      {/* Recently Viewed Popup */}
      {showRecentlyViewed && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[1100] location-modal-overlay"
          onClick={() => setShowRecentlyViewed(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-6xl w-full mx-4 relative z-10 shadow-2xl transform transition-all animate-popup-in border border-gray-200 recently-viewed-popup flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary text-black p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-black/20 p-2 rounded-lg">
                  <FaEye className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Recently Viewed Products</h3>
                  <p className="text-black/80 text-sm mt-1">
                    {recentViews.length} {recentViews.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {recentViews.length > 0 && (
                  <button
                    onClick={clearRecentViews}
                    className="text-black hover:bg-black/20 p-2 rounded-lg transition-colors flex items-center gap-2"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowRecentlyViewed(false)}
                  className="text-black hover:bg-black/20 p-2 rounded-lg transition-colors text-2xl leading-none"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {recentViews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <FaEye className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recent Views</h3>
                  <p className="text-gray-600 max-w-md">
                    Products you view will appear here. Start browsing to see your recent views!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <Link
                        href={getProductUrl(product) as never}
                        onClick={() => setShowRecentlyViewed(false)}
                        className="flex flex-col h-full"
                      >
                        <div className="relative w-full h-48 flex-shrink-0 bg-gray-50 overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <FaEye className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between p-4">
                          <div>
                            <h3 className="font-semibold text-black line-clamp-2 group-hover:text-primary transition-colors mb-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(product.viewedAt)}</span>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">
                                ৳{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ৳{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeRecentView(product.id);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove from recent views"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {recentViews.length > productsPerPage && (
              <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50 rounded-b-2xl">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Location Panel */}
      {showLocationPanel && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[1100] location-modal-overlay"
          onClick={() => setShowLocationPanel(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-6xl w-full mx-4 relative z-10 shadow-2xl transform transition-all animate-popup-in border border-gray-200 location-popup flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary text-black p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-black/20 p-2 rounded-lg">
                  <FaMapMarkerAlt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Store Locations</h3>
                  <p className="text-black/80 text-sm mt-1">
                    {storeLocations.length} {storeLocations.length === 1 ? "location" : "locations"}{" "}
                    available
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationPanel(false)}
                className="text-black hover:bg-black/20 p-2 rounded-lg transition-colors text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {storeLocations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <FaMapMarkerAlt className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Locations Available
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    Store locations will appear here when available.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleLocations.map((location: (typeof storeLocations)[0]) => (
                    <div
                      key={location.id}
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="flex flex-col h-full">
                        <div className="relative w-full h-48 flex-shrink-0 bg-gray-50 overflow-hidden">
                          {location.image ? (
                            <Image
                              src={location.image}
                              alt={location.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <FaMapMarkerAlt className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between p-4">
                          <div>
                            <h3 className="font-semibold text-black line-clamp-2 group-hover:text-primary transition-colors mb-2">
                              {location.name}
                            </h3>
                            <p className="text-sm text-black/70 line-clamp-2 mb-2">
                              {location.address}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-black/60 mb-1">
                              <Clock className="w-3 h-3" />
                              <span>{location.hours}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-black/60">
                              <FaPhoneAlt className="w-3 h-3" />
                              <a
                                href={`tel:${location.phone}`}
                                className="hover:text-primary transition-colors"
                              >
                                {location.phone}
                              </a>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`,
                                  "_blank"
                                );
                              }}
                              className="w-full text-sm px-4 py-2 bg-primary hover:bg-primary-hover text-black rounded-lg transition-colors font-medium"
                            >
                              Get Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {storeLocations.length > locationsPerPage && (
              <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50 rounded-b-2xl">
                <button
                  onClick={handleLocationPrevPage}
                  disabled={locationPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {locationPage} of {totalLocationPages}
                </span>
                <button
                  onClick={handleLocationNextPage}
                  disabled={locationPage === totalLocationPages}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .floating-bar {
          position: fixed;
          right: 5px;
          top: 55%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition:
            opacity 0.5s,
            transform 0.5s ease-out;
        }

        .floating-bar.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }

        .cart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .whatsapp-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .button-container {
          background: rgba(51, 51, 51, 0.8);
          border-radius: 40px;
          padding: 3px;
          gap: 3px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .floating-btn-cart {
          width: 45px;
          height: 45px;
          background: rgba(51, 51, 51, 0.8);
          color: yellow;
          border: none;
          border-radius: 10%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          text-align: center;
          padding: 5px;
        }

        .cart-text {
          margin-top: 2px;
          font-size: 10px;
          color: white;
          font-weight: 500;
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: hsl(var(--error));
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid rgba(51, 51, 51, 0.8);
        }

        .icon-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          background-color: hsl(var(--error));
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          font-weight: bold;
          border: 2px solid rgba(51, 51, 51, 0.8);
          z-index: 1;
        }

        .floating-btn {
          width: 40px;
          height: 40px;
          background: transparent;
          color: white;
          border: none;
          padding: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .floating-btn:hover {
          background: rgba(40, 167, 69, 0.8);
          border-radius: 50%;
          color: white;
        }

        .tooltip {
          position: absolute;
          top: 50%;
          right: calc(100% + 12px);
          transform: translateY(-50%);
          background: rgba(51, 51, 51, 0.95);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          white-space: nowrap;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          z-index: 1001;
        }

        .tooltip::after {
          content: "";
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-left-color: rgba(51, 51, 51, 0.95);
        }

        .floating-btn:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }

        .categories-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1100;
        }

        .categories-popup {
          background: white;
          border-radius: 24px;
          width: 85%;
          max-width: 900px;
          height: 70vh;
          position: relative;
          animation: scaleIn 0.3s ease-out;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .popup-header {
          background: linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary-hover)));
          padding: 1.5rem;
          color: hsl(var(--primary-foreground));
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .popup-header::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.1) 40%,
            transparent 50%
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .popup-header h2 {
          font-size: 1.5rem;
          margin: 0;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .popup-header p {
          margin: 0.5rem 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .popup-content {
          display: flex;
          height: calc(70vh - 90px);
          background: hsl(var(--background));
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: transparent;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
          border-color: white;
        }

        .whatsapp-btn {
          background-color: hsl(var(--success));
          color: hsl(var(--success-foreground));
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          position: relative;
        }

        .whatsapp-btn:hover {
          background-color: hsl(var(--accent-hover));
        }

        /* Recently Viewed Styles */
        .recently-viewed-popup {
          box-shadow:
            0 8px 40px rgba(40, 167, 69, 0.1),
            0 1.5px 8px rgba(0, 0, 0, 0.04);
          border: 1.5px solid hsl(var(--border));
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.4, 2, 0.6, 1);
        }
        @keyframes popup-in {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(30px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-popup-in {
          animation: popup-in 0.45s cubic-bezier(0.4, 2, 0.6, 1);
        }

        /* Location Popup Styles */
        .location-popup {
          box-shadow:
            0 8px 40px rgba(40, 167, 69, 0.1),
            0 1.5px 8px rgba(0, 0, 0, 0.04);
          border: 1.5px solid hsl(var(--border));
        }

        @media (max-width: 768px) {
          .floating-bar {
            right: 2px;
            gap: 8px;
          }
          .floating-btn {
            width: 35px;
            height: 35px;
          }
          .floating-btn-cart {
            width: 40px;
            height: 40px;
          }
          .whatsapp-btn {
            width: 40px;
            height: 40px;
          }
          .cart-text {
            font-size: 9px;
          }
          .cart-badge {
            width: 15px;
            height: 15px;
            font-size: 9px;
            top: -2px;
            right: -2px;
          }
          .icon-badge {
            width: 14px;
            height: 14px;
            font-size: 8px;
            top: -2px;
            right: -2px;
          }
          /* Hide tooltips on mobile as they rely on hover */
          .tooltip {
            display: none !important;
          }
          .location-popup {
            max-height: 85vh;
          }
          .categories-popup {
            width: 95%;
            height: 80vh;
          }
          .recently-viewed-popup {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingBar;
