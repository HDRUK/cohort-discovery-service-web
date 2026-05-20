import { RefObject, useEffect } from "react";
import { useCohortBuilderContext } from "@/providers/CohortBuilderProvider";
import { getScrollParent } from "@/utils/html";

type UseScrollToNodeArgs = {
  enabled: boolean;
  boardRef: RefObject<HTMLElement | null>;
};

const useScrollToNode = ({ enabled, boardRef }: UseScrollToNodeArgs) => {
  const { getSortableNode, pendingScrollToNodeId, clearPendingScrollToNodeId } =
    useCohortBuilderContext();

  useEffect(() => {
    if (!enabled || !pendingScrollToNodeId) return;

    const board = boardRef.current;
    const container = getScrollParent(board);
    const el = getSortableNode(pendingScrollToNodeId);

    if (!container || !el) return;

    const input = el.querySelector<HTMLInputElement>("input");
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const top =
      elRect.top -
      containerRect.top +
      container.scrollTop -
      container.clientHeight / 2 +
      elRect.height / 2;

    container.scrollTo({
      top,
      behavior: "smooth",
    });

    input?.focus({ preventScroll: true });

    clearPendingScrollToNodeId();
  }, [
    enabled,
    boardRef,
    getSortableNode,
    pendingScrollToNodeId,
    clearPendingScrollToNodeId,
  ]);
};

export default useScrollToNode;
