import { useCallback, useEffect, useState } from "react";
import { useCohortBuilderContext } from "@/providers/CohortBuilderProvider";

const useHoverable = <T extends HTMLElement>(hoverKey?: string) => {
  const [node, setNode] = useState<T | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { hoveredKey, setHoveredKey } = useCohortBuilderContext();

  const setHoverRef = useCallback((el: T | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    if (!node) return;

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (hoverKey) {
        setHoveredKey(hoverKey);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (hoverKey) {
        setHoveredKey(null);
      }
    };

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [node, hoverKey, setHoveredKey]);

  return {
    setHoverRef,
    isHovered,
    isHighlighted: hoverKey ? hoveredKey === hoverKey : isHovered,
  };
};

export default useHoverable;
