import React, { createContext, useContext, useState } from "react";

const HoverContext = createContext<{
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
}>({
  isHovered: false,
  setHovered: () => {},
});

export const HoverProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <HoverContext.Provider value={{ isHovered, setHovered }}>
      {children}
    </HoverContext.Provider>
  );
};

export const useHover = () => useContext(HoverContext);
