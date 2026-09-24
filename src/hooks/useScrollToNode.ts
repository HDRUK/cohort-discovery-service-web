import { RefObject, useEffect } from "react";
import { useCohortBuilderContext } from "@/providers/CohortBuilderProvider";
import { getScrollParent } from "@/utils/html";

type UseScrollToNodeArgs = {
  enabled: boolean;
  boardRef: RefObject<HTMLElement | null>;
};

// Context for this hook:
//
//  1. `CohortBuilderProvider` keeps a registry of every sortable node's DOM element
//     (rules/groups/operators). `useSortable` calls this for every sortable item,
//     including both the query builder rules and the hierarchy items.
//
//  2. `useScrollToNode` is mounted once, in `RuleBoard.tsx`, on the query builder's board.
//     When `pendingScrollToNodeId` changes, it looks that id up via `getSortableNode`,
//     scrolls its container so the element is centred, focuses its input, then clears
//     the pending id.
//
//  3. `scrollToNode` is the trigger you can call from anywhere to perform the actual scroll.
//     An example of its usage can be found in `RuleAlternatives.tsx` and `HierarchyItem.tsx`.

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
    input?.focus({ preventScroll: true });

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
