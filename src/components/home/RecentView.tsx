"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, X, ChevronLeft, ChevronRight, Trash2, Clock } from "lucide-react";
import { useRecentViews } from "@/hooks/use-recent-views";
import { Button } from "@/components/ui/button";

interface RecentViewProps {
  className?: string;
}

export const RecentView: React.FC<RecentViewProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const { recentViews, removeRecentView, clearRecentViews } = useRecentViews();

  const productsPerPage = 4;
  const totalPages = Math.ceil(recentViews.length / productsPerPage);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEscape);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
      return () => {
        window.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const startIndex = (currentPage - 1) * productsPerPage;
  const visibleProducts = recentViews.slice(startIndex, startIndex + productsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const getProductUrl = (product: (typeof recentViews)[0]) => {
    return `/products/${product.category}/${product.subcategory || "all"}/${product.id}` as any;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-l-lg shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2 group ${className}`}
        aria-label="View recent products"
      >
        <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
        {recentViews.length > 0 && (
          <span className="bg-white text-teal-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {recentViews.length > 9 ? "9+" : recentViews.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Recently Viewed Products</h2>
                  <p className="text-teal-100 text-sm mt-1">
                    {recentViews.length} {recentViews.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {recentViews.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentViews}
                    className="text-white hover:bg-white/20"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {recentViews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <Eye className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recent Views</h3>
                  <p className="text-gray-600 max-w-md">
                    Products you view will appear here. Start browsing to see your recent views!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <Link
                        href={getProductUrl(product)}
                        onClick={() => setIsOpen(false)}
                        className="flex gap-4 p-4"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-contain group-hover:scale-105 transition-transform duration-300"
                              sizes="96px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Eye className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(product.viewedAt)}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-teal-600">
                                ৳{product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ৳{product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeRecentView(product.id);
                              }}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove from recent views"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {recentViews.length > productsPerPage && (
              <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RecentView;
