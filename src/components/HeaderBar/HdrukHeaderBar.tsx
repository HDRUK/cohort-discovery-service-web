"use client";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { Header } from "@hdruk/ui";
import useUserStore from "@/hooks/useUserStore";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

const NEXT_PUBLIC_LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://healthdatagateway.org";
const PROFILE_HREF = `${NEXT_PUBLIC_LOGIN_URL}/account/profile`;

const HeaderLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<"a">
>(function HeaderLink(props, ref) {
  const { href, rel, ...rest } = props;
  const shouldOpenNewTab = href === PROFILE_HREF;

  return (
    <a
      ref={ref}
      href={href}
      {...rest}
      target={shouldOpenNewTab ? "_blank" : undefined}
      rel={shouldOpenNewTab ? "noopener noreferrer" : rel}
    />
  );
});

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
