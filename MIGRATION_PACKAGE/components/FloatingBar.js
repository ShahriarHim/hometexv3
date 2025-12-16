import React, { useState, useEffect, useRef, useContext } from 'react';
import Popup from 'reactjs-popup';
import {
    FaShoppingCart,
    FaListUl,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaHeart,
    FaEye,
    FaArrowUp,
    FaWhatsapp,
} from 'react-icons/fa';
import useGeolocation from './UseGeolocation';
import ChatPopup from "@/components/ChatPopup";
import CartComponent from "@/components/layout/CartComponent/CartComponent";
import WishComponent from "@/components/layout/WishComponent/WishComponent";
import CartContext from "@/context/CartContext";
import Link from 'next/link';
import Constants from '@/ults/Constant';
import WishListContext from "@/context/WishListContext";
import { getCookie, setCookie } from 'cookies-next';
import { useGeolocated } from "react-geolocated";

const FloatingBar = () => {
    const { location, isGeolocationAvailable, isGeolocationEnabled } = useGeolocation();
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false); // State for cart visibility
    const [isWishOpen, setIsWishOpen] = useState(false); // State for wishlist visibility
    const [showBar, setShowBar] = useState(false); // Visibility based on scroll
    const [categories, setCategories] = useState([]);
    const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
    const [recentlyViewedProducts, setRecentlyViewedProducts] = useState([]);
    const [showLocationPanel, setShowLocationPanel] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [editedLocationData, setEditedLocationData] = useState(null);

    const cartRef = useRef(null);
    const wishRef = useRef(null);
    const { cart, deleteItemFromCart } = useContext(CartContext);
    const { wlist, deleteItemFromWishlist } = useContext(WishListContext);

    const cartItems = cart?.cartItems;
    const [totalPrice, setTotalPrice] = useState(0);

    const { coords, isGeolocationAvailable: geolocatedIsGeolocationAvailable, isGeolocationEnabled: geolocatedIsGeolocationEnabled } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleChatToggle = () => {
        setIsChatVisible(prevState => !prevState);
    };

    const handleScroll = () => {
        if (window.scrollY > 250) {
            setShowBar(true);
        } else {
            setShowBar(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (cartItems) {
            const finalAmount = cartItems.reduce((total, cartItem) => {
                let priceStr = cartItem.price;
                priceStr = typeof priceStr !== 'string' ? String(priceStr) : priceStr;
                priceStr = priceStr.replace(/[,]/g, "");
                const amount = parseInt(priceStr, 10) * cartItem.quantity;
                return total + amount;
            }, 0);
            setTotalPrice(finalAmount);
        }
    }, [cartItems]);

    useEffect(() => {
        if (showRecentlyViewed) {
            const recentlyViewed = getCookie('recentlyViewed');
            setRecentlyViewedProducts(recentlyViewed ? JSON.parse(recentlyViewed) : []);
        }
    }, [showRecentlyViewed]);

    useEffect(() => {
        const savedLocation = getCookie('user_location');
        if (savedLocation) {
            try {
                setLocationData(JSON.parse(savedLocation));
            } catch (error) {
                console.error("Error parsing location cookie:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (locationData) {
            setEditedLocationData({...locationData});
        }
    }, [locationData]);

    const handleCartClick = () => {
        setIsCartOpen(prevState => !prevState);
        setIsWishOpen(false); // Close wishlist if open
    };

    const handleWishClick = () => {
        setIsWishOpen(prevState => !prevState);
        setIsCartOpen(false); // Close cart if open
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${Constants.BASE_URL}/api/product-menu/horizontal`,
                {
                    method: 'GET',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'omit',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            ).catch((fetchError) => {
                throw new Error(`Network error: ${fetchError.message}`);
            });

            if (!response || !response.ok) {
                throw new Error(`HTTP error! status: ${response?.status || 'unknown'}`);
            }

            const result = await response.json().catch((jsonError) => {
                throw new Error(`JSON parse error: ${jsonError.message}`);
            });

            setCategories(result.data || []);
        } catch (error) {
            console.warn('Error fetching categories (non-critical):', error.message || error);
            setCategories([]); // Set empty array on error
        }
    };

    useEffect(() => {
        // Wrap in promise handler to catch any unhandled rejections
        const loadCategories = async () => {
            try {
                await fetchCategories();
            } catch (error) {
                // Error already handled in fetchCategories, but catch here to prevent unhandled rejection
                console.warn('Category fetch failed (non-critical):', error.message || error);
                setCategories([]);
            }
        };

        loadCategories().catch(() => {
            // Final catch to prevent any unhandled rejections
            setCategories([]);
        });
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !hoveredCategory) {
            setHoveredCategory(categories[0].id);
        }
    }, [categories]);

    const handleRecentlyViewedClick = () => {
        setShowRecentlyViewed(true);
    };

    const handleRemoveRecentlyViewed = (id) => {
        const updated = recentlyViewedProducts.filter(item => item.id !== id);
        setRecentlyViewedProducts(updated);
        setCookie('recentlyViewed', JSON.stringify(updated), {
            maxAge: 30 * 24 * 60 * 60
        });
    };

    const handleClearAllRecentlyViewed = () => {
        setRecentlyViewedProducts([]);
        setCookie('recentlyViewed', JSON.stringify([]), {
            maxAge: 30 * 24 * 60 * 60
        });
    };

    const handleGetCurrentLocation = async () => {
        setIsLoadingLocation(true);
        setShowLocationPanel(true);
        
        try {
            if (!geolocatedIsGeolocationAvailable) {
                alert("Your browser does not support geolocation");
                return;
            }

            if (!geolocatedIsGeolocationEnabled) {
                alert("Please enable location services");
                return;
            }

            if (coords) {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Creating a simplified location object
                const locationInfo = {
                    displayName: data.display_name,
                    city: data.address.city || data.address.town || data.address.village || "",
                    state: data.address.state?.replace(" Division", "") || "",
                    district: data.address.state_district?.replace(" District", "") || "",
                    country: data.address.country || "",
                    countryCode: data.address.country_code?.toUpperCase() || "",
                    postcode: data.address.postcode || "",
                    latitude: coords.latitude,
                    longitude: coords.longitude
                };
                
                setLocationData(locationInfo);
                
                // Store in cookies
                setCookie('user_location', JSON.stringify(locationInfo), {
                    maxAge: 30 * 24 * 60 * 60, // 30 days
                    path: '/'
                });
            }
        } catch (error) {
            console.error("Error getting location:", error);
            alert("Error getting location. Please try again.");
        } finally {
            setIsLoadingLocation(false);
        }
    };
    
    const closeLocationPanel = () => {
        setShowLocationPanel(false);
    };

    const handleEditLocation = () => {
        setIsEditingLocation(true);
        setEditedLocationData({...locationData});
    };
    
    const handleSaveLocationEdits = () => {
        // Update the location data with edited values
        setLocationData(editedLocationData);
        
        // Save to cookies
        setCookie('user_location', JSON.stringify(editedLocationData), {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/'
        });
        
        setIsEditingLocation(false);
    };
    
    const handleCancelEdit = () => {
        setIsEditingLocation(false);
        // Reset edited data to original
        setEditedLocationData({...locationData});
    };
    
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedLocationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const buttonData = [
        {
            icon: <FaListUl />,
            tooltip: 'All Categories',
            onClick: () => setShowCategoriesPopup(true),
            className: 'floating-btn-first',
        },
        {
            icon: <FaPhoneAlt />,
            tooltip: 'Customer Service',
            onClick: () => (window.location.href = '/Contact'),
            className: 'floating-btn-middle',
        },
        {
            icon: <FaMapMarkerAlt />,
            tooltip: 'Current Location',
            onClick: handleGetCurrentLocation,
            className: 'floating-btn-middle',
        },
        {
            icon: <FaHeart />,
            tooltip: 'Wishlist',
            onClick: handleWishClick, // Open Wishlist
            className: 'floating-btn-middle',
        },
        {
            icon: <FaEye />,
            tooltip: 'Recently Viewed',
            onClick: handleRecentlyViewedClick,
            className: 'floating-btn-middle',
        },
        {
            icon: <FaArrowUp />,
            tooltip: 'Back to Top',
            onClick: scrollToTop,
            className: 'floating-btn-last',
        },
    ];

    return (
        <>
            <div className={`floating-bar ${showBar ? 'visible' : ''}`}>
                {/* Add to Cart Button */}
                <div className="cart-container">
                    <button className="floating-btn-cart green-btn" onClick={handleCartClick}>
                        <FaShoppingCart style={{ fontSize: '20px' }} />
                        <span className="cart-text">৳{totalPrice}</span>
                        {cartItems && cartItems.length > 0 && (
                            <span className="cart-badge">{cartItems.length}</span>
                        )}
                    </button>
                </div>

                {/* Grouped Buttons */}
                <div className="grouped-buttons">
                    <div className="button-container">
                        {buttonData.map((button, index) => (
                            <button key={index} className={`floating-btn ${button.className}`} onClick={button.onClick}>
                                {button.icon}
                                <span className="tooltip">{button.tooltip}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Button - Moved below grouped buttons */}
                <div className="whatsapp-container">
                    <button 
                        className="floating-btn whatsapp-btn" 
                        onClick={() => window.open('https://wa.me/8801795256087', '_blank')}
                    >
                        <FaWhatsapp style={{ fontSize: '20px' }} />
                        <span className="tooltip">Chat with us</span>
                    </button>
                </div>
            </div>

            {/* Cart Component */}
            {isCartOpen && (
                <CartComponent
                    cartRef={cartRef}
                    handleCartClick={handleCartClick}
                    cartItems={cartItems}
                    isOpen={isCartOpen}
                    cart={{ cartItems }}
                    deleteItemFromCart={deleteItemFromCart}
                    totalPrice={totalPrice}
                />
            )}

            {/* Wishlist Component */}
            {isWishOpen && (
                <WishComponent
                    wishRef={wishRef}
                    handleWishClick={handleWishClick}
                    wlistItems={wlist}   // ✅ Corrected: Pass wlist directly
                    isOpen={isWishOpen}
                    wlist={wlist}   // ✅ Corrected: wlist is an array, not an object
                    deleteItemFromWishlist={deleteItemFromWishlist}
                />
            )}

            {/* Chat Popup */}
            {isChatVisible && <ChatPopup onClose={handleChatToggle} />}

            {/* Categories Popup */}
            {showCategoriesPopup && (
                <div className="categories-popup-overlay" onClick={() => setShowCategoriesPopup(false)}>
                    <div className="categories-popup" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowCategoriesPopup(false)}>×</button>
                        <div className="popup-header">
                            <h2>Browse Categories</h2>
                            <p>Discover our collection</p>
                        </div>
                        <div className="popup-content">
                            <div className="categories-list">
                                {categories.map((category) => (
                                    <div 
                                        key={category.id} 
                                        className={`category-item ${hoveredCategory === category.id ? 'hovered' : ''}`}
                                        onMouseEnter={() => setHoveredCategory(category.id)}
                                    >
                                        <Link 
                                            href={`/products/${category.name.toLowerCase()}`}
                                            className="category-main"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowCategoriesPopup(false);
                                            }}
                                        >
                                            <div className="category-header">
                                                <div className="category-icon">
                                                    {category.image && (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="category-image"
                                                        />
                                                    )}
                                                </div>
                                                <div className="category-info">
                                                    <span className="category-name">{category.name}</span>
                                                    <span className="subcategory-count">
                                                        {category.sub?.length || 0} subcategories
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Subcategories Panel */}
                            <div className="subcategories-panel">
                                <div className="subcategories-content">
                                    {hoveredCategory && categories.find(cat => cat.id === hoveredCategory)?.sub && (
                                        <>
                                            <h3>{categories.find(cat => cat.id === hoveredCategory)?.name}</h3>
                                            <div className="subcategories-grid">
                                                {categories.find(cat => cat.id === hoveredCategory)?.sub.map((sub) => (
                                                    <div 
                                                        key={sub.id} 
                                                        className="subcategory-card"
                                                    >
                                                        <Link 
                                                            href={`/products/${categories.find(cat => cat.id === hoveredCategory)?.name.toLowerCase()}/${sub.name.toLowerCase()}`}
                                                            className="subcategory-card-link"
                                                            onClick={() => setShowCategoriesPopup(false)}
                                                        >
                                                            <span className="subcategory-name">{sub.name}</span>
                                                            {sub.child && sub.child.length > 0 && (
                                                                <div className="child-categories">
                                                                    {sub.child.map((child) => (
                                                                        <span key={child.id} className="child-category">
                                                                            {child.name}
                                                                        </span>
                                                                    ))}
                                                                    {/* {sub.child.length > 3 && (
                                                                        <span className="more-indicator">
                                                                            +{sub.child.length - 3} more
                                                                        </span>
                                                                    )} */}
                                                                </div>
                                                            )}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Recently Viewed Popup */}
            {showRecentlyViewed && (
                <div className="fixed inset-0 flex items-center justify-center z-[1100]">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowRecentlyViewed(false)}
                    ></div>
                    <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 relative z-10 shadow-2xl transform transition-all animate-popup-in border border-gray-200 recently-viewed-popup">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Recently Viewed</h3>
                                <p className="text-gray-500 text-sm mt-1">Your browsing history</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {recentlyViewedProducts.length > 0 && (
                                    <button
                                        onClick={handleClearAllRecentlyViewed}
                                        className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 font-medium border border-gray-200 transition"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowRecentlyViewed(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors group border border-gray-300 shadow-sm"
                                    aria-label="Close"
                                >
                                    <span className="text-2xl text-gray-500 group-hover:text-red-500 transition-colors">&times;</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto px-1 custom-scrollbar">
                            {recentlyViewedProducts.length > 0 ? (
                                recentlyViewedProducts.map((product, index) => (
                                    <div
                                        key={`${product.id}-${index}`}
                                        className={`recently-viewed-card group animate-card-in relative`}
                                        style={{ animationDelay: `${index * 60}ms` }}
                                    >
                                        {/* Remove button */}
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleRemoveRecentlyViewed(product.id);
                                            }}
                                            className="absolute top-2 right-2 z-20 bg-white/80 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-full p-1.5 shadow transition"
                                            title="Remove from history"
                                        >
                                            <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                                                <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </button>
                                        <Link 
                                            href={`/shop/product/${product.category?.toLowerCase() || 'unknown'}/${product.sub_category?.toLowerCase() || 'unknown'}/${product.child_sub_category?.toLowerCase() || 'unknown'}/${encodeURIComponent(Buffer.from(`prod-${product.id}-salt`).toString("base64"))}`}
                                            onClick={() => setShowRecentlyViewed(false)}
                                            className="block"
                                        >
                                            <div className="aspect-square overflow-hidden relative rounded-xl">
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
                                                    <span className="mb-4 px-3 py-1 bg-white/90 text-gray-800 text-xs font-semibold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                        View Details
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4 flex flex-col gap-1">
                                                <p className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors mb-1">
                                                    {product.name}
                                                </p>
                                                {product.price && (
                                                    <p className="text-sm font-bold text-green-600">
                                                        ৳{product.price}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 animate-fade-in">
                                    <FaEye className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-xl font-medium mb-2">No recently viewed products</p>
                                    <p className="text-sm text-gray-400">Start browsing our collection to see your history here</p>
                                    <Link 
                                        href="/shop"
                                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
                                        onClick={() => setShowRecentlyViewed(false)}
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Location Panel - Centered on screen with click-outside functionality */}
            {showLocationPanel && (
                <div className="location-modal-overlay" onClick={closeLocationPanel}>
                    <div
                        className={`location-modal-card${isEditingLocation ? " editing" : ""}`}
                        onClick={e => e.stopPropagation()}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="location-modal-header">
                            <span className="location-modal-icon">
                                <FaMapMarkerAlt />
                            </span>
                            <span className="location-modal-title">
                                {isEditingLocation ? "Edit Location" : "Your Location"}
                            </span>
                            {locationData && !isEditingLocation && (
                                <div className="location-modal-actions">
                                    <button
                                        onClick={handleEditLocation}
                                        className="location-modal-action-btn"
                                        title="Edit"
                                        aria-label="Edit location"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button
                                        onClick={handleGetCurrentLocation}
                                        className="location-modal-action-btn"
                                        title="Refresh"
                                        aria-label="Refresh location"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={closeLocationPanel}
                                className="location-modal-close"
                                aria-label="Close"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="location-modal-content">
                            {isLoadingLocation ? (
                                <div className="location-modal-loading">
                                    <div className="location-modal-spinner"></div>
                                    <span>Finding your location...</span>
                                </div>
                            ) : locationData && !isEditingLocation ? (
                                <div>
                                    <div className="location-modal-pill">
                                        <FaMapMarkerAlt />
                                        <span>
                                            {locationData.city || ""}
                                            {locationData.district ? `, ${locationData.district}` : ""}
                                        </span>
                                    </div>
                                    <div className="location-modal-details">
                                        {locationData.displayName && (
                                            <div className="location-modal-address">{locationData.displayName}</div>
                                        )}
                                        <div className="location-modal-grid">
                                            {locationData.city && (
                                                <div>
                                                    <div className="location-modal-label">City</div>
                                                    <div className="location-modal-value">{locationData.city}</div>
                                                </div>
                                            )}
                                            {locationData.district && (
                                                <div>
                                                    <div className="location-modal-label">District</div>
                                                    <div className="location-modal-value">{locationData.district}</div>
                                                </div>
                                            )}
                                            {locationData.state && (
                                                <div>
                                                    <div className="location-modal-label">Division</div>
                                                    <div className="location-modal-value">{locationData.state}</div>
                                                </div>
                                            )}
                                            {locationData.postcode && (
                                                <div>
                                                    <div className="location-modal-label">Postcode</div>
                                                    <div className="location-modal-value">{locationData.postcode}</div>
                                                </div>
                                            )}
                                            {locationData.country && (
                                                <div>
                                                    <div className="location-modal-label">Country</div>
                                                    <div className="location-modal-value">{locationData.country}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : locationData && isEditingLocation ? (
                                <form
                                    className="location-modal-editform"
                                    onSubmit={e => {
                                        e.preventDefault();
                                        handleSaveLocationEdits();
                                    }}
                                >
                                    <div className="location-modal-grid">
                                        <div>
                                            <label className="location-modal-label">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={editedLocationData.city || ""}
                                                onChange={handleEditChange}
                                                className="location-modal-input"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="location-modal-label">District</label>
                                            <input
                                                type="text"
                                                name="district"
                                                value={editedLocationData.district || ""}
                                                onChange={handleEditChange}
                                                className="location-modal-input"
                                                placeholder="District"
                                            />
                                        </div>
                                        <div>
                                            <label className="location-modal-label">Division</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={editedLocationData.state || ""}
                                                onChange={handleEditChange}
                                                className="location-modal-input"
                                                placeholder="Division"
                                            />
                                        </div>
                                        <div>
                                            <label className="location-modal-label">Postcode</label>
                                            <input
                                                type="text"
                                                name="postcode"
                                                value={editedLocationData.postcode || ""}
                                                onChange={handleEditChange}
                                                className="location-modal-input"
                                                placeholder="Postcode"
                                            />
                                        </div>
                                        <div>
                                            <label className="location-modal-label">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={editedLocationData.country || ""}
                                                onChange={handleEditChange}
                                                className="location-modal-input"
                                                placeholder="Country"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="location-modal-label">Full Address</label>
                                        <textarea
                                            name="displayName"
                                            value={editedLocationData.displayName || ""}
                                            onChange={handleEditChange}
                                            className="location-modal-textarea"
                                            placeholder="Full address"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="location-modal-editactions">
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="location-modal-cancel"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="location-modal-save">
                                            Save
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="location-modal-empty">
                                    <div>
                                        <svg width="40" height="40" viewBox="0 0 24 24" stroke="currentColor" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                    </div>
                                    <p>We couldn't determine your location</p>
                                    <button
                                        onClick={handleGetCurrentLocation}
                                        className="location-modal-tryagain"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        <span>Try Again</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
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
                    transition: opacity 0.5s, transform 0.5s ease-out;
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
                    background-color: #ff4444;
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
                    left: -110%;
                    transform: translateY(-50%);
                    background: rgba(51, 51, 51, 0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 5px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .floating-btn:hover .tooltip {
                    opacity: 1;
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
                    background: linear-gradient(to right, #d4ed30, #a8c423);
                    padding: 1.5rem;
                    color: white;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .popup-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 40%, transparent 50%);
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
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
                    background: #fff;
                }

                .categories-list {
                    width: 250px;
                    padding: 1rem;
                    border-right: 1px solid rgba(0, 0, 0, 0.08);
                    overflow-y: auto;
                    background: #f8f9fa;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .categories-list::-webkit-scrollbar {
                    display: none;
                }

                .category-item {
                    margin-bottom: 0.5rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    background: white;
                    border: 1px solid transparent;
                }

                .category-item.hovered {
                    border-color: #a8c423;
                    box-shadow: 0 4px 20px rgba(40, 167, 69, 0.15);
                    background: linear-gradient(to right, white, #f8f9fa);
                }

                .category-main {
                    text-decoration: none;
                    color: #333;
                    display: block;
                    padding: 0.8rem;
                }

                .category-header {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }

                .category-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 2px;
                    margin-left: 5px;
                    transition: all 0.3s ease;
                }

                .category-item.hovered .category-icon {
                    background: #a8c423;
                    transform: scale(1.05);
                }

                .category-item.hovered .category-image {
                    filter: brightness(0) invert(1);
                }

                .category-info {
                    flex: 1;
                }

                .category-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #2c3e50;
                    margin-top: 2px;
                    display: block;
                }

                .subcategory-count {
                    font-size: 0.8rem;
                    color: #708507;
                    font-weight: 500;
                    margin-bottom: 10px;
                }

                .subcategories-panel {
                    flex: 1;
                    padding: 1.5rem;
                    background: white;
                    overflow-y: auto;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .subcategories-panel::-webkit-scrollbar {
                    display: none;
                }

                .subcategories-content h3 {
                    color: #a8c423;
                    margin-bottom: 1.5rem;
                    font-size: 1.2rem;
                    font-weight: 600;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #e9ecef;
                    position: relative;
                }

                .subcategories-content h3::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 100px;
                    height: 2px;
                    background: #a8c423;
                }

                .subcategories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 1rem;
                    padding-bottom: 1.5rem;
                }

                .subcategory-card {
                    background: white;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    border: 1px solid #eee;
                    position: relative;
                    overflow: hidden;
                    max-width: 220px;
                }

                .subcategory-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(to right, #d4ed30, #a8c423);
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .subcategory-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.15);
                    border-color: transparent;
                }

                .subcategory-card:hover::before {
                    opacity: 1;
                }

                .subcategory-card-link {
                    padding: 1rem;
                    display: block;
                    text-decoration: none;
                    color: #333;
                    height: 100%;
                }

                .subcategory-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #2c3e50;
                    display: block;
                    padding: 0.5rem 0.5rem;
                    margin-bottom: 0.6rem;
                }

                .child-categories {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.4rem;
                    padding: 0.5rem;
                }

                .child-category {
                    font-size: 0.75rem;
                    color: #666;
                    background: #f8f9fa;
                    padding: 0.25rem 0.6rem;
                    border-radius: 12px;
                }
                
                .subcategory-card:hover .child-category {
                    background: rgba(40, 167, 69, 0.1);
                    color:#708507;
                }

                .subcategory-card:hover .child-category:hover {
                    color: black;
                }
                .more-indicator {
                    font-size: 0.8rem;
                    color: #a8c423;
                    font-weight: 500;
                    margin-top: 0.5rem;
                    display: inline-block;
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
                    background-color: #25d366;
                    color: white;
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
                    background-color: #128c7e;
                }

                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(40, 167, 69, 0.5) transparent;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(40, 167, 69, 0.5);
                    border-radius: 20px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(40, 167, 69, 0.7);
                }

                .recently-viewed-popup {
                    box-shadow: 0 8px 40px rgba(40,167,69,0.10), 0 1.5px 8px rgba(0,0,0,0.04);
                    border: 1.5px solid #e5e7eb;
                }

                .recently-viewed-card {
                    background: white;
                    border-radius: 1rem;
                    border: 1.5px solid #e5e7eb;
                    box-shadow: 0 2px 8px rgba(40,167,69,0.07);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: 
                        box-shadow 0.3s cubic-bezier(.4,2,.6,1), 
                        transform 0.2s cubic-bezier(.4,2,.6,1), 
                        border-color 0.2s;
                    cursor: pointer;
                    position: relative;
                    min-height: 220px;
                }
                .recently-viewed-card:hover {
                    box-shadow: 0 8px 32px rgba(40,167,69,0.18), 0 1.5px 8px rgba(0,0,0,0.04);
                    border-color: #a8c423;
                    transform: translateY(-4px) scale(1.03);
                    z-index: 2;
                }
                .recently-viewed-card .aspect-square {
                    border-radius: 1rem 1rem 0 0;
                    min-height: 160px;
                    background: #f8f9fa;
                }
                .recently-viewed-card img {
                    border-radius: 1rem 1rem 0 0;
                    transition: transform 0.5s cubic-bezier(.4,2,.6,1);
                }
                .recently-viewed-card .p-4 {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }
                .recently-viewed-card .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                /* Popup Animations */
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s cubic-bezier(.4,2,.6,1);
                }
                @keyframes popup-in {
                    from { opacity: 0; transform: scale(0.96) translateY(30px);}
                    to { opacity: 1; transform: scale(1) translateY(0);}
                }
                .animate-popup-in {
                    animation: popup-in 0.45s cubic-bezier(.4,2,.6,1);
                }
                @keyframes card-in {
                    from { opacity: 0; transform: translateY(30px) scale(0.97);}
                    to { opacity: 1; transform: translateY(0) scale(1);}
                }
                .animate-card-in {
                    animation: card-in 0.5s cubic-bezier(.4,2,.6,1) both;
                }
                /* Close button hover effect */
                .recently-viewed-popup .group:hover .text-gray-500 {
                    color: #ef4444;
                }

                .location-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 1050;
                    background: rgba(0,0,0,0.32);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: locationModalFadeIn 0.25s cubic-bezier(.4,2,.6,1);
                    backdrop-filter: blur(2px);
                }
                @keyframes locationModalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .location-modal-card {
                    background: #fff;
                    border-radius: 18px;
                    width: 95vw;
                    max-width: 370px;
                    max-height: 92vh;
                    box-shadow: 0 8px 40px rgba(40,167,69,0.13), 0 1.5px 8px rgba(0,0,0,0.04);
                    border: 1.5px solid #e5e7eb;
                    display: flex;
                    flex-direction: column;
                    animation: locationModalPopIn 0.33s cubic-bezier(.4,2,.6,1);
                    position: relative;
                    overflow: hidden;
                }
                @keyframes locationModalPopIn {
                    from { opacity: 0; transform: scale(0.92) translateY(40px);}
                    60% { opacity: 1; transform: scale(1.04) translateY(-6px);}
                    to { opacity: 1; transform: scale(1) translateY(0);}
                }
                .location-modal-header {
                    display: flex;
                    align-items: center;
                    padding: 1rem 1.25rem 0.75rem 1.25rem;
                    border-bottom: 1px solid #f3f4f6;
                    background: linear-gradient(90deg, #f8f9fa 60%, #fff 100%);
                    position: relative;
                    min-height: 56px;
                }
                .location-modal-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #d4ed30 60%, #a8c423 100%);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                    margin-right: 12px;
                    box-shadow: 0 2px 8px rgba(168,196,35,0.13);
                    flex-shrink: 0;
                }
                .location-modal-title {
                    font-size: 1.08rem;
                    font-weight: 600;
                    color: #222;
                    flex: 1;
                    letter-spacing: 0.01em;
                }
                .location-modal-actions {
                    display: flex;
                    gap: 6px;
                    margin-right: 8px;
                }
                .location-modal-action-btn {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #f3f4f6;
                    color: #7c7c7c;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.18s, color 0.18s, transform 0.18s;
                    cursor: pointer;
                    font-size: 1rem;
                }
                .location-modal-action-btn:hover {
                    background: #e6f7c6;
                    color: #a8c423;
                    transform: scale(1.08);
                }
                .location-modal-close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #f3f4f6;
                    color: #7c7c7c;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.18s, color 0.18s, transform 0.18s;
                    cursor: pointer;
                    z-index: 2;
                }
                .location-modal-close:hover {
                    background: #fbe9e9;
                    color: #e53e3e;
                    transform: rotate(90deg) scale(1.08);
                }
                .location-modal-content {
                    padding: 1.1rem 1.25rem 1.25rem 1.25rem;
                    overflow-y: auto;
                    flex: 1;
                    min-height: 120px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .location-modal-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 120px;
                    gap: 1.2rem;
                }
                .location-modal-spinner {
                    width: 32px;
                    height: 32px;
                    border: 3px solid #e6f7c6;
                    border-top: 3px solid #a8c423;
                    border-radius: 50%;
                    animation: locationModalSpin 1s linear infinite;
                    margin-bottom: 0.5rem;
                }
                @keyframes locationModalSpin {
                    to { transform: rotate(360deg);}
                }
                .location-modal-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: #f6fbe9;
                    color: #7c7c7c;
                    border-radius: 16px;
                    font-size: 0.98rem;
                    font-weight: 500;
                    padding: 5px 14px 5px 10px;
                    margin-bottom: 1rem;
                    border: 1px solid #e6f7c6;
                }
                .location-modal-details {
                    margin-bottom: 0.5rem;
                }
                .location-modal-address {
                    font-size: 0.97rem;
                    color: #444;
                    background: #f8f9fa;
                    border-radius: 7px;
                    padding: 0.5rem 0.7rem;
                    margin-bottom: 0.7rem;
                    border: 1px solid #f3f4f6;
                    word-break: break-word;
                }
                .location-modal-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.6rem 0.7rem;
                    margin-bottom: 0.7rem;
                }
                .location-modal-label {
                    font-size: 0.93rem;
                    color: #7c7c7c;
                    font-weight: 600;
                    margin-bottom: 2px;
                    letter-spacing: 0.01em;
                }
                .location-modal-value {
                    font-size: 1.01rem;
                    color: #222;
                    background: #f8f9fa;
                    border-radius: 6px;
                    padding: 4px 8px;
                    border: 1px solid #f3f4f6;
                    word-break: break-word;
                }
                .location-modal-editform {
                    display: flex;
                    flex-direction: column;
                    gap: 0.7rem;
                    margin-top: 0.2rem;
                }
                .location-modal-input, .location-modal-textarea {
                    width: 100%;
                    border: 1px solid #e5e7eb;
                    border-radius: 7px;
                    padding: 7px 10px;
                    font-size: 1rem;
                    background: #f8f9fa;
                    transition: border 0.18s, background 0.18s;
                    color: #222;
                    margin-top: 2px;
                }
                .location-modal-input:focus, .location-modal-textarea:focus {
                    border-color: #a8c423;
                    background: #fff;
                    outline: none;
                    box-shadow: 0 0 0 2px #e6f7c6;
                }
                .location-modal-editactions {
                    display: flex;
                    gap: 10px;
                    margin-top: 0.5rem;
                }
                .location-modal-cancel, .location-modal-save {
                    flex: 1;
                    height: 38px;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
                }
                .location-modal-cancel {
                    background: #f3f4f6;
                    color: #7c7c7c;
                }
                .location-modal-cancel:hover {
                    background: #fbe9e9;
                    color: #e53e3e;
                }
                .location-modal-save {
                    background: linear-gradient(90deg, #d4ed30 60%, #a8c423 100%);
                    color: #222;
                    box-shadow: 0 2px 8px rgba(168,196,35,0.13);
                }
                .location-modal-save:hover {
                    background: linear-gradient(90deg, #c8e01c 60%, #9db61e 100%);
                    color: #222;
                    box-shadow: 0 4px 16px rgba(168,196,35,0.18);
                }
                .location-modal-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 120px;
                    gap: 1.2rem;
                    text-align: center;
                }
                .location-modal-empty svg {
                    color: #e5e7eb;
                    margin-bottom: 0.5rem;
                }
                .location-modal-empty p {
                    color: #7c7c7c;
                    font-size: 1.05rem;
                    margin-bottom: 0.5rem;
                }
                .location-modal-tryagain {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: linear-gradient(90deg, #d4ed30 60%, #a8c423 100%);
                    color: #222;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 18px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(168,196,35,0.13);
                    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
                }
                .location-modal-tryagain:hover {
                    background: linear-gradient(90deg, #c8e01c 60%, #9db61e 100%);
                    color: #222;
                    box-shadow: 0 4px 16px rgba(168,196,35,0.18);
                }
                @media (max-width: 500px) {
                    .location-modal-card {
                        max-width: 98vw;
                        min-width: 0;
                        width: 99vw;
                        padding: 0;
                    }
                    .location-modal-header,
                    .location-modal-content {
                        padding-left: 0.7rem;
                        padding-right: 0.7rem;
                    }
                }
            `}</style>
        </>
    );
};

export default FloatingBar;

