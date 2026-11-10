import { ReactNode } from "react";
import SegmentTabsShell from "@/components/SegmentTabsShell";
import { routes } from "@/config/routes";
import { isStandalone } from "@/utils/modes";

const applicationMode = process.env.APPLICATION_MODE;

const ADMIN_TABS = [
  ...(isStandalone(applicationMode)
    ? [{ id: "users", label: "Users", href: routes.adminUsers }]
    : []),
  { id: "workgroups", label: "Workgroups", href: routes.adminWorkgroups },
  { id: "collections", label: "Collections", href: routes.adminCollections },
  { id: "networks", label: "Networks", href: routes.adminNetworks },
];

const AdminTabsLayout = ({ children }: { children: ReactNode }) => (
  <SegmentTabsShell tabs={ADMIN_TABS}>{children}</SegmentTabsShell>
);

export default AdminTabsLayout;
