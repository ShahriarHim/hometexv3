// Analytics tracking utilities
type AnalyticsEvent =
  | {
      event: "product_view";
      product_id: string;
      sku: string;
      name: string;
      variant_id?: number;
      price: number;
      currency: string;
    }
  | { event: "media_play"; product_id: string; media_id: number; type: string }
  | {
      event: "add_to_cart";
      product_id: string;
      variant_id?: number;
      sku: string;
      price: number;
      quantity: number;
    }
  | {
      event: "begin_checkout";
      product_id: string;
      variant_id?: number;
      price: number;
      quantity: number;
    }
  | { event: "add_to_wishlist"; product_id: string }
  | {
      event: "variant_select";
      product_id: string;
      variant_id: number;
      attributes: Record<string, any>;
    }
  | { event: "promo_view" | "promo_click"; promo_id: string; product_id: string }
  | { event: "product_share"; product_id: string; channel: string }
  | { event: "stock_error" | "quantity_error"; product_id: string; message: string };

export const trackEvent = (eventData: AnalyticsEvent) => {
  // Send to analytics service (Google Analytics, Mixpanel, etc.)
  if (typeof window !== "undefined") {
    console.log("[Analytics]", eventData);

    // Example: Google Analytics 4
    if (window.gtag) {
      window.gtag("event", eventData.event, eventData);
    }

    // Example: Facebook Pixel
    if (window.fbq) {
      window.fbq("track", eventData.event, eventData);
    }

    // You can add other analytics providers here
  }
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}
