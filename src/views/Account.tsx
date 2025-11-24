"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Package, Heart, Settings, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, UserProfile } from "@/lib/api";
import { toast } from "sonner";

const Account = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }

    fetchProfile();
  }, [isAuthenticated, router]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.profile.getMyProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
      setEditDialogOpen(true);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      const response = await api.profile.updateProfile(editData);
      
      if (response.success && response.data) {
        setProfile(response.data);
        setEditDialogOpen(false);
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={fetchProfile} variant="outline">
                      Retry
                    </Button>
                  </div>
                ) : profile ? (
                  <>
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <p className="text-muted-foreground">{profile.first_name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <p className="text-muted-foreground">{profile.last_name || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-muted-foreground">{profile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-muted-foreground">{profile.phone || "Not provided"}</p>
                    </div>
                    {profile.address && (
                      <div>
                        <label className="text-sm font-medium">Address</label>
                        <p className="text-muted-foreground">{profile.address}</p>
                      </div>
                    )}
                    {(profile.city || profile.state || profile.zip_code) && (
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <p className="text-muted-foreground">
                          {[profile.city, profile.state, profile.zip_code].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}
                    {profile.country && (
                      <div>
                        <label className="text-sm font-medium">Country</label>
                        <p className="text-muted-foreground">{profile.country}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <p className="text-muted-foreground">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={handleEditProfile}>Edit Profile</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                          <DialogDescription>
                            Update your profile information
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-first-name">First Name</Label>
                            <Input
                              id="edit-first-name"
                              type="text"
                              value={editData.first_name}
                              onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-last-name">Last Name</Label>
                            <Input
                              id="edit-last-name"
                              type="text"
                              value={editData.last_name}
                              onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-phone">Phone</Label>
                            <Input
                              id="edit-phone"
                              type="tel"
                              value={editData.phone}
                              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                              placeholder="01712345678"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-address">Address</Label>
                            <Input
                              id="edit-address"
                              type="text"
                              value={editData.address}
                              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                              placeholder="Your address"
                            />
                          </div>
                          <div className="flex gap-3 justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setEditDialogOpen(false)}
                              disabled={editLoading}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={editLoading}>
                              {editLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No profile data available</p>
                  </div>
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
                <p className="text-muted-foreground mb-4">
                  View and manage your saved items
                </p>
                <Button asChild>
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
