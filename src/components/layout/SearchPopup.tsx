"use client";

import GenericProductCard from "@/components/products/GenericProductCard";
import { ProductGridSkeleton } from "@/components/ui/ProductCardSkeleton";
import { useInfiniteProductSearchFlat } from "@/hooks/useInfiniteProductSearch";
import { productService } from "@/services/api/product.service";
import type { CategoryTree } from "@/types/api/product";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/SearchPopup.module.css";

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const router = useRouter();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch categories from API
  const { data: categoriesData } = useQuery({
    queryKey: ["categories", "tree"],
    queryFn: () => productService.getMenu(),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  const categories = categoriesData?.data || [];

  // Infinite scroll search hook - only enabled when searching
  const {
    products,
    totalCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteProductSearchFlat({
    searchTerm: debouncedSearch,
    category: selectedCategory || undefined,
    perPage: 20,
    enabled: debouncedSearch.length > 0,
  });

  // Calculate pagination for categories
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryClick = (category: CategoryTree) => {
    const popupElement = document.querySelector(`.${styles.popup}`);
    if (popupElement) {
      popupElement.classList.add(styles.slideUp);
    }

    setTimeout(() => {
      onClose();
      router.push(`/categories/${category.slug}` as never);
    }, 300);
  };

  // Don't close popup when interacting with products - only close on explicit close button or overlay click

  // Helper to get valid image URL
  const getImageUrl = (image: string | { url?: string } | undefined): string => {
    if (typeof image === "string") {
      return image;
    }
    if (image?.url) {
      return image.url;
    }
    return "/images/placeholder.jpg";
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
    return undefined;
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close when clicking the overlay background, not the content
    // Don't clear search state - preserve it for when user reopens
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleExplicitClose = () => {
    // Clear search state only when explicitly closing with X button
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedCategory("");
    onClose();
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.popup} onClick={handleOverlayClick}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={handleExplicitClose}>
          &times;
        </button>

        {/* Search Section */}
        <div className={styles.searchSection}>
          {/* Title */}
          <h1 className={styles.title}>What Are You Looking For?</h1>

          {/* Search Area */}
          <div className={styles.searchRow}>
            <select
              className={styles.categorySelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search for products..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={styles.searchButton} disabled={!searchTerm.trim()}>
              SEARCH
            </button>
          </div>

          {/* Trending Searches */}
          <div className={styles.trendingSearches}>
            <h3>TRENDING SEARCHES:</h3>
            <div className={styles.tags}>
              <span>Bed Sheet</span>
              <span>Pillow Cover</span>
              <span>Bed Cover</span>
              <span>Cushion</span>
            </div>
          </div>
        </div>

        {/* Products/Categories Section */}
        <div className={styles.productsSection}>
          {!debouncedSearch ? (
            // Show categories when not searching
            <>
              <h2 className={styles.popularTitle}>Browse Categories</h2>
              {categories.length === 0 ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p>Loading Categories...</p>
                </div>
              ) : (
                <>
                  <div className={styles.categoryGrid}>
                    {currentCategories.map((category) => (
                      <div
                        key={category.id}
                        className={styles.categoryCard}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className={styles.imageWrapper}>
                          {category.image && (
                            <Image
                              src={getImageUrl(category.image)}
                              alt={category.name}
                              width={100}
                              height={100}
                              className={styles.categoryImage}
                              unoptimized
                            />
                          )}
                        </div>
                        <p className={styles.categoryName}>{category.name}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`${styles.pageButton} ${
                            currentPage === page ? styles.activePage : ""
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            // Show products when searching with infinite scroll
            <>
              <h2 className={styles.popularTitle}>
                Search Results
                {totalCount > 0 && (
                  <span className={styles.resultCount}> ({totalCount} products)</span>
                )}
              </h2>

              {isLoading ? (
                <ProductGridSkeleton count={20} />
              ) : isError ? (
                <div className={styles.loadingContainer}>
                  <p className={styles.errorMessage}>
                    Error loading products: {error?.message || "Please try again"}
                  </p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                    {products.map((product) => (
                      <div key={product.id}>
                        <GenericProductCard
                          product={product}
                          showSaleLabel={true}
                          showTrendingIcon={true}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Infinite Scroll Trigger */}
                  {hasNextPage && (
                    <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
                      {isFetchingNextPage && (
                        <div className={styles.bottomLoader}>
                          <div className={styles.spinner}></div>
                          <p>Loading more products...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {!hasNextPage && products.length > 0 && (
                    <div className={styles.endMessage}>
                      <p>You&apos;ve reached the end of results</p>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.loadingContainer}>
                  <p>No products found for &quot;{debouncedSearch}&quot;</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
