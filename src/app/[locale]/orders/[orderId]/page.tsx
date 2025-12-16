import OrderTrackingView from "@/views/OrderTracking";

type Params = Promise<{
  locale: string;
  orderId: string;
}>;

export default async function OrderTrackingPage(props: { params: Params }) {
  // Await the params as per Next.js 15 requirements
  const _params = await props.params;

  return <OrderTrackingView />;
}
