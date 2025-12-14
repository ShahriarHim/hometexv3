"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { userService } from "@/services/api";
import { ChevronDown, Mail, MapPin, ShoppingBag, Ticket, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

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
  const tNav = useTranslations("navigation");
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
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isVisible, setIsVisible] = useState(true);
  const [userType, setUserType] = useState<string | undefined>(undefined);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { getTotalItems, getTotalPrice } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = getTotalItems();
  const cartTotal = getTotalPrice();

  // Fetch user profile to get user_type
  useEffect(() => {
    const fetchUserType = async () => {
      if (isAuthenticated) {
        try {
          const profileResponse = await userService.getProfile();
          setUserType(profileResponse.user?.user_type);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        setUserType(undefined);
      }
    };

    fetchUserType();
  }, [isAuthenticated]);

  const accountLabel = isAuthenticated && user?.name ? user.name : t("account");

  // Scroll handler to hide PreHeader on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    localStorage.setItem("selectedCurrency", currency);
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
    router.push("/auth");
    setIsAccountDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsAccountDropdownOpen(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="hidden md:block bg-primary pt-1 transition-all duration-300">
      <div className="container pb-1 w-full mx-auto">
        <div className="flex justify-between items-center">
          {/* Left Section - Account & Corporate */}
          <div className="flex items-center space-x-6 ml-2 w-1/4">
            {/* My Account Dropdown */}
            <div
              className="relative z-[160]"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/account"
                className="flex flex-col cursor-pointer hover:text-blue-500 group transition-colors pl-2"
              >
                <div className="flex items-center">
                  <div className="bg-pink-500 group-hover:bg-blue-500 rounded-full p-1 mr-1.5 transition-colors">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs whitespace-nowrap font-medium">{accountLabel}</span>
                  <ChevronDown className="w-3 h-3 ml-1 group-hover:translate-y-0.5 transition-transform" />
                </div>
                {userType && (
                  <span className="text-[10px] text-gray-600 ml-[26px] capitalize">{userType}</span>
                )}
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
                            <div className="text-xs text-gray-500">{tAccount("viewAccount")}</div>
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
                            {["USD", "GBP", "BDT"].map((currency) => (
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
                        <span className="font-medium">{locale === "en" ? "EN" : "বাং"}</span>
                      </div>
                      {isLanguageDropdownOpen && (
                        <div className="absolute left-full top-0 bg-white shadow-xl rounded-lg w-32 -mr-1 transform translate-x-2 border border-gray-100 z-[200]">
                          <div className="absolute -left-2 top-3 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>
                          <ul className="py-1 relative bg-white rounded-lg">
                            <li
                              className={`px-3 py-1.5 cursor-pointer ${
                                locale === "en"
                                  ? "text-blue-600 bg-blue-50 font-medium"
                                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                              onClick={() => handleLanguageChange("en")}
                            >
                              English
                            </li>
                            <li
                              className={`px-3 py-1.5 cursor-pointer ${
                                locale === "bn"
                                  ? "text-blue-600 bg-blue-50 font-medium"
                                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                              onClick={() => handleLanguageChange("bn")}
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
            <Link href="/corporate-enquires" className="flex items-center hover:text-blue-500 group transition-colors">
              <div className="bg-pink-500 group-hover:bg-blue-500 rounded-full p-1 mr-1.5 transition-colors">
                <Mail className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs whitespace-nowrap font-medium">{t("corporateInquiries")}</span>
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

          {/* Right Section - Store Locator, Tracking & Cart */}
          <div className="flex items-center justify-end gap-4 mr-2 w-1/4">
            {/* Store Locator */}
            <Link href="/stores" className="flex items-center hover:text-blue-500 whitespace-nowrap cursor-pointer group">
              <MapPin className="w-4 h-4 text-pink-500 mr-1 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs">{tNav("stores")}</span>
            </Link>

            {/* Order Tracking */}
            <Link href={isAuthenticated ? "/account?tab=orders" : "/auth"} className="flex items-center hover:text-blue-500 whitespace-nowrap cursor-pointer group">
              <Ticket className="w-4 h-4 text-pink-500 mr-1 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs">{t("orderTracking")}</span>
            </Link>

            {/* Modern Cart Button */}
            <Link href="/cart">
              <div className="relative group">
                <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] leading-none opacity-90">{t("cart")}</span>
                    <span className="text-xs font-bold leading-none mt-0.5">
                      ৳{cartTotal.toLocaleString()}
                    </span>
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
