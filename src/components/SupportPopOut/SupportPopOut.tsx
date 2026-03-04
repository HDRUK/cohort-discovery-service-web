"use client";

import { useCallback, useState } from "react";
import { Button, Popover } from "@mui/material";
import { SupportButton, SupportList } from "./SupportPopOut.styles";
import theme from "@/config/theme";

const CUSTOMER_PORTAL_SUPPORT_URL = `${process.env.NEXT_PUBLIC_SERVICE_DESK_URL}/${process.env.NEXT_PUBLIC_SERVICE_DESK_SUPPORT_SUFFIX}`;
const CUSTOMER_PORTAL_REPORT_BUG_URL = `${process.env.NEXT_PUBLIC_SERVICE_DESK_URL}/${process.env.NEXT_PUBLIC_SERVICE_DESK_REPORT_BUG_SUFFIX}`;

const SupportPopOut = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (anchorEl) {
        setAnchorEl(null);
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [anchorEl],
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const links = [
    {
      label: "Visit Support Centre",
      href: `${process.env.NEXT_PUBLIC_SUPPORT_URL ?? "https://healthdatagateway.org"}/support`,
      isExternal: false,
    },
    {
      label: "Share feedback",
      href: CUSTOMER_PORTAL_SUPPORT_URL,
      isExternal: true,
    },
    {
      label: "Get Help / Report an Issue",
      href: CUSTOMER_PORTAL_REPORT_BUG_URL,
      isExternal: true,
    },
  ];

  const open = !!anchorEl;
  const id = open ? "support-popover" : undefined;
  return (
    <div>
      <SupportButton color="yellowCustom" onClick={handleClick}>
        {"Need support?"}
      </SupportButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        transformOrigin={{ vertical: "center", horizontal: 190 }}
      >
        <div>
          <SupportList>
            {links.map((link) => (
              <li key={link.label}>
                <Button
                  href={link.href}
                  {...(link.isExternal && {
                    target: "_blank",
                    rel: "noreferrer",
                  })}
                  sx={{
                    borderRadius: 0,
                    boxShadow: "none",
                    "&:hover": { background: theme.palette.yellowCustom?.main },
                  }}
                  fullWidth
                  color="yellowCustom"
                >
                  {link.label}
                </Button>
              </li>
            ))}
          </SupportList>
        </div>
      </Popover>
    </div>
  );
};

export default SupportPopOut;
