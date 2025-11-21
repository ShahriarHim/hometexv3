"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../styles/SearchPopup.module.css";

// Dummy Data for Categories if API fails or for static version
const DUMMY_CATEGORIES = [
  { id: 1, name: "Bedding", image: "https://placehold.co/100x100?text=Bedding" },
  { id: 2, name: "Bath", image: "https://placehold.co/100x100?text=Bath" },
  { id: 3, name: "Living", image: "https://placehold.co/100x100?text=Living" },
  { id: 4, name: "Kitchen", image: "https://placehold.co/100x100?text=Kitchen" },
  { id: 5, name: "Kids", image: "https://placehold.co/100x100?text=Kids" },
];

// Dummy Data for Products
const DUMMY_PRODUCTS = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: `৳${(i + 1) * 100}`,
  primary_photo: `https://placehold.co/150x150?text=Product+${i + 1}`,
  category: { name: "Bedding" },
  sub_category: { name: "Sheets" },
  child_sub_category: { name: "Cotton" }
}));

interface SearchPopupProps {
  onClose: () => void;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ onClose }) => {
  const [categories, setCategories] = useState<any[]>(DUMMY_CATEGORIES);
  const [products, setProducts] = useState<any[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const productsRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const router = useRouter();

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryClick = (categoryName: string) => {
    const popupElement = document.querySelector(`.${styles.popup}`);
    if (popupElement) {
      popupElement.classList.add(styles.slideUp);
    }

    // Wait for animation to complete before navigation
    setTimeout(() => {
      onClose();
      router.push(`/categories/${categoryName.toLowerCase().replace(/ /g, '-')}`);
    }, 300);
  };

  const handleProductClick = () => {
    const popupElement = document.querySelector(`.${styles.popup}`);
    if (popupElement) {
      popupElement.classList.add(styles.slideUp);
    }

    // Wait for animation to complete before navigation
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Simulated API call
  const fetchProducts = async () => {
     setIsLoading(true);
     // Simulate network delay
     setTimeout(() => {
         setProducts(DUMMY_PRODUCTS);
         setIsLoading(false);
     }, 1000);
  };

  const searchProducts = async (query: string) => {
      setIsLoading(true);
      // Simulate search
       setTimeout(() => {
         const filtered = DUMMY_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
         setProducts(filtered);
         setVisibleProducts(8);
         setIsLoading(false);
     }, 800);
  };
    
  // Debounce search
  useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (searchTerm) {
          searchProducts(searchTerm);
        } else {
          // If search cleared, maybe show empty or trending?
          // For now mimicking v2 behavior of not auto-fetching everything on clear unless intended
          // but let's just keep products empty or show initial state
          setProducts([]); 
        }
      }, 500);
  
      return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);


  // Scroll listener for infinite scroll on products
  useEffect(() => {
    const handleScroll = () => {
      if (!productsRef.current || isLoadingMore) return;
      const { scrollTop, scrollHeight, clientHeight } = productsRef.current;
      if (scrollHeight - scrollTop - clientHeight < 50) {
        loadMoreProducts();
      }
    };

    const productsSection = productsRef.current;
    if (productsSection) {
      productsSection.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (productsSection) {
        productsSection.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoadingMore, products.length, visibleProducts]);

  const loadMoreProducts = async () => {
    if (visibleProducts >= products.length) return;
    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setVisibleProducts((prev) => prev + 8);
    setIsLoadingMore(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.popup} onClick={handleOverlayClick}>
      <div className={styles.popupContent}>
        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        {/* Search Section */}
        <div className={styles.searchSection}>
          {/* Title */}
          <h1 className={styles.title}>What Are You Looking For?</h1>

          {/* Search Area */}
          <div className={styles.searchRow}>
            <select className={styles.categorySelect}>
              <option>All categories</option>
              {categories.map((cat) => (
                <option key={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search for products..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className={styles.searchButton}
              onClick={() => searchProducts(searchTerm)}
            >
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
        <div className={styles.productsSection} ref={productsRef}>
          {!searchTerm ? (
            // Show categories when not searching
            <>
              <h2 className={styles.popularTitle}>Browse Categories</h2>
              {isLoading ? (
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
                        onClick={() => handleCategoryClick(category.name)}
                      >
                        <div className={styles.imageWrapper}>
                          <img
                            src={category.image}
                            alt={category.name}
                            className={styles.categoryImage}
                          />
                        </div>
                        <p className={styles.categoryName}>{category.name}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`${styles.pageButton} ${
                              currentPage === page ? styles.activePage : ""
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            // Show products when searching
            <>
              <h2 className={styles.popularTitle}>Search Results</h2>
              {isLoading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p>Loading Products...</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className={styles.categoryGrid}>
                    {products.slice(0, visibleProducts).map((product) => (
                      <Link
                        key={product.id}
                        href="#"
                        className={styles.categoryCard}
                        onClick={handleProductClick}
                      >
                        <img
                          src={product.primary_photo}
                          alt={product.name}
                          className={styles.productImage}
                        />
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productPrice}>{product.price}</p>
                      </Link>
                    ))}
                  </div>
                  {isLoadingMore && visibleProducts < products.length && (
                    <div className={styles.bottomLoader}>
                      <div className={styles.spinner}></div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.loadingContainer}>
                  <p>No products found for "{searchTerm}"</p>
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

