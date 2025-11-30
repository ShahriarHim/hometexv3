"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useRouter } from "@/i18n/routing";
import {
  FaClipboardList,
  FaShippingFast,
  FaUserCircle,
  FaQuestionCircle,
  FaHome,
  FaShoppingBag,
  FaUser,
  FaBell,
  FaBoxOpen,
} from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { OrderTracking } from "./OrderDash/OrderTracking";
import { MyProfile } from "./OrderDash/MyProfile";
import { MyOrders } from "./OrderDash/MyOrders";
import { RequestedOffers } from "./OrderDash/RequestedOffers";
import { PriceDropAlerts } from "./OrderDash/PriceDropAlerts";
import { RestockRequests } from "./OrderDash/RestockRequests";

type ActiveSection = "orderTracking" | "profile" | "orders" | "offers" | "priceDrop" | "restock";

interface SidebarProps {
  activeSection: ActiveSection;
  onSectionChange: (section: ActiveSection) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const { logout } = useAuth();
  const router = useRouter();

  const signOutSubmitHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    router.push("/");
  };

  const menuItems = [
    { id: "orderTracking" as ActiveSection, icon: FaClipboardList, label: "Order tracking" },
    { id: "profile" as ActiveSection, icon: FaUser, label: "My Profile" },
    { id: "orders" as ActiveSection, icon: FaShoppingBag, label: "My Orders" },
    { id: "offers" as ActiveSection, icon: FaClipboardList, label: "Requested Offers List" },
    { id: "priceDrop" as ActiveSection, icon: FaBell, label: "Price Drop Alerts" },
    { id: "restock" as ActiveSection, icon: FaBoxOpen, label: "Restock Requests" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-5 flex-shrink-0">
      <div className="flex flex-col gap-3">
        <div className="mb-10 px-10">
          <img
            src="/images/hometex-logo.png"
            alt="Hometex Bangladesh"
            className="mx-auto"
          />
        </div>
        <Link href="/">
          <div className="flex flex-row items-center gap-3 px-4 py-3 text-white hover:text-black text-md hover:scale-110 font-semibold rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <FaHome /> <span>Home</span>
          </div>
        </Link>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-row items-center gap-3 px-4 py-3 text-md hover:scale-110 font-semibold rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-gray-100 text-black shadow-lg"
                  : "text-white hover:text-black hover:bg-gray-100"
              }`}
            >
              <Icon /> <span>{item.label}</span>
            </div>
          );
        })}
        <div
          onClick={signOutSubmitHandler}
          className="mt-auto flex flex-row items-center gap-3 px-4 py-3 text-white hover:text-black text-md hover:scale-110 font-semibold rounded-lg hover:bg-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <RiLogoutBoxRLine /> <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

const OrderDash = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ActiveSection>("orderTracking");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "orderTracking":
        return <OrderTracking />;
      case "profile":
        return <MyProfile />;
      case "orders":
        return <MyOrders />;
      case "offers":
        return <RequestedOffers />;
      case "priceDrop":
        return <PriceDropAlerts />;
      case "restock":
        return <RestockRequests />;
      default:
        return <OrderTracking />;
    }
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "orderTracking":
        return "Order Tracking";
      case "profile":
        return "My Profile";
      case "orders":
        return "My Orders";
      case "offers":
        return "Requested Offers List";
      case "priceDrop":
        return "Price Drop Alerts";
      case "restock":
        return "Restock Requests";
      default:
        return "Order Tracking";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1 bg-gray-50">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md">
              <div className="card">
                <div className="card-header bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-lg">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {getSectionTitle()}
                  </h2>
                  <p className="text-gray-100 text-sm">
                    Manage your account and orders
                  </p>
                </div>
                <div className="p-6">{renderContent()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderDash;
