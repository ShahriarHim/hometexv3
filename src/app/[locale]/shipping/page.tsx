import StaticPage from "@/views/StaticPage";

export default function ShippingPage() {
  return (
    <StaticPage
      title="Shipping & Delivery"
      description="Orders ship nationwide from our Dhaka fulfillment center within 24 hours."
    >
      <ul className="list-disc list-inside space-y-2 text-foreground">
        <li>Free standard delivery on orders above BDT 3,000.</li>
        <li>Express delivery (24h in Dhaka, 48h nationwide) available at checkout.</li>
        <li>Live tracking updates are sent via SMS and email for every shipment.</li>
      </ul>
    </StaticPage>
  );
}

