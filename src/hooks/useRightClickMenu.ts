import { useCallback, useState } from "react";

const useRightClickMenu = () => {
  const [menuPos, setMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setMenuPos((current) =>
        current === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null,
      );
    },
    [],
  );

  const handleClose = () => setMenuPos(null);

  return {
    handleContextMenu,
    handleClose,
    open: menuPos != null,
    menuPos,
  };
};

export default useRightClickMenu;
