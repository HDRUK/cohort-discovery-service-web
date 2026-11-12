"use client";

import { useCallback, useState } from "react";
import { routes } from "@/config/routes";

const useSignOut = (): { signOut: () => void; isSigningOut: boolean } => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(() => {
    setIsSigningOut(true);
    window.location.assign(routes.logout);
  }, []);

  return { signOut, isSigningOut };
};

export default useSignOut;
