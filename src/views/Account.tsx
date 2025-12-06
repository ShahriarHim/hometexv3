"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/api";
import { Heart, Loader2, Package, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  [key: string]: string | undefined;
}

const Account = () => {
  const { isAuthenticated, user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      // Debug log
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("Auth State - isAuthenticated:", isAuthenticated, "user:", user);
        const token = localStorage.getItem("hometex-auth-token");
        // eslint-disable-next-line no-console
        console.log("LocalStorage token:", token ? `${token.substring(0, 20)}...` : "null");
        // eslint-disable-next-line no-console
        console.log("LocalStorage user:", localStorage.getItem("hometex-user"));
      }

      // Wait for auth to be checked
      if (!isAuthenticated) {
        setError("Please login to view your profile");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use the new userService to fetch profile
        const response = await userService.getProfile();

        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("Profile data received:", response);
        }

        // Map the API response to our UserProfile interface
        const userData = response.user;
        const mappedProfile: UserProfile = {
          name: userData.name || `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
          email: userData.email,
          phone: userData.phone,
          address: userData.address || response.addresses?.[0]?.address || undefined,
        };

        setUserProfile(mappedProfile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");

        // If 401 error, clear local storage
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("hometex-auth-token");
          localStorage.removeItem("hometex-user");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading profile...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                  </div>
                ) : userProfile ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-muted-foreground">{userProfile.name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-muted-foreground">{userProfile.email || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-muted-foreground">{userProfile.phone || "Not provided"}</p>
                    </div>
                    {userProfile.address && (
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <p className="text-muted-foreground">{userProfile.address}</p>
                      </div>
                    )}
                    <Button>Edit Profile</Button>
                  </>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No profile data available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  No orders yet. Start shopping to see your orders here.
                </p>
                <Button asChild className="w-full">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">View and manage your saved items</p>
                <Button asChild>
                  {/* @ts-expect-error - Route type issue */}
                  <Link href="/account/wishlist">View Wishlist</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Preferences</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your account preferences
                  </p>
                  <Button variant="outline">Manage Preferences</Button>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Security</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Change password and security settings
                  </p>
                  <Button variant="outline">Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
