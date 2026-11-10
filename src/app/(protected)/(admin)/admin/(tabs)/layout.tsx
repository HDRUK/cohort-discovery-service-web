import { ReactNode, Suspense } from "react";
import SegmentTabsShell from "@/components/SegmentTabsShell";
import { routes } from "@/config/routes";
import { isStandalone } from "@/utils/modes";
import { CollectionsSkeleton } from "@/modules/CollectionsTab/CollectionsTab";
import AdminGate from "../components/AdminGate";
import AdminSection from "../components/AdminSection";

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
  <SegmentTabsShell tabs={ADMIN_TABS}>
    <Suspense fallback={<CollectionsSkeleton />}>
      <AdminGate>
        <AdminSection>{children}</AdminSection>
      </AdminGate>
    </Suspense>
  </SegmentTabsShell>
);

export default AdminTabsLayout;
