"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { userService } from "@/services/api";
import { ChevronDown, Mail, MapPin, Ticket, User } from "lucide-react";
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
  const [_isPending, startTransition] = useTransition();
  const [visitUsText, setVisitUsText] = useState(TEXT_OPTIONS[0].visitUs);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isVisible, setIsVisible] = useState(true);
  const [userType, setUserType] = useState<string | undefined>(undefined);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { items: cartItems, getTotalPrice } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const cartCount = cartItems.length;
  const cartTotal = getTotalPrice();

  // Fetch user profile to get user_type
  useEffect(() => {
    const fetchUserType = async () => {
      if (isAuthenticated) {
        try {
          // Check if token exists before making the request
          const token = typeof window !== "undefined" ? localStorage.getItem("hometex-auth-token") : null;
          if (!token) {
            console.warn("[PreHeader] User is authenticated but no token found in localStorage");
            setUserType(undefined);
            return;
          }

          const profileResponse = await userService.getProfile();
          setUserType(profileResponse.user?.user_type);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // If fetching profile fails, user might not be authenticated anymore
          setUserType(undefined);
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
    <div className="hidden md:block bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200 transition-all duration-300">
      <div className="container py-2 w-full mx-auto">
        <div className="flex justify-between items-center">
          {/* Left Section - Account & Corporate */}
          <div className="flex items-center space-x-6 ml-2 w-1/4">
            {/* My Account Dropdown */}
            <div
              className="relative z-[110]"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/account"
                className="flex items-center cursor-pointer hover:text-blue-600 group transition-all duration-200"
              >
                <div className="bg-black group-hover:bg-blue-600 rounded-full p-1.5 mr-2 transition-all duration-200 shadow-sm">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm whitespace-nowrap font-medium text-black group-hover:text-blue-600">
                    {accountLabel}
                  </span>
                  {userType && (
                    <span className="text-[10px] text-black capitalize font-medium leading-tight">
                      {userType}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3.5 h-3.5 ml-1 text-black group-hover:text-blue-600 group-hover:translate-y-0.5 transition-all duration-200" />
              </Link>

              {isAccountDropdownOpen && (
                <div className="absolute top-full left-0 bg-white text-black rounded-xl shadow-lg border border-slate-200 z-[120] w-52 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Triangle Arrow */}
                  <div className="absolute -top-2 left-6 w-4 h-4 bg-white transform rotate-45 border-l border-t border-slate-200"></div>

                  {/* Account Menu Items */}
                  <ul className="py-2 relative bg-white rounded-xl text-sm">
                    <li className="group">
                      {isAuthenticated ? (
                        <>
                          <Link
                            href="/account"
                            className="block px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-primary/5 transition-colors duration-150"
                          >
                            <div className="text-sm font-medium">{tAccount("viewAccount")}</div>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2.5 text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                          >
                            {tAccount("logout")}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleLoginClick}
                          className="block w-full text-left px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-primary/5 transition-colors duration-150 font-medium"
                        >
                          {tAccount("signUpLogin")}
                        </button>
                      )}
                    </li>

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* Currency Dropdown Item */}
                    <li
                      className="relative group"
                      onMouseEnter={() => setIsCurrencyDropdownOpen(true)}
                      onMouseLeave={() => setIsCurrencyDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-primary/5 cursor-pointer flex justify-between items-center transition-colors duration-150">
                        <span className="text-sm">{t("currency")}</span>
                        <span className="font-semibold text-primary text-sm">
                          {selectedCurrency}
                        </span>
                      </div>
                      {isCurrencyDropdownOpen && (
                        <div className="absolute left-full top-0 bg-white shadow-lg rounded-xl w-32 -mr-1 transform translate-x-2 border border-slate-200 z-[130] animate-in fade-in slide-in-from-left-2 duration-200">
                          <div className="absolute -left-2 top-3 w-4 h-4 bg-white transform rotate-45 border-l border-t border-slate-200"></div>
                          <ul className="py-2 relative bg-white rounded-xl">
                            {["USD", "GBP", "BDT"].map((currency) => (
                              <li
                                key={currency}
                                className="px-4 py-2 text-slate-700 hover:text-primary hover:bg-primary/5 cursor-pointer text-sm font-medium transition-colors duration-150"
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
                        className="block px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-primary/5 transition-colors duration-150"
                      >
                        <span className="text-sm">{tAccount("myRewards")}</span>
                      </Link>
                    </li>

                    {/* Language Dropdown Item */}
                    <li
                      className="relative group"
                      onMouseEnter={() => setIsLanguageDropdownOpen(true)}
                      onMouseLeave={() => setIsLanguageDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-primary/5 cursor-pointer flex justify-between items-center transition-colors duration-150">
                        <span className="text-sm">{t("language")}</span>
                        <span className="font-semibold text-primary text-sm">
                          {locale === "en" ? "EN" : "বাং"}
                        </span>
                      </div>
                      {isLanguageDropdownOpen && (
                        <div className="absolute left-full top-0 bg-white shadow-lg rounded-xl w-40 -mr-1 transform translate-x-2 border border-slate-200 z-[130] animate-in fade-in slide-in-from-left-2 duration-200">
                          <div className="absolute -left-2 top-3 w-4 h-4 bg-white transform rotate-45 border-l border-t border-slate-200"></div>
                          <ul className="py-2 relative bg-white rounded-xl">
                            <li
                              className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-150 ${
                                locale === "en"
                                  ? "text-primary bg-primary/10"
                                  : "text-slate-700 hover:text-primary hover:bg-primary/5"
                              }`}
                              onClick={() => handleLanguageChange("en")}
                            >
                              English
                            </li>
                            <li
                              className={`px-4 py-2 cursor-pointer text-sm font-medium transition-colors duration-150 ${
                                locale === "bn"
                                  ? "text-primary bg-primary/10"
                                  : "text-slate-700 hover:text-primary hover:bg-primary/5"
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
            <Link
              href="/corporate-enquires"
              className="flex items-center hover:text-blue-600 group transition-all duration-200"
            >
              <div className="bg-black group-hover:bg-blue-600 rounded-full p-1.5 mr-2 transition-all duration-200 shadow-sm">
                <Mail className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm whitespace-nowrap font-medium text-black group-hover:text-blue-600">
                {t("corporateInquiries")}
              </span>
            </Link>
          </div>

          {/* Center Section - Dynamic Text */}
          <div className="flex items-center justify-center mx-auto w-auto">
            <div className="flex items-center space-x-3">
              <span className="px-4 py-1.5 text-xs text-white font-semibold bg-gradient-to-r from-primary to-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                {visitUsText}
              </span>
              <div className="text-sm font-bold text-slate-700">
                <p className="transition-opacity duration-500 ease-in-out">
                  {TEXT_OPTIONS[currentTextIndex].main}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Store Locator, Tracking & Cart */}
          <div className="flex items-center justify-end gap-5 mr-2 w-1/4">
            {/* Store Locator */}
            <Link
              href="/stores"
              className="flex items-center hover:text-blue-600 whitespace-nowrap cursor-pointer group transition-all duration-200"
            >
              <div className="bg-black group-hover:bg-blue-600 rounded-full p-1.5 mr-1.5 transition-all duration-200 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-black group-hover:text-blue-600">
                {tNav("stores")}
              </span>
            </Link>

            {/* Order Tracking */}
            <Link
              href={isAuthenticated ? "/account?tab=orders" : "/auth"}
              className="flex items-center hover:text-blue-600 whitespace-nowrap cursor-pointer group transition-all duration-200"
            >
              <div className="bg-black group-hover:bg-blue-600 rounded-full p-1.5 mr-1.5 transition-all duration-200 shadow-sm">
                <Ticket className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-black group-hover:text-blue-600">
                {t("orderTracking")}
              </span>
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="group flex items-center gap-2 hover:text-blue-600 whitespace-nowrap cursor-pointer transition-all duration-200"
            >
              {/* Cart Icon with Badge */}
              <div className="relative group-hover:translate-x-1 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-black group-hover:text-blue-600 transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md ring-2 ring-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>

              {/* Cart Text */}
              <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm font-bold text-black group-hover:text-blue-600 leading-tight transition-colors duration-300">
                  {t("cart")}
                </span>
                <span className="text-xs font-bold text-black group-hover:text-blue-600 leading-tight transition-colors duration-300">
                  ৳{cartTotal.toLocaleString()}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreHeader;
