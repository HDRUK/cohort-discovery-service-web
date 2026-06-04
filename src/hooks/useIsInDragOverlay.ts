import { useContext } from "react";
import { DragOverlayRenderContext } from "@/components/DragOverlay/DragOverlay";

const useIsInDragOverlay = () => useContext(DragOverlayRenderContext);

export default useIsInDragOverlay;
