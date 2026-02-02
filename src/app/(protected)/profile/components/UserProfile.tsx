"use client";

import UserDetailsTable from "./UserDetailsTable";
import useUserStore from "@/hooks/useUserStore";

const UserProfile = () => {
  const user = useUserStore((s) => s.user);

  return <>{user && <UserDetailsTable user={user} />}</>;
};

export default UserProfile;
