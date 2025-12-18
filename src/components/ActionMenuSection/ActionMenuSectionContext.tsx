import { createContext } from "react";

type ActionMenuSectionCtx = { compact: boolean };
export const ActionMenuSectionContext = createContext<ActionMenuSectionCtx>({
  compact: false,
});
