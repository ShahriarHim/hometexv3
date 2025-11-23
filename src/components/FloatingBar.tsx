"use client";

import React, { useState, useEffect } from 'react';
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
import ChatPopup from './ChatPopup';
import CartPopup from './CartPopup';
import WishlistPopup from './WishlistPopup';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const FloatingBar = () => {
    const [showBar, setShowBar] = useState(false); // Visibility based on scroll
    const [showCategoriesPopup, setShowCategoriesPopup] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishOpen, setIsWishOpen] = useState(false);
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
    const [showLocationPanel, setShowLocationPanel] = useState(false);

    // Get cart and wishlist data from context
    const { getTotalItems, getTotalPrice } = useCart();
    const { items: wishlistItems } = useWishlist();
    
    const cartItemsCount = getTotalItems();
    const totalPrice = getTotalPrice();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Placeholder handlers
    const handleCartClick = () => setIsCartOpen(!isCartOpen);
    const handleWishClick = () => setIsWishOpen(!isWishOpen);
    const handleRecentlyViewedClick = () => setShowRecentlyViewed(!showRecentlyViewed);
    const handleGetCurrentLocation = () => setShowLocationPanel(!showLocationPanel);
    const handleChatToggle = () => setIsChatVisible(!isChatVisible);

    const buttonData = [
        {
            icon: <FaListUl />,
            tooltip: 'All Categories',
            onClick: () => setShowCategoriesPopup(true),
            className: 'floating-btn-first',
            badge: null,
        },
        {
            icon: <FaPhoneAlt />,
            tooltip: 'Customer Service',
            onClick: handleChatToggle,
            className: 'floating-btn-middle',
            badge: null,
        },
        {
            icon: <FaMapMarkerAlt />,
            tooltip: 'Current Location',
            onClick: handleGetCurrentLocation,
            className: 'floating-btn-middle',
            badge: null,
        },
        {
            icon: <FaHeart />,
            tooltip: 'Wishlist',
            onClick: handleWishClick,
            className: 'floating-btn-middle',
            badge: wishlistItems.length,
        },
        {
            icon: <FaEye />,
            tooltip: 'Recently Viewed',
            onClick: handleRecentlyViewedClick,
            className: 'floating-btn-middle',
            badge: null,
        },
        {
            icon: <FaArrowUp />,
            tooltip: 'Back to Top',
            onClick: scrollToTop,
            className: 'floating-btn-last',
            badge: null,
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
                        {cartItemsCount > 0 && (
                            <span className="cart-badge">{cartItemsCount}</span>
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
                        onClick={() => window.open('https://wa.me/8801795256087', '_blank')}
                    >
                        <FaWhatsapp style={{ fontSize: '20px' }} />
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

            {/* Static Placeholders for Popups (Visual only for now as requested) */}
            
            {/* Categories Popup Placeholder */}
            {showCategoriesPopup && (
                <div className="categories-popup-overlay" onClick={() => setShowCategoriesPopup(false)}>
                    <div className="categories-popup" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setShowCategoriesPopup(false)}>×</button>
                        <div className="popup-header">
                            <h2>Browse Categories</h2>
                            <p>Discover our collection</p>
                        </div>
                        <div className="popup-content flex items-center justify-center p-10">
                           <p className="text-gray-500">Categories Content Placeholder</p>
                        </div>
                    </div>
                </div>
            )}

             {/* Recently Viewed Popup Placeholder */}
             {showRecentlyViewed && (
                <div className="fixed inset-0 flex items-center justify-center z-[1100] location-modal-overlay" onClick={() => setShowRecentlyViewed(false)}>
                    <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 relative z-10 shadow-2xl transform transition-all animate-popup-in border border-gray-200 recently-viewed-popup" onClick={e => e.stopPropagation()}>
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Recently Viewed</h3>
                            <button onClick={() => setShowRecentlyViewed(false)} className="text-2xl text-gray-500">&times;</button>
                        </div>
                        <div className="p-10 text-center text-gray-500">
                            Recently Viewed Placeholder
                        </div>
                    </div>
                </div>
            )}

            {/* Location Panel Placeholder */}
            {showLocationPanel && (
                <div className="location-modal-overlay" onClick={() => setShowLocationPanel(false)}>
                    <div className="location-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="location-modal-header">
                            <span className="location-modal-icon"><FaMapMarkerAlt /></span>
                            <span className="location-modal-title">Your Location</span>
                            <button onClick={() => setShowLocationPanel(false)} className="location-modal-close">
                                <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="location-modal-content">
                             <div className="location-modal-empty">
                                <p>Location Service Placeholder</p>
                             </div>
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

                .icon-badge {
                    position: absolute;
                    top: -3px;
                    right: -3px;
                    background-color: #ff4444;
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
                    left: -110%;
                    transform: translateY(-50%);
                    background: rgba(51, 51, 51, 0.9);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 5px;
                    opacity: 0;
                    transition: opacity 0.3s;
                    white-space: nowrap;
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

                /* Recently Viewed Styles */
                .recently-viewed-popup {
                    box-shadow: 0 8px 40px rgba(40,167,69,0.10), 0 1.5px 8px rgba(0,0,0,0.04);
                    border: 1.5px solid #e5e7eb;
                }

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

                /* Location Modal Styles */
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
                .location-modal-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 120px;
                    gap: 1.2rem;
                    text-align: center;
                }
                .location-modal-empty p {
                    color: #7c7c7c;
                    font-size: 1.05rem;
                    margin-bottom: 0.5rem;
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

