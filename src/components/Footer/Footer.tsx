"use client";

import { Footer as HdrFooter } from "@hdruk/ui";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import branding from "@branding/branding.config";
import useHdrukChrome from "@/hooks/useHdrukChrome";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { externalLinks, getLegalLinks } from "@/config/externalLinks";

// Note for future - this is a bit of an abuse of NEXT_PUBLIC_TASK_URL, and we should really have a
// NEXT_PUBLIC_API_BASE_URL instead, but this avoids adding a new varied in about 4 repos and env stores,
// so needs must at this time
const API_BASE_URL = `${(process.env.NEXT_PUBLIC_TASK_URL ?? "http://localhost:8000/api").replace("/v1", "")}`;

interface FooterLink {
  href: string;
  label: string;
}

const Footer = () => {
  const showHdrukChrome = useHdrukChrome();
  const { isStandalone } = useApplicationMode();
  const legalLinks = getLegalLinks(isStandalone);

  const showOrganisationLink = !isStandalone;
  const showCookieNotice = !isStandalone || !!branding.links.cookieNotice;
  const showAccessibility =
    !isStandalone || !!branding.links.accessibilityStatement;

  const primaryLinks: FooterLink[] = [
    ...(showOrganisationLink
      ? [
          {
            href: externalLinks.hdrukSite,
            label: `Visit the ${branding.organisationName} site`,
          },
        ]
      : []),
    { href: legalLinks.termsAndConditions, label: "Terms and conditions" },
    { href: legalLinks.privacyPolicy, label: "Privacy policy" },
  ];

  const secondaryLinks: FooterLink[] = [
    ...(showCookieNotice
      ? [{ href: externalLinks.cookieNotice, label: "Cookie notice" }]
      : []),
    { href: `${API_BASE_URL}/documentation`, label: "API docs" },
    ...(showAccessibility
      ? [
          {
            href: externalLinks.accessibilityStatement,
            label: "Accessibility statement",
          },
        ]
      : []),
  ];

  if (showHdrukChrome) {
    return (
      <HdrFooter
        linkGroups={[
          { title: "links1", items: primaryLinks },
          { title: "links2", items: secondaryLinks },
        ]}
      />
    );
  }

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        px: 3,
        py: 2,
        bgcolor: "secondary.main",
        color: "secondary.contrastText",
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {[...primaryLinks, ...secondaryLinks].map(({ href, label }) => (
          <MuiLink
            key={label}
            component={Link}
            href={href}
            underline="hover"
            sx={{ color: "inherit", typography: "body2" }}
          >
            {label}
          </MuiLink>
        ))}
      </Box>

      <Typography variant="body2">
        © {new Date().getFullYear()} {branding.copyrightHolder}
      </Typography>
    </Box>
  );
};

export default Footer;
