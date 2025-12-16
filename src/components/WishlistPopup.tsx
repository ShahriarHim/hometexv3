"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { FaEye, FaTrashAlt } from "react-icons/fa";

interface WishlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistPopup: React.FC<WishlistPopupProps> = ({ isOpen, onClose }) => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const wishRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wishRef.current && !wishRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleViewWishlistClick = () => {
    router.push("/account/wishlist" as never);
    onClose();
  };

  const handleRemoveAll = () => {
    clearWishlist();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative z-[999999]">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900 opacity-50 transition-opacity duration-300 z-[999999]"
        onClick={onClose}
      />

      {/* Wishlist Panel */}
      <div
        ref={wishRef}
        className="fixed inset-y-0 right-0 w-96 max-w-full z-[999999] shadow-2xl bg-[rgba(51,51,51,0.95)] backdrop-blur-sm text-white overflow-hidden animate-slide-in transform transition-all duration-300 ease-out"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-600">
          <h2 className="text-xl font-semibold">Your Wishlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
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

        {/* Wishlist Items */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          <table className="w-full">
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr
                    key={item.product.id}
                    className="border-b border-gray-600 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="py-4 pl-4">
                      <img
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-400">
                          ৳{item.product.price.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <button
                        className="text-red-400 hover:text-red-600 transition-colors duration-200"
                        onClick={() => removeFromWishlist(item.product.id)}
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-600">
                  <td colSpan={3} className="text-center py-8 text-gray-400">
                    Your wishlist is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 bg-secondary/95">
          <div className="p-4 border-t border-gray-600">
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handleRemoveAll}
                disabled={items.length === 0}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTrashAlt className="text-white" />
                Remove All
              </button>
              <button
                onClick={handleViewWishlistClick}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
              >
                <FaEye className="text-white" />
                View Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }

        @media (max-width: 640px) {
          .fixed.right-0.w-96 {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default WishlistPopup;
