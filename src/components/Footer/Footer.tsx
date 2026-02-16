"use client";

import { Footer as HdrFooter } from "@hdruk/ui";
import useFeatures from "@/hooks/useFeatures";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://www.hdruk.ac.uk/";

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
          href: `${GATEWAY_URL}/documentation`,
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
