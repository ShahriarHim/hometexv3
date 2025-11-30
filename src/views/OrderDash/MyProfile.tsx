"use client";

import React, { useState, useEffect } from "react";
import { api, type UserProfile } from "@/lib/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const MyProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError(null);
      const response = await api.profile.getMyProfile();
      
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch profile");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to load profile";
      setProfileError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProfileLoading(false);
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

  return (
    <div>
      {profileLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : profileError ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{profileError}</p>
          <Button onClick={fetchProfile} variant="outline">
            Retry
          </Button>
        </div>
      ) : profile ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <p className="text-gray-900 font-semibold">{profile.first_name || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <p className="text-gray-900 font-semibold">{profile.last_name || "Not provided"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 font-semibold">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <p className="text-gray-900 font-semibold">{profile.phone || "Not provided"}</p>
            </div>
            {profile.address && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900 font-semibold">{profile.address}</p>
              </div>
            )}
            {(profile.city || profile.state || profile.zip_code) && (
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-gray-900 font-semibold">
                  {[profile.city, profile.state, profile.zip_code].filter(Boolean).join(", ")}
                </p>
              </div>
            )}
            {profile.country && (
              <div>
                <label className="text-sm font-medium text-gray-700">Country</label>
                <p className="text-gray-900 font-semibold">{profile.country}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Member Since</label>
              <p className="text-gray-900 font-semibold">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="pt-4">
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
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No profile data available</p>
        </div>
      )}
    </div>
  );
};

