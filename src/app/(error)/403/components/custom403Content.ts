import { routes } from "@/config/routes";

export interface Custom403Content {
  messages: string[];
  redirectUrl: string;
}

export const getContent = (
  reason: string | null,
  standalone: boolean,
  organisationUrl: string,
): Custom403Content => {
  const loginRedirect = standalone ? routes.login : organisationUrl;

  switch (reason) {
    case "missing-role":
      return {
        messages: [
          "You do not have the required role to access this page.",
          "If you believe this is a mistake, contact your team administrator.",
          "If you’ve just been granted access, try signing out and back in.",
        ],
        redirectUrl: "/dashboard",
      };

    case "no-token":
      return {
        messages: [
          "Your session is invalid or missing.",
          "This can happen if you opened the link in a new browser or after a long time.",
          "Please sign in again to continue.",
        ],
        redirectUrl: loginRedirect,
      };

    case "expired-token":
      return {
        messages: [
          "Your session has expired.",
          "For security reasons you’ve been signed out.",
          "Please sign in again to continue.",
        ],
        redirectUrl: loginRedirect,
      };

    case "no-access-custodian":
      return {
        messages: [
          "You do not have the permission to administer this custodian",
        ],
        redirectUrl: "/dashboard",
      };

    case "no-admin-access":
      return {
        messages: [
          "You do not have the permission to administer the Cohort Discovery Service",
        ],
        redirectUrl: "/dashboard",
      };

    default:
      return {
        messages: [
          "You do not have the correct permissions to access something on this page.",
          "If you believe this is a mistake, contact support.",
        ],
        redirectUrl: standalone ? "/" : organisationUrl,
      };
  }
};
