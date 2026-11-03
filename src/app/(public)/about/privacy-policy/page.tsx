import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PrivacyPolicyContent } from "@/modules/Legal";
import { externalLinks } from "@/config/externalLinks";
import branding from "@branding/branding.config";

const { title, lastUpdated, sourceLabel } = branding.legal.privacyPolicy;

export const metadata: Metadata = {
  title: `${title} | ${branding.productLongName}`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title={title}
      lastUpdated={lastUpdated}
      sourceLabel={sourceLabel}
      sourceHref={sourceLabel ? externalLinks.privacyPolicy : undefined}
    >
      <PrivacyPolicyContent />
    </LegalPage>
  );
}
