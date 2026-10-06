import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { PrivacyPolicyContent } from "@/modules/Legal";
import { externalLinks } from "@/config/externalLinks";

export const metadata: Metadata = {
  title: "Privacy policy | Cohort Discovery Service",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      lastUpdated="July 2024"
      sourceLabel="Health Data Research Gateway privacy policy"
      sourceHref={externalLinks.privacyPolicy}
    >
      <PrivacyPolicyContent />
    </LegalPage>
  );
}
