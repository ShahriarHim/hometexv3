import StaticPage from "@/views/StaticPage";

export default function PrivacyPage() {
  return (
    <StaticPage
      title="Privacy Policy"
      description="We collect only the data required to fulfill orders, personalize merchandising, and comply with Bangladeshi commerce regulations."
    >
      <div className="space-y-2 text-foreground">
        <p>
          Personal data is encrypted at rest, never sold, and may be deleted upon request.
          Analytics are aggregated and anonymized.
        </p>
        <p>
          For GDPR/DPDP compliance questions, email privacy@hometex.com and our data protection
          officer will respond within 48 hours.
        </p>
      </div>
    </StaticPage>
  );
}

