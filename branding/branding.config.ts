import { BrandingConfig } from "@/types/branding";

const branding: BrandingConfig = {
  productName: "Cohort Discovery",
  productLongName: "Cohort Discovery Service",
  description: "New cohort discovery tool",
  organisationName: "HDR UK",
  logoAlt: "Cohort Discovery logo",
  loginTitle: ["Cohort Discovery", "Service"],
  loginHeadline: ["The right cohort.", "A clearer discovery."],
  loginSubheadline: "Better questions. Meaningful connections.",
  copyrightHolder: "Cohort Discovery",
  hdrukChromeInStandalone: false,
  links: {
    organisation: "https://healthdatagateway.org",
  },
  legal: {
    termsAndConditions: {
      title: "Terms and conditions",
      lastUpdated: "July 2024",
      sourceLabel: "Health Data Research Gateway terms and conditions",
    },
    privacyPolicy: {
      title: "Privacy policy",
      lastUpdated: "July 2024",
      sourceLabel: "Health Data Research Gateway privacy policy",
    },
  },
};

export default branding;
