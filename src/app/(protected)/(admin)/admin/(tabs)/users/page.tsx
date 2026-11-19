import { Suspense } from "react";
import UsersTab, { UsersSkeleton } from "../components/UsersTab";

const applicationMode = process.env.APPLICATION_MODE;

const AdminUsersPage = () => (
  <Suspense fallback={<UsersSkeleton />}>
    <UsersTab applicationMode={applicationMode} />
  </Suspense>
);

export default AdminUsersPage;
