"use client";

import { Footer as HdrFooter } from "@hdruk/ui";
import useFeatures from "@/hooks/useFeatures";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { externalLinks } from "@/config/externalLinks";

// Note for future - this is a bit of an abuse of NEXT_PUBLIC_TASK_URL, and we should really have a
// NEXT_PUBLIC_API_BASE_URL instead, but this avoids adding a new varied in about 4 repos and env stores,
// so needs must at this time
const API_BASE_URL = `${(process.env.NEXT_PUBLIC_TASK_URL ?? "http://localhost:8000/api").replace("/v1", "")}`;

const Footer = () => {
  const { hdrukTheme: hdrukThemeEnabled } = useFeatures();
  const { isStandalone } = useApplicationMode();
  const links = [
    {
      title: "links1",
      items: [
        {
          href: externalLinks.hdrukSite,
          label: "Visit the HDR UK Site",
        },
        {
          href: externalLinks.termsAndConditions,
          label: "Terms and conditions",
        },
        {
          href: externalLinks.privacyPolicy,
          label: "Privacy policy",
        },
      ],
    },
    {
      title: "links2",
      items: [
        {
          href: externalLinks.cookieNotice,
          label: "Cookie notice",
        },
        {
          href: `${API_BASE_URL}/documentation`,
          label: "API docs",
        },
        {
          href: externalLinks.accessibilityStatement,
          label: "Accessibility Statement",
        },
      ],
    },
  ];

  if (!isStandalone && hdrukThemeEnabled) {
    return <HdrFooter linkGroups={links} />;
  }
};

export default Footer;
