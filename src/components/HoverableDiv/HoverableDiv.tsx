import React, { ReactNode } from "react";
import useHoverable from "@/hooks/useHoverable";
import theme from "@/config/theme";

export interface HoverableDivProps {
  hoverKey: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: ReactNode;
  flex?: boolean;
  style?: React.CSSProperties;
  stopPropagation?: boolean;
}

const HoverableDiv = ({
  hoverKey,
  onClick,
  children,
  stopPropagation = false,
  flex = false,
  style = {},
}: HoverableDivProps) => {
  const { setHoverRef, isHighlighted } = useHoverable<HTMLDivElement>(hoverKey);

  return (
    <div
      ref={setHoverRef}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        if (onClick) onClick(e);
      }}
      style={{
        ...(flex && {
          display: "flex",
          justifyItems: "flex-start",
        }),
        backgroundColor: isHighlighted ? theme.palette.grey[300] : "inherit",
        borderRadius: "12px",
        padding: "8px",
        transition: "border-color 0.2s",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default HoverableDiv;
