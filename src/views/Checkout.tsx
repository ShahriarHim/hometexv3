"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrders, type ApiErrorResponse } from "@/context/OrderContext";
import { useRouter } from "@/i18n/routing";
import { ApiError, locationService, userService } from "@/services/api";
import type { Area, Division } from "@/types/api/location";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Checkout = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { createOrder } = useOrders();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ssl_commerce");
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>("");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const isNavigatingRef = useRef(false);
  const [shippingData, setShippingData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    state: string;
    country: string;
  }>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    state: "",
    country: "Bangladesh",
  });

  useEffect(() => {
    if (isNavigatingRef.current) {
      return;
    }
    if (!isAuthenticated) {
      router.replace("/" as any);
    } else if (items.length === 0) {
      router.replace("/cart" as any);
    }
  }, [isAuthenticated, items.length, router]);

  useEffect(() => {
    const fetchDivisions = async () => {
      setLoadingDivisions(true);
      try {
        const response = await locationService.getDivisions();
        setDivisions(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Failed to fetch divisions:", error);
        toast.error("Failed to load divisions");
      } finally {
        setLoadingDivisions(false);
      }
    };

    fetchDivisions();
  }, []);

  useEffect(() => {
    if (!selectedDivisionId) {
      setAreas([]);
      setSelectedAreaId("");
      return;
    }

    const fetchAreas = async () => {
      setLoadingAreas(true);
      try {
        const response = await locationService.getAreas(Number(selectedDivisionId));
        const areasArray = Array.isArray(response) ? response : [];
        // Remove duplicates based on area ID
        const uniqueAreas = areasArray.filter(
          (area, index, self) => index === self.findIndex((a) => a.id === area.id)
        );
        setAreas(uniqueAreas);
        setSelectedAreaId("");
      } catch (error) {
        console.error("Failed to fetch areas:", error);
        toast.error("Failed to load areas");
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [selectedDivisionId]);

  interface ReverseGeocodeResult {
    address: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      postcode?: string;
      country?: string;
      road?: string;
      house_number?: string;
      suburb?: string;
      neighbourhood?: string;
    };
    display_name?: string;
  }

  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
          }
        );
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = (await response.json()) as ReverseGeocodeResult;

      if (!data || !data.address) {
        throw new Error("Invalid address data received");
      }

      const address = data.address;
      const city = address.city || address.town || address.village || address.suburb || "";
      const state = address.state?.replace(" Division", "").replace(" District", "") || "";
      const postcode = address.postcode || "";
      const road = address.road || "";
      const houseNumber = address.house_number || "";
      const fullAddress =
        [houseNumber, road].filter(Boolean).join(", ") || data.display_name?.split(",")[0] || "";

      setShippingData((prev) => ({
        ...prev,
        address: fullAddress,
        city: city,
        state: state,
        zip: postcode,
        country: address.country || "Bangladesh",
      }));

      if (state) {
        const matchingDivision = divisions.find(
          (d) =>
            d.name.toLowerCase().includes(state.toLowerCase()) ||
            state.toLowerCase().includes(d.name.toLowerCase())
        );
        if (matchingDivision) {
          setSelectedDivisionId(String(matchingDivision.id));
        }
      }

      toast.success("Location address filled successfully");
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error(
              "Location access denied. Please enable location permissions in your browser settings and try again.",
              {
                duration: 5000,
              }
            );
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error(
              "Location information unavailable. Please check your GPS/network connection."
            );
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out. Please try again.");
            break;
          default:
            toast.error("Failed to get your location. Please enter address manually.");
        }
      } else if (error instanceof Error) {
        console.error("Error getting location:", error);
        toast.error("Failed to get location address. Please enter manually.");
      } else {
        console.error("Unknown error getting location:", error);
        toast.error("An unexpected error occurred. Please enter address manually.");
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  const formatApiError = (error: ApiError): string => {
    const responseData = (error.response ?? {}) as ApiErrorResponse;
    if (responseData.errors && Object.keys(responseData.errors).length > 0) {
      const firstKey = Object.keys(responseData.errors)[0];
      const firstMessage = responseData.errors[firstKey]?.[0];
      if (firstMessage) {
        return firstMessage;
      }
    }
    if (responseData.error) {
      try {
        const parsed = JSON.parse(responseData.error);
        if (parsed && typeof parsed === "object") {
          const firstParsedMsg = Object.values(parsed)[0];
          if (typeof firstParsedMsg === "string") {
            return firstParsedMsg;
          }
        }
      } catch {
        // ignore
      }
      return responseData.error;
    }
    if (responseData.message) {
      return responseData.message;
    }
    return error.message || "Failed to process order. Please try again.";
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic front-end validation to avoid bad payloads
    if (!user || !user.id) {
      toast.error("User information is missing. Please log in again.");
      setLoading(false);
      return;
    }

    // Check if user has a temporary ID from signup, and fetch profile to get real ID
    let userIdToUse = user.id;
    if (typeof user.id === "string" && user.id.startsWith("user-")) {
      try {
        const profileResponse = await userService.getProfile();
        if (profileResponse.user?.id) {
          userIdToUse = String(profileResponse.user.id);
          // Update user in localStorage with real ID
          const updatedUser = { ...user, id: userIdToUse };
          localStorage.setItem("hometex-user", JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Please log in again to complete your order.");
        setLoading(false);
        return;
      }
    }

    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(shippingData.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!items || items.length === 0) {
      toast.error("Your cart is empty.");
      setLoading(false);
      return;
    }

    try {
      // Create order
      const order = await createOrder({
        userId: userIdToUse,
        items,
        totalAmount: getTotalPrice(),
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        shippingAddress: shippingData,
      });

      // Set flag to prevent useEffect redirect
      isNavigatingRef.current = true;
      // Navigate to success page
      router.push(`/payment/success?orderId=${order.id}` as any);
      // Clear cart after navigation starts
      clearCart();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(formatApiError(error));
      } else {
        toast.error("Failed to process order");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleCheckout}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Shipping Information</h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGetCurrentLocation}
                      disabled={loadingLocation}
                      className="flex items-center gap-2"
                    >
                      {loadingLocation ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Getting location...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4" />
                          <span>Use Current Location</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={shippingData.name}
                        onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingData.address}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, address: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={shippingData.zip}
                        onChange={(e) => setShippingData({ ...shippingData, zip: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="division">Division</Label>
                      <Select
                        value={selectedDivisionId}
                        onValueChange={(value) => {
                          setSelectedDivisionId(value);
                          const division = divisions.find((d) => d.id === Number(value));
                          setShippingData({ ...shippingData, state: division?.name || "" });
                        }}
                        disabled={loadingDivisions}
                      >
                        <SelectTrigger id="division">
                          <SelectValue
                            placeholder={loadingDivisions ? "Loading..." : "Select division"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((division) => (
                            <SelectItem key={division.id} value={String(division.id)}>
                              {division.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Select
                        value={selectedAreaId}
                        onValueChange={(value) => {
                          setSelectedAreaId(value);
                          const area = areas.find((a) => a.id === Number(value));
                          setShippingData({ ...shippingData, city: area?.name || "" });
                        }}
                        disabled={!selectedDivisionId || loadingAreas}
                      >
                        <SelectTrigger id="area">
                          <SelectValue
                            placeholder={
                              !selectedDivisionId
                                ? "Select division first"
                                : loadingAreas
                                  ? "Loading..."
                                  : "Select area"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area, index) => (
                            <SelectItem
                              key={`${selectedDivisionId}-${area.id}-${index}`}
                              value={String(area.id)}
                            >
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingData.country}
                        onChange={(e) =>
                          setShippingData({ ...shippingData, country: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="ssl_commerce" id="ssl_commerce" />
                      <Label htmlFor="ssl_commerce" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">SSL Commerz</p>
                          <p className="text-sm text-muted-foreground">Secure payment gateway</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border border-border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product.name} × {item.quantity}
                          </span>
                          <span className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-6" disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
