import OrderDetails from "@/views/OrderDetails";

type Params = Promise<{
  locale: string;
  orderId: string;
}>;

export default async function OrderDetailsPage(props: { params: Params }) {
  // Await the params as per Next.js 15 requirements
  const _params = await props.params;

  return <OrderDetails />;
}
