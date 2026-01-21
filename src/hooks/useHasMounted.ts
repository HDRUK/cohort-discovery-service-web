import { useEffect, useState } from "react";
const isTest = process.env.NODE_ENV === "test";

const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(
    isTest ? typeof window !== "undefined" : false,
  );

  useEffect(() => {
    const t = setTimeout(() => setHasMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return hasMounted;
};

export default useHasMounted;
