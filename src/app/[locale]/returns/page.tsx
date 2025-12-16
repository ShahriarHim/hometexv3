import StaticPage from "@/views/StaticPage";

export default function ReturnsPage() {
  return (
    <StaticPage
      title="Returns & Exchanges"
      description="We stand behind the quality of every textile we craft. If something feels off, let us make it right."
    >
      <ul className="list-disc list-inside space-y-2 text-foreground">
        <li>30-day hassle-free returns for unused items with original packaging.</li>
        <li>Instant exchanges for sizing or color issues on eligible styles.</li>
        <li>Dedicated concierge at support@hometex.com for custom or B2B orders.</li>
      </ul>
    </StaticPage>
  );
}
