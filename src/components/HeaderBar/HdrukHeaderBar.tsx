"use client";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import logo from "@/assets/logo.svg";
import { Header } from "@hdruk/ui";
import useUserStore from "@/hooks/useUserStore";
import { type AnchorHTMLAttributes } from "react";
import { checkIsAdmin } from "@/utils/user";
import { routes } from "@/config/routes";

const NEXT_PUBLIC_LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://healthdatagateway.org";
const PROFILE_HREF = `${NEXT_PUBLIC_LOGIN_URL}/account/profile`;

type HeaderLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  LinkProps;

const HeaderLink = ({ href, rel, ...props }: HeaderLinkProps) => {
  const isProfileLink = href.toString() === PROFILE_HREF;

  return (
    <Link
      href={href}
      {...props}
      target={isProfileLink ? "_blank" : undefined}
      rel={isProfileLink ? "noopener noreferrer" : rel}
    />
  );
};

const HdrukHeader = () => {
  const user = useUserStore((s) => s.user);
  const [first, last] = (user?.name ?? "").trim().split(/\s+/, 2);

  return (
    <Header
      accountLoading={false}
      logoHref={NEXT_PUBLIC_LOGIN_URL}
      brandingLogoImage={
        <Image height={30} priority src={logo} alt="Cohort Discovery logo" />
      }
      brandingLogoHref="/"
      accountName={{ first, last }}
      accountNavigation={{
        profile: {
          label: "My Profile",
          href: PROFILE_HREF,
        },
        items: [
          ...(checkIsAdmin(user)
            ? [
                {
                  label: "Feature Flags",
                  href: routes.featureFlags,
                },
              ]
            : []),
        ],
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
