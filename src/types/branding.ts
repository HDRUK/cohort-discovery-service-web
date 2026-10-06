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
  loginHeadline: [string, string];
  loginSubheadline: string;
  copyrightHolder: string;
  links: BrandingLinks;
  legal: {
    termsAndConditions: BrandingLegalDocument;
    privacyPolicy: BrandingLegalDocument;
  };
}
