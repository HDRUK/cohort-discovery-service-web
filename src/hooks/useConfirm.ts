import {
  ConfirmContext,
  ConfirmFn,
  ConfirmOptions,
} from "@/components/ConfirmProvider/ConfirmProvider";
import { useContext } from "react";

export function useConfirm(): ConfirmFn {
  const confirm = useContext(ConfirmContext);
  if (!confirm)
    throw new Error("useConfirm must be used within <ConfirmProvider>");
  return confirm;
}

export type ConfirmBoolFn = (options?: ConfirmOptions) => Promise<boolean>;

export function useConfirmBool(): ConfirmBoolFn {
  const confirm = useConfirm();
  return (opts) => confirm(opts).then((r) => r === "confirm");
}
