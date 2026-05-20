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

    let frameId = 0;
    let attempts = 0;
    const maxAttempts = 10;

    const tryScrollAndFocus = () => {
      const board = boardRef.current;
      const container = getScrollParent(board);
      const el = getSortableNode(pendingScrollToNodeId);

      if (!container || !el) {
        if (attempts++ < maxAttempts) {
          frameId = requestAnimationFrame(tryScrollAndFocus);
          return;
        }

        clearPendingScrollToNodeId();
        return;
      }

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

      const input = el.querySelector<HTMLInputElement>("input");

      if (!input && attempts++ < maxAttempts) {
        frameId = requestAnimationFrame(tryScrollAndFocus);
        return;
      }

      input?.focus({ preventScroll: true });
      clearPendingScrollToNodeId();
    };

    tryScrollAndFocus();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [
    enabled,
    boardRef,
    getSortableNode,
    pendingScrollToNodeId,
    clearPendingScrollToNodeId,
  ]);
};

export default useScrollToNode;
