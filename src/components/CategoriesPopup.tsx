"use client";

import { productService } from "@/services/api";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CategoriesPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoriesPopup = ({ isOpen, onClose }: CategoriesPopupProps) => {
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string; slug: string; image: string | null }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await productService.getRootCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isOpen]);

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) {
      return "/placeholder.svg";
    }
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${process.env.NEXT_PUBLIC_IMAGE_URL || ""}${imagePath}`;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000]" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <p className="text-gray-500 text-sm mt-1">Discover our collection</p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600 font-light"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No categories found</p>
            </div>
          ) : (
            <>
              {/* Category Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {displayedCategories.map((category) => (
                  <a
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group text-center cursor-pointer"
                    onClick={onClose}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square mb-3">
                      <Image
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </p>
                  </a>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
