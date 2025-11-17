// CartComponent.js
import React, { useEffect, useContext } from 'react';
import { HiShoppingCart } from 'react-icons/hi';
import { AiTwotoneDelete } from 'react-icons/ai';
import Link from 'next/link';
import { FaTrashAlt, FaShoppingCart, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/router';
import CartContext from '@/context/CartContext';

const CartComponent = ({
  cartRef,
  handleCartClick,
  cartItems,
  isOpen,
  cart,
  deleteItemFromCart,
  totalPrice,
  handleCheckout
}) => {
  const { clearCart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target) && isOpen) {
        handleCartClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleCartClick]);

   // Function to handle checkout
   const handleCheckoutClick = () => {
    // Use router.push instead of redirect
    router.push('/Checkout');
    // Close the cart popup
    handleCartClick();
  };

  const handleRemoveAll = () => {
    clearCart();
    handleCartClick(); // Close the cart after clearing
  };

  return (
    <div className="relative z-[9999]">
      {isOpen && (
        <>
          {/* Solid overlay instead of transparent */}
          <div 
            className="fixed inset-0 bg-gray-900 opacity-50 transition-opacity duration-300"
            onClick={handleCartClick}
          />
          
          {/* Cart Panel with enhanced animation */}
          <div className="fixed inset-y-0 right-0 w-96 z-[9999] shadow-2xl bg-[rgba(51,51,51,0.6)] backdrop-blur-sm text-white overflow-hidden animate-slide-in transform transition-all duration-300 ease-out">
            <div className="flex justify-between items-center p-4 border-b border-gray-600">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              <button
                onClick={handleCartClick}
                className="text-gray-400 hover:text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items with stagger animation */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <table className="w-full">
                <tbody>
                  {cart?.cartItems?.length > 0 ? (
                    cart.cartItems.map((cartItem, index) => (
                      <tr key={cartItem.product_id} 
                        className="border-b border-gray-600 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="py-4 pl-4">
                          <img
                            src={cartItem.image}
                            alt={cartItem.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-md"
                          />
                        </td>
                        <td className="px-2 py-4">{cartItem.name}</td>
                        <td className="px-2 py-4">{cartItem.quantity}</td>
                        <td className="px-2 py-4">BDT {cartItem.price}</td>
                        <td className="px-2 py-4">
                          <button
                            className="text-red-400 hover:text-red-600 transition-colors duration-200"
                            onClick={() => deleteItemFromCart(cartItem.product_id)}
                          >
                            <FaTrashAlt size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-600">
                      <td colSpan="5" className="text-center py-4">Your cart is empty.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom section with slide-up animation */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="p-3 border-t border-gray-600">
                <div className="text-lg font-semibold mb-3 text-right">
                  Total: BDT {totalPrice}
                </div>
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={handleRemoveAll}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white py-1.5 px-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
                  >
                    <FaTrashAlt className="text-white" />
                    Remove All
                  </button>
                  <Link href="/cart">
                    <button className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-1.5 px-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm">
                      <FaEye className="text-white" />
                      View Cart
                    </button>
                  </Link>
                  <button
                    onClick={handleCheckoutClick}
                    className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-1.5 px-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
                  >
                    <FaShoppingCart className="text-white" />
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartComponent;
