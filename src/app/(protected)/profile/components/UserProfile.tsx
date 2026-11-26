"use client";

import UserProfileDetails from "./UserProfileDetails";
import { useSessionData } from "@/contexts/SessionDataContext";

const UserProfile = () => {
  const user = useSessionData().user;

  return <>{user && <UserProfileDetails user={user} />}</>;
};

export default UserProfile;
