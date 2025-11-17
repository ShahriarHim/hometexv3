import React, { useState, useEffect, useContext } from "react";
import ReactStars from "react-rating-stars-component";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { MdFavorite } from "react-icons/md";

import { RiShoppingBasketFill, RiExchangeFill, RiAuctionFill } from "react-icons/ri";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FreeMode, Autoplay } from "swiper";
import Link from "next/link";
import ProductModal from "../common/ProductModal";
import CartContext from "@/context/CartContext";
import { setCookie, getCookie } from 'cookies-next';
import WishListContext from "@/context/WishListContext";
import Swal from "sweetalert2";

const RequestStackModal = ({ product, onClose, onSubmit }) => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(mobileNumber);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Request Product Restock</h2>
        <div className="flex items-center mb-4">
          <img src={product.primary_photo} alt={product.name} className="w-16 h-16 object-cover rounded mr-4" />
          <p className="text-gray-700">{product.name}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700 block mb-2">We'll notify you when this product is back in stock</span>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              pattern="\d{11}"
            />
          </label>
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MakeOfferModal = ({ product, onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(amount);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white p-8 rounded-2xl shadow-2xl z-10 max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="relative mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Make an Offer</h2>
          <p className="text-gray-500 mt-1">Negotiate your best price</p>
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl mb-6">
          <img 
            src={product.primary_photo} 
            alt={product.name} 
            className="w-24 h-24 object-cover rounded-lg shadow-md" 
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-blue-600">
                {product.sell_price?.symbol} {product.sell_price?.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">Current Price</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Offer Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                {product.sell_price?.symbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter your offer"
                className="pl-8 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
                min="1"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter an amount you'd like to offer for this product
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                'Submit Offer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductsTabs = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestProduct, setRequestProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState({
    'all': products,
    'extra-king': [],
    'king': [],
    'semi-double': [],
    'single': []
  });

  const [swiper, setSwiper] = useState(null);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  
  const isAuthenticated = getCookie("home_text_name");

  const [offerProduct, setOfferProduct] = useState(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    setFilteredProducts({
      'all': products,
      'extra-king': products?.filter(p => p?.child_sub_category?.name?.toLowerCase() === 'extra-king') || [],
      'king': products?.filter(p => p?.child_sub_category?.name?.toLowerCase() === 'king') || [],
      'semi-double': products?.filter(p => p?.child_sub_category?.name?.toLowerCase() === 'semi-double') || [],
      'single': products?.filter(p => p?.child_sub_category?.name?.toLowerCase() === 'single') || []
    });
  }, [products]);

  // Function to open modal with product details
  const openModal = (product) => {
    setSelectedProduct(product);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Function to handle request stack
  const handleRequestStack = (product) => {
    setRequestProduct(product);
    setIsModalOpen(true);
  };

  let token = getCookie("home_text_token");

  // Function to handle restock request form submission
  const handleRestockRequestSubmit = async (mobileNumber) => {
    try {
      const response = await fetch('https://htbapi.hometexbd.ltd/api/product/restock/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: requestProduct.id,
          quantity: 1
        })
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted!',
          text: 'We will notify you via email when the product is back in stock.',
          confirmButtonColor: '#3B82F6'
        });
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again later.',
        confirmButtonColor: '#3B82F6'
      });
    }
    setIsModalOpen(false);
    setRequestProduct(null);
  };

  const handleMakeOffer = async (amount) => {
    try {
      const response = await fetch('https://htbapi.hometexbd.ltd/api/product/make-an-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: offerProduct.id,
          amount: parseFloat(amount)
        })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Offer Submitted!',
          text: data.message || 'We will notify you about the deal soon.',
          confirmButtonColor: '#3B82F6'
        });
      } else {
        throw new Error(data.error || 'Failed to submit offer');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Something went wrong! Please try again later.',
        confirmButtonColor: '#3B82F6'
      });
    }
    setIsOfferModalOpen(false);
    setOfferProduct(null);
  };

  const params = {
    slidesPerView: 4,
    spaceBetween: 16,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 12,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      868: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
    },
    freeMode: true,
    loop: true,
    centeredSlides: false,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    modules: [Autoplay, FreeMode],
    className: "mySwiper",
    onSwiper: (swiperInstance) => {
      setSwiper(swiperInstance);
    },
  };

  useEffect(() => {
    if (swiper && swiper.autoplay) {
      if (isSliderHovered) {
        swiper.autoplay.stop();
      } else {
        swiper.autoplay.start();
      }
    }
  }, [isSliderHovered, swiper]);

  if (!products) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-3 mb-10">
        <Tabs>
          <TabList className="flex flex-wrap justify-center lg:justify-start items-center gap-4 py-2">
            <Tab className="text-gray-500 bg-gray-100 py-2 px-4 hover:text-gray-900 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition duration-150 ease-in-out rounded-lg shadow-sm lg:w-auto">
              All Products
            </Tab>
            <Tab className="group py-2 px-4 focus:outline-none transition duration-150 ease-in-out rounded-lg shadow-sm bg-white lg:w-auto">
              <img src="/images/icons/extra-king.png" className="rounded-full h-12 group-hover:scale-110 transition-transform" alt="Extra King" />
            </Tab>
            <Tab className="group py-2 px-4 focus:outline-none transition duration-150 ease-in-out rounded-lg shadow-sm bg-white lg:w-auto">
              <img src="/images/icons/king.png" className="rounded-full h-12 group-hover:scale-110 transition-transform" alt="King" />
            </Tab>
            <Tab className="group py-2 px-4 focus:outline-none transition duration-150 ease-in-out rounded-lg shadow-sm bg-white lg:w-auto">
              <img src="/images/icons/semi-double.png" className="rounded-full h-12 group-hover:scale-110 transition-transform" alt="Semi Double" />
            </Tab>
            <Tab className="group py-2 px-4 focus:outline-none transition duration-150 ease-in-out rounded-lg shadow-sm bg-white lg:w-auto">
              <img src="/images/icons/single.png" className="rounded-full h-12 group-hover:scale-110 transition-transform" alt="Single" />
            </Tab>
          </TabList>
          <div className="lg:flex-grow">
            {Object.entries(filteredProducts).map(([category, items]) => (
              <TabPanel key={category}>
                <div
                  onMouseEnter={() => setIsSliderHovered(true)}
                  onMouseLeave={() => setIsSliderHovered(false)}
                >
                  <Swiper {...params}>
                    {items?.length > 0 ? (
                      items.map((product) => (
                        <SwiperSlide key={product.id}>
                          <ProductCard
                            product={product}
                            openModal={openModal}
                            handleRequestStack={handleRequestStack}
                            setOfferProduct={setOfferProduct}
                            setIsOfferModalOpen={setIsOfferModalOpen}
                          />
                        </SwiperSlide>
                      ))
                    ) : (
                      <div className="text-center py-10">
                        No products available in this category
                      </div>
                    )}
                  </Swiper>
                </div>
              </TabPanel>
            ))}
          </div>
        </Tabs>
      </div>
      {isModalOpen && (
        <RequestStackModal
          product={requestProduct}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleRestockRequestSubmit}
        />
      )}
      {isOfferModalOpen && (
        <MakeOfferModal
          product={offerProduct}
          onClose={() => setIsOfferModalOpen(false)}
          onSubmit={handleMakeOffer}
        />
      )}
      <ProductModal product={selectedProduct} onClose={closeModal} />
    </>
  );
};

const ProductCard = ({ 
  product, 
  openModal, 
  handleRequestStack,
  setOfferProduct,
  setIsOfferModalOpen
}) => {
  const { addItemToCart } = useContext(CartContext);
  const { addToWishlist, isInWishlist } = useContext(WishListContext);
  const [isHovered, setIsHovered] = useState(false);
  
  const isAuthenticated = getCookie("home_text_name");

  const originalPrice = parseFloat(product.original_price);
  const sellPrice = parseFloat(product.sell_price?.price);
  const discount = originalPrice && sellPrice ? 
    Math.round(((originalPrice - sellPrice) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    const item = {
      product_id: product.id,
      name: product.name,
      price: product.sell_price?.price,
      image: product.primary_photo,
      quantity: 1
    };
    
    addItemToCart(item);
    
    // Show custom popup
    const popup = document.createElement('div');
    popup.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-slide-in-right';
    popup.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Added to cart!</span>
      </div>
    `;
    
    document.body.appendChild(popup);

    // Remove popup after 2 seconds
    setTimeout(() => {
      popup.classList.add('animate-slide-out-right');
      setTimeout(() => {
        document.body.removeChild(popup);
      }, 300);
    }, 2000);
  };

  const handleProductClick = () => {
    // Get existing recently viewed products
    let recentlyViewed = getCookie('recentlyViewed');
    recentlyViewed = recentlyViewed ? JSON.parse(recentlyViewed) : [];

    // Add current product if not already in list
    const productInfo = {
      id: product.id,
      name: product.name,
      image: product.primary_photo,
      category: product.category?.name || '',
      sub_category: product.sub_category?.name || '',
      child_sub_category: product.child_sub_category?.name || '',
      price: product.sell_price?.price
    };

    // Remove if product already exists (to move it to front)
    recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);
    
    // Add to front of array
    recentlyViewed.unshift(productInfo);
    
    // Keep only last 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);

    // Save back to cookie
    setCookie('recentlyViewed', JSON.stringify(recentlyViewed), {
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    openModal(product);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    console.log("Clicked wishlist for product:", product);
    
    const item = {
      product_id: product.id,
      name: product.name,
      price: product.sell_price?.price,
      image: product.primary_photo,
      quantity: 1,
      stock: product.stock || 0
    };
    
    const result = addToWishlist(item);
    console.log("Wishlist operation result:", result);
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: result.success ? 'success' : 'error',
      title: result.message,
      customClass: {
        popup: 'colored-toast',
        title: 'text-sm font-medium'
      }
    });
  };

  const handleOfferClick = (e) => {
    e.stopPropagation();
    setOfferProduct(product);
    setIsOfferModalOpen(true);
  };

  return (
    <div 
      className="relative w-full max-w-sm bg-white rounded-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] transition-all duration-300 border border-gray-100 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Container */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-0.5">
        {discount > 0 && (
          <span className="bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-md transform transition-transform duration-300 hover:scale-105">
            -{discount}%
          </span>
        )}
        {product.isNew === 1 && (
          <span className="bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-md transform transition-transform duration-300 hover:scale-105">
            New
          </span>
        )}
        {product.isTrending === 1 && (
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-0.5 rounded-md transform transition-transform duration-300 hover:scale-105">
            Trending
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div 
        className="relative aspect-square overflow-hidden rounded-t-lg cursor-pointer group"
        onClick={handleProductClick}
      >
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={product.primary_photo}
          alt={product.name}
        />
        
        {/* Hover Overlay - Updated for right to left animation */}
        <div 
          className="absolute inset-0 bg-black/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0))'
          }}
        />
        
        {/* Quick Action Buttons */}
        <div className={`absolute right-2 top-2 flex flex-col gap-1 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button 
            onClick={handleWishlistClick}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:scale-110 hover:shadow-md"
          >
            <MdFavorite 
              size={16} 
              className={`transition-colors ${
                isInWishlist(product.id) 
                  ? 'text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              }`} 
            />
          </button>
          {product.stock > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }} 
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:scale-110 hover:shadow-md"
            >
              <RiShoppingBasketFill size={16} className="text-gray-600 hover:text-blue-500 transition-colors" />
            </button>
          )}
          {isAuthenticated && (
            <button 
              onClick={handleOfferClick}
              className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:scale-110 hover:shadow-md"
            >
              <RiAuctionFill size={16} className="text-gray-600 hover:text-green-500 transition-colors" />
            </button>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3">
        {/* Product Name and Stock Status */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link href={`/shop/product/${product.category?.name?.toLowerCase()}/${product.sub_category?.name?.toLowerCase()}/${product.child_sub_category?.name?.toLowerCase()}/${encodeURIComponent(Buffer.from(`prod-${product.id}-salt`).toString("base64"))}`} className="flex-1">
            <h5 className="text-sm font-medium text-gray-900 hover:text-gray-700 line-clamp-2 leading-tight">
              {product.name}
            </h5>
          </Link>
          <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
            product.stock > 0
              ? 'bg-green-50 text-green-600'
              : 'bg-red-50 text-red-600'
          }`}>
            {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
        <ReactStars
          count={5}
            size={16}
            value={Number(product.star) || 0}
            isHalf={true}
          edit={false}
            activeColor="#FBBF24"
            color="#E5E7EB"
          />
          <span className="text-xs text-gray-500">({product.star || 0})</span>
        </div>

        {/* Price and Action */}
          <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-900">
              {product.sell_price?.symbol} {product.sell_price?.price.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-500 line-through">
                {product.sell_price?.symbol} {product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          
        <button
            className={`py-1.5 px-3 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
              product.stock > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25'
                : isAuthenticated 
                  ? 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25'
                  : 'bg-gray-500 text-white cursor-not-allowed'
            }`}
            onClick={() => product.stock > 0 
              ? handleAddToCart() 
              : isAuthenticated 
                ? handleRequestStack(product)
                : null
            }
            disabled={!product.stock && !isAuthenticated}
          >
            {product.stock > 0 
              ? 'Add to Cart' 
              : isAuthenticated 
                ? 'Request Stock' 
                : 'Out of Stock'
            }
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTabs;
