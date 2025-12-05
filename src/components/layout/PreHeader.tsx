"use client";

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Link } from '@/i18n/routing';
import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronDown, User, Mail, Ticket, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

// Dynamic Text Component logic inline to avoid extra files for now
const TEXT_OPTIONS = [
  {
    main: "Bed Set | Duvet | Duvet Cover",
    visitUs: "Eid Collection",
  },
  {
    main: "100 + Designs Added",
    visitUs: "Happy Shopping",
  },
  {
    main: "Available in Stores & Online",
    visitUs: "Luxury Bedding",
  },
];

const PreHeader = () => {
  const t = useTranslations("common");
  const tAccount = useTranslations("account");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [visitUsText, setVisitUsText] = useState(TEXT_OPTIONS[0].visitUs);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isVisible, setIsVisible] = useState(true);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { items: cartItems, getTotalPrice } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = cartItems.length;

  // Scroll handler to hide PreHeader on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Text Interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTextIndex((prev) => {
        const next = (prev + 1) % TEXT_OPTIONS.length;
        setVisitUsText(TEXT_OPTIONS[next].visitUs);
        return next;
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  // Dropdown Handlers
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsAccountDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsAccountDropdownOpen(false);
    }, 300);
  };

  const handleCurrencyChange = (currency: string) => {
      setSelectedCurrency(currency);
      localStorage.setItem('selectedCurrency', currency);
      setIsCurrencyDropdownOpen(false);
      setIsAccountDropdownOpen(false);
  };

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
    setIsLanguageDropdownOpen(false);
    setIsAccountDropdownOpen(false);
  };

  const handleLoginClick = () => {
    router.push('/auth');
    setIsAccountDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsAccountDropdownOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="hidden md:block bg-[#d4ed30] pt-1 transition-all duration-300">
      <div className="container pb-1 w-full mx-auto">
        <div className="flex justify-between items-center">
          
          {/* Left Section - Account & Corporate */}
          <div className="flex items-center space-x-8 ml-2 w-1/4">
             {/* My Account Dropdown */}
             <div 
                className="relative z-[160]"
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
            >
                <Link href="/account" className="flex items-center cursor-pointer hover:text-blue-500 pl-4">
                    <User className="w-4 h-4 text-pink-500 mr-1" />
                    <span className="text-xs whitespace-nowrap">{t("account")}</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                </Link>

                {isAccountDropdownOpen && (
                    <div className="absolute top-full left-0 bg-white text-black rounded-lg shadow-2xl z-[200] w-48 mt-1">
                        {/* Triangle Arrow */}
                        <div className="absolute -top-2 left-4 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                        
                        {/* Account Menu Items */}
                        <ul className="py-1 relative bg-white rounded-lg text-sm">
                            <li className="group">
                                {isAuthenticated ? (
                                    <>
                                        <Link 
                                            href="/account"
                                            className="block px-4 py-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            <div className="font-medium text-sm">{user?.name || "User"}</div>
                                            <div className="text-xs text-gray-500">{tAccount("viewAccount")}</div>
                                        </Link>
                                        <Link 
                                            href="/account/orderDash"
                                            className="block px-4 py-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                        >
                                            {t("orderTracking")}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-1.5 text-gray-700 hover:text-red-600 hover:bg-red-50"
                                        >
                                            {tAccount("logout")}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleLoginClick}
                                        className="block w-full text-left px-4 py-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        {tAccount("signUpLogin")}
                                    </button>
                                )}
                            </li>
                            
                            <div className="border-t border-gray-100"></div>
                            
                            {/* Currency Dropdown Item */}
                            <li 
                                className="relative group"
                                onMouseEnter={() => setIsCurrencyDropdownOpen(true)}
                                onMouseLeave={() => setIsCurrencyDropdownOpen(false)}
                            >
                                <div className="px-4 py-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 cursor-pointer flex justify-between items-center">
                                    <span>{t("currency")}</span>
                                    <span className="font-medium">{selectedCurrency}</span>
                                </div>
                                {isCurrencyDropdownOpen && (
                                    <div className="absolute left-full top-0 bg-white shadow-xl rounded-lg w-28 -mr-1 transform translate-x-2 border border-gray-100 z-[200]">
                                        <div className="absolute -left-2 top-3 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                                        <ul className="py-1 relative bg-white rounded-lg">
                                            {['USD', 'GBP', 'BDT'].map((currency) => (
                                                <li 
                                                    key={currency}
                                                    className="px-3 py-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                                                    onClick={() => handleCurrencyChange(currency)}
                                                >
                                                    {currency}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>

                            <li className="group">
                                <Link 
                                    href="/my-rewards"
                                    className="block px-4 py-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                >
                                    {tAccount("myRewards")}
                                </Link>
                            </li>
                            
                            {/* Language Dropdown Item */}
                            <li 
                                className="relative group"
                                onMouseEnter={() => setIsLanguageDropdownOpen(true)}
                                onMouseLeave={() => setIsLanguageDropdownOpen(false)}
                            >
                                <div className="px-4 py-1.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 cursor-pointer flex justify-between items-center">
                                    <span>{t("language")}</span>
                                    <span className="font-medium">{locale === 'en' ? 'EN' : 'বাং'}</span>
                                </div>
                                {isLanguageDropdownOpen && (
                                    <div className="absolute left-full top-0 bg-white shadow-xl rounded-lg w-32 -mr-1 transform translate-x-2 border border-gray-100 z-[200]">
                                        <div className="absolute -left-2 top-3 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                                        <ul className="py-1 relative bg-white rounded-lg">
                                            <li 
                                                className={`px-3 py-1.5 cursor-pointer ${
                                                    locale === 'en' 
                                                        ? 'text-blue-600 bg-blue-50 font-medium' 
                                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                }`}
                                                onClick={() => handleLanguageChange('en')}
                                            >
                                                English
                                            </li>
                                            <li 
                                                className={`px-3 py-1.5 cursor-pointer ${
                                                    locale === 'bn' 
                                                        ? 'text-blue-600 bg-blue-50 font-medium' 
                                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                                }`}
                                                onClick={() => handleLanguageChange('bn')}
                                            >
                                                বাংলা (Bengali)
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Corporate Inquiries */}
            <Link 
                href="/corporate-enquires"
                className="flex items-center hover:text-blue-500"
            >
                <Mail className="w-4 h-4 text-pink-500 mr-1" />
                <span className="text-xs whitespace-nowrap">{t("corporateInquiries")}</span>
            </Link>
          </div>

          {/* Center Section - Dynamic Text */}
          <div className="flex items-center justify-center mx-auto w-auto">
            <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-xs text-white font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                    {visitUsText}
                </span>
                <div className="text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 transition-all duration-300 ease-in-out">
                    <p className="transition-opacity duration-500 ease-in-out">
                        {TEXT_OPTIONS[currentTextIndex].main}
                    </p>
                </div>
            </div>
          </div>

          {/* Right Section - Tracking & Cart */}
          <div className="flex items-center justify-end gap-3 mr-2 w-1/4">
             {/* Order Tracking */}
             <div 
                className="flex items-center hover:text-blue-500 whitespace-nowrap mr-8 cursor-pointer"
            >
                <Ticket className="w-4 h-4 text-pink-500 mr-1" />
                <span className="text-xs">
                    {isAuthenticated ? (
                        <Link href="/account/orderDash">{t("orderTracking")}</Link>
                    ) : (
                        t("orderTracking")
                    )}
                </span>
            </div>

            {/* My Cart Button - Styled exactly like V2 */}
            <Link href="/cart">
                <div className="relative bg-black text-white px-4 py-4 -mt-1 flex items-center cursor-pointer hover:text-yellow-500 transition-colors duration-200 z-[160] mr-2">
                    <ShoppingCart className="w-4 h-4 text-pink-500 mr-2" />
                    <span className="text-xs whitespace-nowrap">{t("cart")}</span>
                    
                    {/* Triangle decorations at bottom */}
                    <div className="absolute bottom-[-12px] left-0 right-0 h-3 overflow-visible z-[155]">
                        <div className="flex justify-center">
                            {[...Array(12)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="w-2.5 h-3 bg-black" 
                                    style={{ 
                                        clipPath: 'polygon(50% 100%, 0 0, 100% 0)', 
                                        marginTop: '-1px', 
                                        marginLeft: '0.5px', 
                                        marginRight: '0.5px' 
                                    }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreHeader;

