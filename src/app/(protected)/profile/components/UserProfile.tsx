"use client";

import UserProfileDetails from "./UserProfileDetails";
import useUserStore from "@/hooks/useUserStore";

const UserProfile = () => {
  const user = useUserStore((s) => s.user);

  return <>{user && <UserProfileDetails user={user} />}</>;
};

export default UserProfile;
