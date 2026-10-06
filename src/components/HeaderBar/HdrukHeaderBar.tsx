"use client";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import logo from "@branding/assets/logo.svg";
import branding from "@branding/branding.config";
import { Header } from "@hdruk/ui";
import useUserStore from "@/hooks/useUserStore";
import { type AnchorHTMLAttributes } from "react";
import { checkIsAdmin } from "@/utils/user";
import { routes } from "@/config/routes";
import { useApplicationMode } from "@/providers/ApplicationModeProvider";
import { useSignOutStore } from "@/store/signOutStore";
import { getOrganisationUrl } from "@/config/externalLinks";

const NEXT_PUBLIC_LOGIN_URL = getOrganisationUrl();
const GATEWAY_PROFILE_HREF = `${NEXT_PUBLIC_LOGIN_URL}/account/profile`;

type HeaderLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  LinkProps;

const HeaderLink = ({ href, rel, onClick, ...props }: HeaderLinkProps) => {
  const isGatewayProfileLink = href.toString() === GATEWAY_PROFILE_HREF;
  const isLogoutLink = href.toString() === routes.logout;
  const setSigningOut = useSignOutStore((s) => s.setSigningOut);

  if (isLogoutLink) {
    return (
      <a
        href={href.toString()}
        {...props}
        rel={rel}
        onClick={(e) => {
          setSigningOut(true);
          onClick?.(e);
        }}
      />
    );
  }

  return (
    <Link
      href={href}
      {...props}
      onClick={onClick}
      target={isGatewayProfileLink ? "_blank" : undefined}
      rel={isGatewayProfileLink ? "noopener noreferrer" : rel}
    />
  );
};

const HdrukHeader = () => {
  const user = useUserStore((s) => s.user);
  const { isStandalone } = useApplicationMode();
  const [first, last] = (user?.name ?? "").trim().split(/\s+/, 2);

  return (
    <Header
      accountLoading={false}
      logoHref={NEXT_PUBLIC_LOGIN_URL}
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
              ]
            : []),
        ],
        ...(isStandalone
          ? { logout: { label: "Logout", href: routes.logout } }
          : {}),
      }}
      linkComponent={HeaderLink}
      accountInitialsColour="#90D0EC"
      appBarColour="secondary"
      isLoggedIn={!!user}
      navItems={[]}
    />
  );
};

export default HdrukHeader;
