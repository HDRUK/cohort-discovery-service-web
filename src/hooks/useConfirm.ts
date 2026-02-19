import {
  ConfirmContext,
  ConfirmFn,
} from "@/components/ConfirmProvider/ConfirmProvider";
import { useContext } from "react";

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm)
    throw new Error("useConfirm must be used within <ConfirmProvider>");
  return confirm;
}
