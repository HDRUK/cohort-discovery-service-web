const getScrollParent = (el: HTMLElement | null): HTMLElement | null => {
  let parent = el?.parentElement ?? null;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);

    if (["auto", "scroll"].includes(overflowY)) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
};

export { getScrollParent };
