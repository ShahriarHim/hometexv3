"use client";
import { createContext, useState, useEffect } from "react";
import Swal from 'sweetalert2';

const WishListContext = createContext();

export const WishListProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        loadWishlistFromStorage();
    }, []);

    // Load wishlist from localStorage
    const loadWishlistFromStorage = () => {
        try {
            const storedWishlist = localStorage.getItem("wishlist");
            console.log("Loading wishlist from storage:", storedWishlist);
            // Parse the stored wishlist directly as an array
            const parsedWishlist = storedWishlist ? JSON.parse(storedWishlist) : [];
            console.log("Parsed wishlist:", parsedWishlist);
            setWishlist(parsedWishlist);
        } catch (error) {
            console.error("Error loading wishlist from localStorage:", error);
            setWishlist([]);
        }
    };

    // Add item to wishlist
    const addToWishlist = (product) => {
        try {
            console.log("Adding product to wishlist:", product);
            
            if (!product?.product_id) {
                console.error("Invalid product data:", product);
                return {
                    success: false,
                    message: "Invalid product data",
                    error: "Missing product ID"
                };
            }

            const newItem = {
                product_id: product.product_id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1,
                stock: product.stock || 0,
                added_at: new Date().toISOString()
            };

            // Get current wishlist from state
            const currentWishlist = [...wishlist];
            console.log("Current wishlist:", currentWishlist);
            console.log("New item to add:", newItem);

            const isItemExist = currentWishlist.some(item => item.product_id === newItem.product_id);
            console.log("Item exists?", isItemExist);

            let newWishlist;
            if (isItemExist) {
                newWishlist = currentWishlist.filter(item => item.product_id !== newItem.product_id);
                console.log("Removing item, new wishlist:", newWishlist);
            } else {
                newWishlist = [...currentWishlist, newItem];
                console.log("Adding item, new wishlist:", newWishlist);
            }

            // Update state and localStorage
            setWishlist(newWishlist);
            localStorage.setItem("wishlist", JSON.stringify(newWishlist));

            return {
                success: true,
                message: isItemExist 
                    ? `${product.name} removed from wishlist`
                    : `${product.name} added to wishlist`,
                action: isItemExist ? 'removed' : 'added'
            };
        } catch (error) {
            console.error("Error in addToWishlist:", error);
            return {
                success: false,
                message: "Failed to update wishlist",
                error: error.message
            };
        }
    };

    // Remove item from wishlist
    const removeFromWishlist = (productId) => {
        try {
            const newWishlist = wishlist.filter(item => item.product_id !== productId);
            setWishlist(newWishlist);
            localStorage.setItem("wishlist", JSON.stringify(newWishlist));
            return {
                success: true,
                message: "Item removed from wishlist"
            };
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return {
                success: false,
                message: "Failed to remove item",
                error: error.message
            };
        }
    };

    // Clear all items from wishlist
    const clearWishlist = () => {
        try {
            setWishlist([]);
            localStorage.setItem("wishlist", JSON.stringify([]));
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Wishlist cleared successfully!',
                showConfirmButton: false,
                timer: 1500
            });
            return {
                success: true,
                message: "Wishlist cleared successfully"
            };
        } catch (error) {
            console.error("Error clearing wishlist:", error);
            return {
                success: false,
                message: "Failed to clear wishlist",
                error: error.message
            };
        }
    };

    // Check if item is in wishlist
    const isInWishlist = (productId) => {
        return wishlist.some(item => item.product_id === productId);
    };

    return (
        <WishListContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist
        }}>
            {children}
        </WishListContext.Provider>
    );
};

export default WishListContext;