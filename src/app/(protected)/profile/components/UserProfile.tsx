"use client";

import { useDaphneStore } from "@/store/useDaphneStore";
import UserDetailsTable from "./UserDetailsTable";

const UserProfile = () => {
  const {
    userData: { user },
  } = useDaphneStore();

  return <>{user && <UserDetailsTable user={user} />}</>;
};

export default UserProfile;
