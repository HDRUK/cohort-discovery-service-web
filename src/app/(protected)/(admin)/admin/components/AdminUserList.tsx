"use client";

import { useMemo } from "react";
import type { ApiSearchParams, User } from "@/types/api";
import AdminUserTable from "./AdminUserTable";
import TabsShell from "@/components/TabsShell";
import ControlledSearchBox from "@/modules/ControlledSearchBox";

export interface UserSearchParams extends ApiSearchParams {
  name?: string;
}

const AdminUserList = ({ users }: { users: User[] }) => {
  const newUsers = useMemo(
    () => users?.filter((user) => user.new_user_status === 1),
    [users],
  );

  const existingUsers = useMemo(
    () => users?.filter((user) => user.new_user_status === 0),
    [users],
  );

  return (
    <>
      <ControlledSearchBox<UserSearchParams>
        paramName="name"
        sx={{
          m: 2,
          width: "calc(100% - 60px)",
        }}
        placeholder="Search users..."
      />
      <TabsShell
        tabs={[
          {
            label: "New Users",
            page: <AdminUserTable users={newUsers || []} />,
          },
          {
            label: "Existing Users",
            page: <AdminUserTable users={existingUsers || []} />,
          },
        ]}
      />
    </>
  );
};

export default AdminUserList;
