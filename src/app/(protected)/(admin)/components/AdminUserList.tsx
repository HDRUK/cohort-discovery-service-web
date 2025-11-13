"use client";

import { useMemo } from "react";
import type { User } from "@/types/api";

import SearchBox from "@/components/SearchBox";
import { Controller, useForm } from "react-hook-form";
import AdminUserTable from "./AdminUserTable";
import TabsShell from "@/components/TabsShell";
import { useRouter, useSearchParams } from "next/navigation";

type FormValues = {
  userSearchInput: string;
};

const AdminUserList = ({ users }: { users: User[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      userSearchInput: searchParams?.get("searchTerm") || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { userSearchInput } = data;
    const params = new URLSearchParams(searchParams.toString());
    const value = userSearchInput.trim();
    if (value) {
      params.set("searchTerm", value);
    } else {
      params.delete("searchTerm");
    }
    const queryString = params.toString();
    router.replace(queryString ? `?${queryString}` : ".");
  };

  const newUsers = useMemo(
    () => users?.filter((user) => user.new_user_status === 1),
    [users]
  );

  const existingUsers = useMemo(
    () => users?.filter((user) => user.new_user_status === 0),
    [users]
  );

  return (
    <>
      <Controller
        name="userSearchInput"
        control={control}
        defaultValue=""
        rules={{ required: false }}
        render={({ field }) => (
          <SearchBox
            {...field}
            sx={{
              m: 2,
              width: "calc(100% - 60px)",
            }}
            placeholder="Search users..."
            onSubmit={handleSubmit(onSubmit)}
          />
        )}
      />

      <TabsShell tabs={[{ label: "New Users" }, { label: "Existing Users" }]}>
        <AdminUserTable users={newUsers || []} />
        <AdminUserTable users={existingUsers || []} />
      </TabsShell>
    </>
  );
};

export default AdminUserList;
