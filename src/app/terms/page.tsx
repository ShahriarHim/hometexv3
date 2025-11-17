import StaticPage from "@/views/StaticPage";

export default function TermsPage() {
  return (
    <StaticPage
      title="Terms & Conditions"
      description="These terms govern how you browse, shop, and collaborate with Hometex Bangladesh online."
    >
      <ol className="list-decimal list-inside space-y-2 text-foreground">
        <li>Orders are confirmed once payment is authorized or COD is verified.</li>
        <li>Pricing may change without notice; promotions cannot be combined unless stated.</li>
        <li>Disputes are handled under the jurisdiction of the courts of Dhaka, Bangladesh.</li>
      </ol>
    </StaticPage>
  );
}

