"use client";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import logo from "@branding/assets/logo.svg";
import branding from "@branding/branding.config";
import { Header, type HeaderMenuLinkItem } from "@hdruk/ui";
import { type AnchorHTMLAttributes } from "react";
import { checkIsAdmin } from "@/utils/user";
import { isExternalHref } from "@/utils/url";
import { routes } from "@/config/routes";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { getOrganisationUrl } from "@/config/externalLinks";
import { useSessionUser } from "@/contexts/SessionDataContext";
import useSignOut from "@/hooks/useSignOut";
import SignOutOverlay from "@/components/SignOutOverlay";

const ORGANISATION_URL = getOrganisationUrl();
const GATEWAY_PROFILE_HREF = `${ORGANISATION_URL}/account/profile`;

type HeaderLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  LinkProps;

const HeaderLink = ({ href, rel, ...props }: HeaderLinkProps) => {
  const isExternal = isExternalHref(href.toString());

  return (
    <Link
      href={href}
      {...props}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : rel}
    />
  );
};

const HdrukHeader = () => {
  const user = useSessionUser();
  const { isStandalone } = useApplicationMode();
  const { signOut, isSigningOut } = useSignOut();
  const [first, last] = (user?.name ?? "").trim().split(/\s+/, 2);
  const logout: HeaderMenuLinkItem = { label: "Logout", action: signOut };

  return (
    <>
      <Header
        accountLoading={false}
        logoHref={ORGANISATION_URL}
        brandingLogoImage={
          <Image height={30} priority src={logo} alt={branding.logoAlt} />
        }
        brandingLogoHref={user ? routes.dashboardNewQuery() : routes.login}
        accountName={{ first, last }}
        accountNavigation={{
          profile: {
            label: "My Profile",
            href: isStandalone ? routes.profile : GATEWAY_PROFILE_HREF,
          },
          items: [
            ...(checkIsAdmin(user)
              ? [
                  {
                    label: "Configuration",
                    href: routes.config,
                  },
                  {
                    label: "Regression Tests",
                    href: routes.adminRegression,
                  },
                  {
                    label: "Collection Health",
                    href: routes.adminCollectionHealth,
                  },
                ]
              : []),
          ],
          ...(isStandalone ? { logout } : {}),
        }}
        linkComponent={HeaderLink}
        accountInitialsColour="#90D0EC"
        appBarColour="secondary"
        isLoggedIn={!!user}
        navItems={[]}
      />
      <SignOutOverlay open={isSigningOut} />
    </>
  );
};

export default HdrukHeader;
