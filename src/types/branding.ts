export interface BrandingLegalDocument {
  title: string;
  lastUpdated: string;
  sourceLabel?: string;
}

export interface BrandingLinks {
  organisation: string;
  cookieNotice?: string;
  accessibilityStatement?: string;
}

export interface BrandingConfig {
  productName: string;
  productLongName: string;
  description: string;
  organisationName: string;
  logoAlt: string;
  loginTitle: [string, string];
  loginHeadline: [string, string];
  loginSubheadline: string;
  copyrightHolder: string;
  hdrukChromeInStandalone: boolean;
  links: BrandingLinks;
  legal: {
    termsAndConditions: BrandingLegalDocument;
    privacyPolicy: BrandingLegalDocument;
  };
}
