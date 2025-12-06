// API Integration utilities
import { env } from "./env";

// Helper function to get the auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("hometex-auth-token");
  }
  return null;
};

// Helper function to make authenticated API requests
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  if (token) {
    Object.assign(headers, { Authorization: `Bearer ${token}` });
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Helper function to try localhost first, then fallback to production (for authenticated requests)
export const fetchWithFallback = async (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
) => {
  const localhostUrl = `${env.apiLocalUrl}${endpoint}`;
  const productionUrl = `${productionBaseUrl}${endpoint}`;

  try {
    // Try localhost first with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const localResponse = await authenticatedFetch(localhostUrl, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If localhost responds successfully, use it
    if (localResponse.ok) {
      return localResponse;
    }

    // If localhost returns an error status, still try production
    // (fall through to production)
  } catch (error: any) {
    // Network error, timeout, or CORS issue - try production
    if (error.name !== "AbortError") {
      // Only log non-timeout errors
      console.debug("Localhost request failed, trying production:", error.message);
    }
  }

  // Fallback to production
  return authenticatedFetch(productionUrl, options);
};

// Helper function to try localhost first, then fallback to production (for public requests)
export const fetchPublicWithFallback = async (
  endpoint: string,
  productionBaseUrl: string,
  options: RequestInit = {}
) => {
  const localhostUrl = `${env.apiLocalUrl}${endpoint}`;
  const productionUrl = `${productionBaseUrl}${endpoint}`;

  try {
    // Try localhost first with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const localResponse = await fetch(localhostUrl, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If localhost responds successfully, use it
    if (localResponse.ok) {
      return localResponse;
    }

    // If localhost returns an error status, still try production
    // (fall through to production)
  } catch (error: any) {
    // Network error, timeout, or CORS issue - try production
    if (error.name !== "AbortError") {
      // Only log non-timeout errors
      console.debug("Localhost request failed, trying production:", error.message);
    }
  }

  // Fallback to production
  return fetch(productionUrl, options);
};

// Types for Authentication API
export interface SignupResponse {
  success: {
    name: string;
    statue: number;
    message: string;
    authorisation: {
      token: string;
      type: string;
    };
  };
}

export interface LoginResponse {
  success: {
    name: string;
    statue: number;
    message: string;
    authorisation: {
      token: string;
      type: string;
    };
  };
}

// Types for User Profile API
export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

// Types for Products API
export interface APIProduct {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  status: string;
  visibility: string;
  type: string;
  category: {
    id: number;
    name: string;
    slug: string;
    level: number;
  };
  sub_category: {
    id: number;
    name: string;
    slug: string;
    level: number;
  };
  child_sub_category?: {
    id: number;
    name: string;
    slug: string;
    level: number;
  } | null;
  breadcrumb: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: string[];
  brand: {
    id: number;
    name: string;
    slug: string;
    logo: string;
  };
  manufacturer: {
    id: number;
    name: string;
    country: string;
  };
  country_of_origin: {
    id: number;
    name: string;
    code: string;
  };
  pricing: {
    currency: string;
    currency_symbol: string;
    cost_price: number;
    regular_price: number;
    sale_price: number | null;
    final_price: number;
    discount: {
      type: string;
      value: number;
      amount: number;
      start_date: string;
      end_date: string;
      is_active: boolean;
      remaining_days: number | null;
    };
    tax: {
      rate: number;
      amount: number;
      included: boolean;
      class: string;
    };
    profit_margin: {
      amount: number;
      percentage: number;
    };
    price_range: {
      min: number;
      max: number;
    };
  };
  inventory: {
    stock_status: string;
    stock_quantity: number;
    low_stock_threshold: number;
    is_low_stock: boolean;
    allow_backorders: boolean;
    manage_stock: boolean;
    stock_by_location: Array<{
      shop_id: number;
      shop_name: string;
      shop_slug: string;
      quantity: number;
      reserved: number;
    }>;
    sold_count: number;
    restock_date: string | null;
  };
  has_variations: boolean;
  parent_id: number | null;
  variations: Array<{
    id: number;
    parent_id: number;
    sku: string;
    name: string;
    slug: string;
    attributes: {
      Size?: string;
      Color?: string;
      [key: string]: any;
    };
    pricing: {
      regular_price: number;
      sale_price: number | null;
      final_price: number;
    };
    inventory: {
      stock_status: string;
      stock_quantity: number;
    };
    media: any[];
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  }>;
  attributes: any[];
  specifications: any[];
  media: {
    gallery: any[];
    videos: Array<{
      id: number;
      type: string;
      url: string;
      thumbnail: string;
      title: string;
    }>;
  };
  reviews: {
    average_rating: number;
    rating_count: number;
    review_count: number;
    rating_distribution: {
      "5_star": number;
      "4_star": number;
      "3_star": number;
      "2_star": number;
      "1_star": number;
    };
    verified_purchase_percentage: number;
    recommendation_percentage: number;
  };
  shipping: {
    weight: number;
    weight_unit: string;
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: string;
    };
    shipping_class: string;
    free_shipping: boolean;
    ships_from: {
      country: string;
      city: string;
    };
    estimated_delivery: {
      min_days: number;
      max_days: number;
      express_available: boolean;
    };
  };
  badges: {
    is_featured: boolean;
    is_new: boolean;
    is_trending: boolean;
    is_bestseller: boolean;
    is_on_sale: boolean;
    is_limited_edition: boolean;
    is_exclusive: boolean;
    is_eco_friendly: boolean;
  };
  seo: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    canonical_url: string | null;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_card: string;
  };
  related_products: {
    similar_products: number[];
    frequently_bought_together: number[];
    customers_also_viewed: number[];
    recently_viewed: number[];
  };
  warranty: {
    has_warranty: boolean;
    duration: number;
    duration_unit: string;
    type: string;
    details: string;
  };
  return_policy: {
    returnable: boolean;
    return_window_days: number;
    conditions: string;
  };
  minimum_order_quantity: number;
  maximum_order_quantity: number;
  bulk_pricing: Array<{
    min_quantity: number;
    max_quantity: number | null;
    price: number;
    discount_percentage: number | null;
  }>;
  supplier: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  vendor: any;
  created_at: string;
  updated_at: string;
  published_at: string;
  created_by: {
    id: number;
    name: string;
    role: string;
  };
  updated_by: {
    id: number;
    name: string;
    role: string;
  };
  analytics: {
    views_count: number;
    clicks_count: number;
    add_to_cart_count: number;
    purchase_count: number;
    conversion_rate: number;
    wishlist_count: number;
  };
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: {
    products: APIProduct[];
    pagination?: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      from: number;
      to: number;
    };
  };
}

export interface ProductResponse {
  success: boolean;
  message: string;
  data: APIProduct | null;
}

// Types for Hero Banners API
export interface HeroBannerSliderData {
  button_text: string;
  button_Link: string;
  left: {
    background_color: string;
    text: string;
    image: string;
  };
  meddle: {
    Header: string;
    title: string;
    description: string;
  };
  right: {
    background_color: string;
    text: string;
    image: string;
  };
}

export interface HeroBannerItem {
  id: number;
  name: string;
  slider: string; // Contains URL with JSON data
  sl: number;
  status: number;
}

export interface HeroBannersResponse {
  success: boolean;
  message: string;
  data: HeroBannerItem[];
  meta: {
    request_id: string;
    timestamp: string;
    response_time_ms: number;
  };
}

// Types for Menu API
export interface ChildSubCategory {
  id: number;
  name: string;
  sub_category_id: number;
}

export interface SubCategory {
  id: number;
  name: string;
  category_id: number;
  child_sub_categories: ChildSubCategory[];
}

export interface Category {
  id: number;
  name: string;
  image: string;
  sub_categories: SubCategory[];
}

export interface MenuResponse {
  success: boolean;
  message: string;
  data: Category[];
  meta: {
    request_id: string;
    timestamp: string;
    response_time_ms: number;
  };
}

export const api = {
  // Hero Banners
  heroBanners: {
    getAll: async (): Promise<HeroBannersResponse> => {
      const response = await fetchPublicWithFallback("/api/hero-banners", env.apiBaseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching to get fresh data
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch hero banners: ${response.statusText}`);
      }

      return response.json();
    },
  },

  // Menu/Categories
  menu: {
    getAll: async (): Promise<MenuResponse> => {
      const response = await fetchPublicWithFallback("/api/product/menu", env.apiBaseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching to get fresh data
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch menu: ${response.statusText}`);
      }

      return response.json();
    },
  },

  // User Profile
  profile: {
    getMyProfile: async (): Promise<ProfileResponse> => {
      const response = await fetchWithFallback("/api/my-profile", env.apiBaseUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch profile");
      }

      return response.json();
    },

    updateProfile: async (profileData: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      address?: string;
    }): Promise<ProfileResponse> => {
      const response = await fetchWithFallback("/api/update-profile", env.apiBaseUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      return response.json();
    },
  },

  // Authentication
  auth: {
    login: async (email: string, password: string): Promise<LoginResponse> => {
      const response = await fetchPublicWithFallback("/api/customer-login", env.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          user_type: 3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    },

    signup: async (signupData: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      password: string;
      conf_password: string;
    }): Promise<SignupResponse> => {
      const response = await fetchPublicWithFallback("/api/customer-signup", env.apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      return response.json();
    },

    logout: async () => {
      const response = await fetchWithFallback("/api/customer-logout", env.apiBaseUrl, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      return response.json();
    },
  },

  // Orders
  orders: {
    create: async (orderData: any) => {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      return response.json();
    },

    getAll: async () => {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: "Please login to view your orders",
          data: [],
        };
      }

      try {
        const response = await fetchWithFallback(
          "/api/my-order-list",
          "https://htbapi.hometexbd.ltd",
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            message: data.message || "Orders retrieved successfully",
            data: data.data || [],
          };
        } else {
          return {
            success: false,
            message: data.error || data.message || "Failed to fetch orders",
            data: [],
          };
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to fetch orders",
          data: [],
        };
      }
    },

    getById: async (orderId: string) => {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/orders/${orderId}`);
      return response.json();
    },

    updateStatus: async (orderId: string, status: string) => {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return response.json();
    },
  },

  // Payment (SSL Commerz)
  payment: {
    initiate: async (orderData: any) => {
      // TODO: Replace with actual SSL Commerz API integration
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      return response.json();
    },

    verify: async (transactionId: string) => {
      // TODO: Replace with actual SSL Commerz verification endpoint
      const response = await fetch(`/api/payment/verify/${transactionId}`);
      return response.json();
    },
  },

  // Products
  products: {
    getAll: async (params?: {
      page?: number;
      per_page?: number;
      category?: string;
      sort?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.per_page) queryParams.append("per_page", params.per_page.toString());
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sort) queryParams.append("sort", params.sort);

      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const endpoint = `/api/products${queryString}`;

      const response = await fetchPublicWithFallback(endpoint, env.apiBaseUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      return response.json();
    },

    getById: async (productId: string): Promise<ProductResponse> => {
      try {
        const response = await fetchPublicWithFallback(
          `/api/products/${productId}`,
          env.apiBaseUrl,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        // If the response is not ok but we got JSON, return it so we can access the error message
        if (!response.ok) {
          return {
            success: false,
            message: data.message || `Failed to fetch product: ${response.statusText}`,
            data: null as any,
          };
        }

        return data;
      } catch (error) {
        // Network error or JSON parse error
        return {
          success: false,
          message: "Unable to connect to the server. Please check your internet connection.",
          data: null as any,
        };
      }
    },

    getReviews: async (productId: string) => {
      // TODO: Replace with actual API endpoint when available
      const response = await fetch(`/api/products/${productId}/reviews`);
      return response.json();
    },

    getSimilar: async (productId: string): Promise<ProductsResponse> => {
      try {
        const response = await fetchPublicWithFallback(
          `/api/products/${productId}/similar`,
          env.apiBaseUrl,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: data.message || `Failed to fetch similar products: ${response.statusText}`,
            data: { products: [] },
          };
        }

        return data;
      } catch (error) {
        return {
          success: false,
          message: "Unable to connect to the server. Please check your internet connection.",
          data: { products: [] },
        };
      }
    },

    getByIds: async (productIds: number[]): Promise<ProductsResponse> => {
      try {
        // Fetch multiple products by their IDs
        const promises = productIds.map((id) =>
          fetchPublicWithFallback(`/api/products/${id}`, env.apiBaseUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          })
        );

        const responses = await Promise.all(promises);
        const dataPromises = responses.map((r) => r.json());
        const results = await Promise.all(dataPromises);

        // Filter successful responses and extract product data
        const products = results
          .filter((result) => result.success && result.data)
          .map((result) => result.data);

        return {
          success: true,
          message: "Products retrieved successfully",
          data: { products },
        };
      } catch (error) {
        return {
          success: false,
          message: "Unable to fetch products. Please check your internet connection.",
          data: { products: [] },
        };
      }
    },
  },

  // Price Drop Alerts
  priceDrop: {
    getList: async () => {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: "Please login to view your price drop notifications",
          data: [],
        };
      }

      try {
        const response = await fetchWithFallback(
          "/api/product/price-drop-list",
          "https://htbapi.hometexbd.ltd",
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            message: data.message || "Price drop alerts retrieved successfully",
            data: data.data || [],
          };
        } else {
          return {
            success: false,
            message: data.message || "Failed to fetch price drop alerts",
            data: [],
          };
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to fetch price drop alerts",
          data: [],
        };
      }
    },
  },

  // Restock Requests
  restock: {
    getList: async () => {
      const token = getAuthToken();
      if (!token) {
        return {
          success: false,
          message: "Please login to view your restock requests",
          data: [],
        };
      }

      try {
        const response = await fetchWithFallback(
          "/api/product/restock-request-list",
          "https://htbapi.hometexbd.ltd",
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (data.success) {
          return {
            success: true,
            message: data.message || "Restock requests retrieved successfully",
            data: data.data || [],
          };
        } else {
          return {
            success: false,
            message: data.message || "Failed to fetch restock requests",
            data: [],
          };
        }
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Failed to fetch restock requests",
          data: [],
        };
      }
    },
  },

  // Delivery Tracking
  delivery: {
    track: async (trackingNumber: string) => {
      // TODO: Replace with actual delivery tracking API
      const response = await fetch(`/api/delivery/track/${trackingNumber}`);
      return response.json();
    },

    updateLocation: async (trackingNumber: string, location: any) => {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/delivery/${trackingNumber}/location`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });
      return response.json();
    },
  },

  // Contact & Support
  contact: {
    send: async (formData: any) => {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      return response.json();
    },
  },

  // Gift Cards
  gifts: {
    send: async (giftData: any) => {
      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(giftData),
      });
      return response.json();
    },
  },
};

// SSL Commerz Integration Helper
export const sslCommerzHelper = {
  initiatePayment: async (orderData: {
    amount: number;
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
  }) => {
    // TODO: Replace with actual SSL Commerz credentials and endpoint
    const payload = {
      store_id: "YOUR_STORE_ID",
      store_passwd: "YOUR_STORE_PASSWORD",
      total_amount: orderData.amount.toString(),
      currency: "BDT",
      tran_id: orderData.orderId,
      success_url: `${window.location.origin}/payment/success`,
      fail_url: `${window.location.origin}/payment/fail`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      cus_name: orderData.customerName,
      cus_email: orderData.customerEmail,
      cus_phone: orderData.customerPhone,
      cus_add1: orderData.customerAddress,
      shipping_method: "Courier",
      product_name: "HomeTex Products",
      product_category: "Home Textiles",
      product_profile: "general",
    };

    // TODO: Make actual API call to SSL Commerz
    const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(payload).toString(),
    });

    return response.json();
  },
};

// Helper function to transform API hero banner data to HeroSlide format
export const transformHeroBannerToSlide = (banner: HeroBannerItem) => {
  try {
    // Extract JSON from the slider field (it's embedded in a URL)
    const sliderUrl = banner.slider;
    const jsonStartIndex = sliderUrl.indexOf("{");
    const jsonString = sliderUrl.substring(jsonStartIndex);
    const sliderData: HeroBannerSliderData = JSON.parse(jsonString);

    // Helper to generate color palette from a single color
    const generatePalette = (baseColor: string): string[] => {
      if (!baseColor || baseColor === "") {
        return [];
      }
      // Return the same color for simplicity, or you can generate variations
      return [baseColor, baseColor, baseColor, baseColor, baseColor];
    };

    return {
      id: `banner-${banner.id}`,
      eyebrow: sliderData.meddle.Header || "",
      title: sliderData.meddle.title || "",
      description: sliderData.meddle.description || "",
      image: "", // API doesn't provide a direct image URL for the main banner
      cta: {
        label: sliderData.button_text || "Shop Now",
        href: sliderData.button_Link || "/shop",
      },
      secondaryCta: {
        label: "",
        href: "",
      },
      stats: {
        label: "",
        value: "",
      },
      accentPalette: {
        left: sliderData.left.background_color
          ? generatePalette(sliderData.left.background_color)
          : [],
        right: sliderData.right.background_color
          ? generatePalette(sliderData.right.background_color)
          : [],
      },
    };
  } catch (error) {
    console.error("Error parsing banner data:", error);
    // Return a default slide if parsing fails
    return {
      id: `banner-${banner.id}`,
      eyebrow: "",
      title: "Welcome to HomeTex",
      description: "",
      image: "",
      cta: {
        label: "Shop Now",
        href: "/shop",
      },
      secondaryCta: {
        label: "",
        href: "",
      },
      stats: {
        label: "",
        value: "",
      },
      accentPalette: {
        left: [],
        right: [],
      },
    };
  }
};

// Helper function to transform API product data to Product format
export const transformAPIProductToProduct = (apiProduct: APIProduct) => {
  // Extract pricing information
  const pricing = apiProduct.pricing || {};
  const finalPrice = pricing.final_price || pricing.regular_price || 0;
  const regularPrice = pricing.regular_price || finalPrice;
  const salePrice = pricing.sale_price;

  // Calculate discount percentage
  let discountPercent = 0;
  if (pricing.discount && pricing.discount.is_active) {
    discountPercent = Math.round(pricing.discount.value || 0);
  } else if (salePrice && regularPrice > salePrice) {
    discountPercent = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  } else if (regularPrice > finalPrice) {
    discountPercent = Math.round(((regularPrice - finalPrice) / regularPrice) * 100);
  }

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Extract unique colors and sizes from variations
  const colors =
    apiProduct.has_variations && apiProduct.variations
      ? (Array.from(
          new Set(apiProduct.variations.map((v) => v.attributes?.Color).filter(Boolean))
        ) as string[])
      : [];

  const sizes =
    apiProduct.has_variations && apiProduct.variations
      ? (Array.from(
          new Set(apiProduct.variations.map((v) => v.attributes?.Size).filter(Boolean))
        ) as string[])
      : [];

  // Get images from media gallery, fallback to brand logo or empty array
  const images =
    apiProduct.media?.gallery && apiProduct.media.gallery.length > 0
      ? apiProduct.media.gallery.map((img: any) => img.url || img)
      : apiProduct.brand?.logo
        ? [apiProduct.brand.logo]
        : [];

  // Extract features from specifications or attributes
  const features: string[] = [];
  if (apiProduct.specifications && Array.isArray(apiProduct.specifications)) {
    apiProduct.specifications.forEach((spec: any) => {
      if (spec.value) {
        features.push(`${spec.name || spec.key || ""}: ${spec.value}`);
      }
    });
  }

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name || "Unnamed Product",
    slug: apiProduct.slug || "",
    price: finalPrice,
    originalPrice: regularPrice > finalPrice ? regularPrice : undefined,
    description: stripHtml(apiProduct.description || apiProduct.short_description || ""),
    category:
      apiProduct.category?.slug ||
      apiProduct.category?.name?.toLowerCase().replace(/\s+/g, "-") ||
      "uncategorized",
    subcategory:
      apiProduct.sub_category?.slug ||
      apiProduct.sub_category?.name?.toLowerCase().replace(/\s+/g, "-"),
    childSubcategory:
      apiProduct.child_sub_category?.slug ||
      apiProduct.child_sub_category?.name?.toLowerCase().replace(/\s+/g, "-"),
    images: images,
    inStock:
      apiProduct.inventory?.stock_status === "in_stock" &&
      (apiProduct.inventory?.stock_quantity ?? 0) > 0,
    rating: apiProduct.reviews?.average_rating || 4.5,
    reviewCount: apiProduct.reviews?.review_count || 0,
    material: apiProduct.brand?.name,
    isFeatured: apiProduct.badges?.is_featured || false,
    isNew: apiProduct.badges?.is_new || false,
    discount: discountPercent > 0 ? discountPercent : undefined,
    colors: colors.length > 0 ? colors : undefined,
    sizes: sizes.length > 0 ? sizes : undefined,
    features: features.length > 0 ? features : undefined,
  };
};
