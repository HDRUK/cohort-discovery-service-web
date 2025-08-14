"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

const Anchor = ({ name }: { name: string }) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const queryId = searchParams.get(name);

  useEffect(() => {
    if (!queryId || !anchorRef.current) return;

    const id = requestAnimationFrame(() => {
      anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => cancelAnimationFrame(id);
  }, [queryId]);

  return <div ref={anchorRef} id={`${name}-anchor`} aria-hidden />;
};

export default Anchor;
