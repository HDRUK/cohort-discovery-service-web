"use client";

import { Footer as HdrFooter } from "@hdruk/ui";
import useFeatures from "@/hooks/useFeatures";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://www.hdruk.ac.uk/";

// Note for future - this is a bit of an abuse of NEXT_PUBLIC_TASK_URL, and we should really have a
// NEXT_PUBLIC_API_BASE_URL instead, but this avoids adding a new varied in about 4 repos and env stores,
// so needs must at this time
const API_BASE_URL = `${(process.env.NEXT_PUBLIC_TASK_URL ?? "http://localhost:8000/api").replace("/v1", "")}`;

const Footer = ({ standalone }: { standalone: boolean }) => {
  const { hdrukTheme: hdrukThemeEnabled } = useFeatures();
  const links = [
    {
      title: "links1",
      items: [
        {
          href: GATEWAY_URL,
          label: "Visit the HDR UK Site",
        },
        {
          href: `${GATEWAY_URL}/terms-and-conditions`,
          label: "Terms and conditions",
        },
        {
          href: `${GATEWAY_URL}/about/privacy-policy`,
          label: "Privacy policy",
        },
      ],
    },
    {
      title: "links2",
      items: [
        {
          href: `${GATEWAY_URL}/about/cookie-notice`,
          label: "Cookie notice",
        },
        {
          href: `${API_BASE_URL}/documentation`,
          label: "API docs",
        },
        {
          href: `${GATEWAY_URL}/about/accessibility-statement`,
          label: "Accessibility Statement",
        },
      ],
    },
  ];

  if (!standalone && hdrukThemeEnabled) {
    return <HdrFooter linkGroups={links} />;
  }
};

export default Footer;
