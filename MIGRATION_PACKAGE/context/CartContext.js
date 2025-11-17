"use client";
import { createContext, useState, useEffect } from "react";
import Swal from 'sweetalert2';

const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCartToState();
  }, []);

  const setCartToState = () => {
    setCart(localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []);
  };

  // add or update item in cart 
  const addItemToCart = async ({ product_id, name, category, categoryName, sub_category, sub_categoryName, child_sub_category, child_sub_categoryName, price, image, in_stock, supplier_id, quantity = 1, sku, total_price }) => {
    const item = {
      product_id, name, category, categoryName, sub_category, sub_categoryName, child_sub_category, child_sub_categoryName, price, image, in_stock, supplier_id, quantity, sku, total_price
    };
    // Check item exist or not 
    // if item exist update item or add new item 
    const isItemExist = cart?.cartItems?.find(
      (i) => i.product_id === item.product_id
    );
    let newCartItems;
    if (isItemExist) {
      newCartItems = cart?.cartItems?.map((i) =>
        i.product_id === isItemExist.product_id ? item : i
      );
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Updated quantity for ${name}.`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      newCartItems = [...(cart?.cartItems || []), item];
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Added ${name} to your cart.`,
        showConfirmButton: false,
        timer: 1500
      });
    }

    localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
    setCartToState();
  };

  // Add multiple items to cart
  const addMultipleItemsToCart = async (items) => {
    let newCartItems = [...(cart?.cartItems || [])];
    let addedCount = 0;

    items.forEach(item => {
      const isItemExist = newCartItems.find(i => i.product_id === item.product_id);
      if (!isItemExist) {
        newCartItems.push({
          product_id: item.product_id,
          name: item.name,
          category: item.category,
          categoryName: item.categoryName,
          sub_category: item.sub_category,
          sub_categoryName: item.sub_categoryName,
          child_sub_category: item.child_sub_category,
          child_sub_categoryName: item.child_sub_categoryName,
          price: item.price,
          image: item.image,
          in_stock: item.in_stock,
          supplier_id: item.supplier_id,
          quantity: 1,
          sku: item.sku,
          total_price: item.price
        });
        addedCount++;
      }
    });

    localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
    setCartToState();

    if (addedCount > 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `${addedCount} products added to cart successfully!`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'All items are already in your cart!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  //  remove item from cart 
  const deleteItemFromCart = (id) => {
    const newCartItems = cart?.cartItems?.filter((i) => i.product_id !== id);
    localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
    setCartToState();
  };

  // Remove all items from cart
  const clearCart = () => {
    localStorage.setItem("cart", JSON.stringify({ cartItems: [] }));
    setCartToState();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Cart cleared successfully!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, addMultipleItemsToCart, deleteItemFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;