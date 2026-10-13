import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { TermsAndConditionsContent } from "@/modules/Legal";
import { externalLinks } from "@/config/externalLinks";
import branding from "@branding/branding.config";

const { title, lastUpdated, sourceLabel } = branding.legal.termsAndConditions;

export const metadata: Metadata = {
  title: `${title} | ${branding.productLongName}`,
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title={title}
      lastUpdated={lastUpdated}
      sourceLabel={sourceLabel}
      sourceHref={sourceLabel ? externalLinks.termsAndConditions : undefined}
    >
      <TermsAndConditionsContent />
    </LegalPage>
  );
}
