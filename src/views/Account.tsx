"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AccountTabs } from "./Account/AccountTabs";
import { PreferencesDialog } from "./Account/PreferencesDialog";
import { useAccountData } from "./Account/useAccountData";

const Account = () => {
  const {
    activeTab,
    userProfile,
    isLoading,
    error,
    orders,
    ordersLoading,
    ordersError,
    ordersFetched,
    trackingStatus,
    trackingLoading,
    isPreferencesOpen,
    preferences,
    isAuthenticated,
    handleTabChange,
    handleTrack,
    handlePreferencesChange,
    handleSavePreferences,
    setIsPreferencesOpen,
  } = useAccountData();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <AccountTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isLoading={isLoading}
          error={error}
          userProfile={userProfile}
          orders={orders}
          ordersLoading={ordersLoading}
          ordersError={ordersError}
          ordersFetched={ordersFetched}
          trackingStatus={trackingStatus}
          trackingLoading={trackingLoading}
          onTrack={handleTrack}
          onOpenPreferences={() => setIsPreferencesOpen(true)}
        />
      </main>
      <Footer />

      <PreferencesDialog
        isOpen={isPreferencesOpen}
        preferences={preferences}
        onOpenChange={setIsPreferencesOpen}
        onPreferenceChange={handlePreferencesChange}
        onSave={handleSavePreferences}
      />
    </div>
  );
};

export default Account;
