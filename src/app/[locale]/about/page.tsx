import StaticPage from "@/views/StaticPage";

export default function AboutPage() {
  return (
    <StaticPage
      title="About Hometex Bangladesh"
      description="We are a modern D2C textile brand crafting premium bedding, bath, and home décor essentials for discerning households throughout Bangladesh."
    >
      <div className="space-y-3 text-foreground">
        <p>
          Every collection is designed in-house, woven from responsibly sourced fibers, and
          finished by expert craftspeople to deliver enduring comfort.
        </p>
        <p>
          From bespoke hospitality programs to curated retail drops, our team pairs textile
          heritage with data-driven merchandising to keep your home feeling elevated year round.
        </p>
      </div>
    </StaticPage>
  );
}

