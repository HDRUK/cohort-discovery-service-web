import { useMemo } from "react";
import {
  type Control,
  type DeepPartial,
  type FieldValues,
  useFormState,
  useWatch,
} from "react-hook-form";

type DiffLeaf = { old: unknown; new: unknown };

type Diffed<T> = T extends (infer U)[]
  ? Diffed<U>[]
  : T extends object
    ? { [K in keyof T]: Diffed<T[K]> }
    : DiffLeaf;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickDirtyDiff(
  dirty: unknown,
  oldValues: unknown,
  newValues: unknown,
): unknown | undefined {
  if (dirty === true)
    return { old: oldValues, new: newValues } satisfies DiffLeaf;
  if (!isRecord(dirty)) return undefined;

  if (Array.isArray(newValues)) {
    const out: unknown[] = [];
    let hasAny = false;

    for (const key of Object.keys(dirty)) {
      const idx = Number(key);
      if (!Number.isInteger(idx)) continue;

      const child = pickDirtyDiff(
        dirty[key],
        Array.isArray(oldValues) ? oldValues[idx] : undefined,
        newValues[idx],
      );

      if (child !== undefined) {
        out[idx] = child;
        hasAny = true;
      }
    }

    return hasAny ? out : undefined;
  }

  // objects
  if (isRecord(newValues)) {
    const out: Record<string, unknown> = {};
    let hasAny = false;

    const oldObj = isRecord(oldValues) ? oldValues : undefined;

    for (const key of Object.keys(dirty)) {
      const child = pickDirtyDiff(dirty[key], oldObj?.[key], newValues[key]);
      if (child !== undefined) {
        out[key] = child;
        hasAny = true;
      }
    }

    return hasAny ? out : undefined;
  }

  return undefined;
}

export function useChangedFieldValues<TFieldValues extends FieldValues>(opts: {
  control: Control<TFieldValues>;
}): DeepPartial<Diffed<TFieldValues>> {
  const { control } = opts;

  const { dirtyFields, defaultValues } = useFormState({ control });
  const values = useWatch({ control }) as unknown;

  return useMemo(() => {
    const picked = pickDirtyDiff(dirtyFields, defaultValues, values);
    return (picked ?? {}) as DeepPartial<Diffed<TFieldValues>>;
  }, [dirtyFields, defaultValues, values]);
}
