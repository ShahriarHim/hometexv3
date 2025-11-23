// API Integration utilities
// TODO: Replace these placeholder functions with actual API calls

// Types for Products API
export interface APIProduct {
  id: number;
  name: string;
  slug: string;
  cost: string;
  price: string;
  original_price: number;
  price_formula: string | null;
  field_limit: string | null;
  sell_price: {
    price: number;
    discount: number;
    symbol: string;
  };
  sku: string;
  stock: number;
  isFeatured: number;
  isNew: number;
  isTrending: number;
  status: string;
  discount_fixed: string;
  discount_percent: string;
  description: string;
  created_at: string;
  updated_at: string;
  discount_start: string;
  discount_end: string;
  shops: Array<{
    shop_id: number;
    shop_name: string;
    shop_quantity: number;
  }>;
  brand: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  sub_category: {
    id: number;
    name: string;
  };
  child_sub_category?: {
    id: number;
    name: string;
  } | null;
  supplier: {
    id: number;
    name: string;
    phone: string;
  };
  country: {
    id: number;
    name: string;
  };
  created_by: string;
  updated_by: string;
  primary_photo: string;
  attributes: any[];
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
      const response = await fetch("https://www.hometexbd.ltd/api/hero-banners", {
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
      const response = await fetch("https://www.hometexbd.ltd/api/product/menu", {
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

  // Authentication
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch("https://www.hometexbd.ltd/api/customer-login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email, 
          password, 
          user_type: 3 
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
    }) => {
      const response = await fetch("https://www.hometexbd.ltd/api/customer-signup", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
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
      const response = await fetch("https://www.hometexbd.ltd/api/customer-logout", {
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
    
    getAll: async (userId: string) => {
      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/orders?userId=${userId}`);
      return response.json();
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
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.category) queryParams.append('category', params.category);
      if (params?.sort) queryParams.append('sort', params.sort);
      
      const url = `https://www.hometexbd.ltd/api/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const response = await fetch(url, {
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
        const response = await fetch(`https://www.hometexbd.ltd/api/products/${productId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        
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
  // Calculate discount percentage from prices
  const discountPercent = apiProduct.sell_price.discount || 
    (apiProduct.original_price > apiProduct.sell_price.price 
      ? Math.round(((apiProduct.original_price - apiProduct.sell_price.price) / apiProduct.original_price) * 100)
      : 0);

  // Strip HTML tags from description
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    slug: apiProduct.slug,
    price: apiProduct.sell_price.price,
    originalPrice: apiProduct.original_price > apiProduct.sell_price.price 
      ? apiProduct.original_price 
      : undefined,
    description: stripHtml(apiProduct.description),
    category: apiProduct.category.name.toLowerCase().replace(/\s+/g, '-'),
    subcategory: apiProduct.sub_category?.name.toLowerCase().replace(/\s+/g, '-'),
    childSubcategory: apiProduct.child_sub_category?.name.toLowerCase().replace(/\s+/g, '-'),
    images: [apiProduct.primary_photo],
    inStock: apiProduct.stock > 0,
    rating: 4.5, // Default rating since API doesn't provide this
    reviewCount: 0, // Default since API doesn't provide this
    material: apiProduct.brand?.name,
    isFeatured: apiProduct.isFeatured === 1,
    isNew: apiProduct.isNew === 1,
    discount: discountPercent > 0 ? discountPercent : undefined,
  };
};
