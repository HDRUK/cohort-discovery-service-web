"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React, { forwardRef } from "react";

interface GuardedLinkProps extends LinkProps {
  rules: any[];
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const GuardedLink = forwardRef<HTMLAnchorElement, GuardedLinkProps>(
  ({ href, onClick, children, ...props }, ref) => {
    const { queryBuilderJson } = useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
    }));

    const pathname = usePathname();
    console.log("pathname", pathname);
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Check that the query builder is empty
      if (
        queryBuilderJson.rules.length > 0 &&
        pathname == "/dashboard/new-query"
      ) {
        const confirmLeave = window.confirm(
          "You have a query that has not yet been run. Switch tabs anyway?",
        );

        // Prevent navigation if the user cancels
        if (!confirmLeave) {
          e.preventDefault();
          return;
        }
      }

      // If a custom onClick was passed (e.g., from MUI internal), call it
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Link {...props} href={href} ref={ref} onClick={handleClick}>
        {children}
      </Link>
    );
  },
);

export default GuardedLink;
