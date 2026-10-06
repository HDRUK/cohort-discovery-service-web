import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { TermsAndConditionsContent } from "@/modules/Legal";
import { externalLinks } from "@/config/externalLinks";

export const metadata: Metadata = {
  title: "Terms and conditions | Cohort Discovery Service",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms and conditions"
      lastUpdated="July 2024"
      sourceLabel="Health Data Research Gateway terms and conditions"
      sourceHref={externalLinks.termsAndConditions}
    >
      <TermsAndConditionsContent />
    </LegalPage>
  );
}
