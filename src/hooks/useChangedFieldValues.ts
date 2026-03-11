import { useMemo } from "react";
import {
  type Control,
  type DeepPartial,
  type FieldValues,
  useFormState,
  useWatch,
} from "react-hook-form";

type DiffLeaf = { old: unknown; new: unknown };

export type Diffed<T> = T extends (infer U)[]
  ? Diffed<U>[]
  : T extends object
    ? { [K in keyof T]: Diffed<T[K]> }
    : DiffLeaf;

export type Ignore = string[] | ((path: string) => boolean);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function shouldIgnorePath(path: string, ignore?: Ignore) {
  if (!ignore) return false;
  if (typeof ignore === "function") return ignore(path);

  return ignore.some(
    (p) => path === p || path.startsWith(p + ".") || path.startsWith(p + "["),
  );
}

function joinPath(base: string, key: string) {
  return base ? `${base}.${key}` : key;
}

function pickDirtyDiff(
  dirty: unknown,
  oldValues: unknown,
  newValues: unknown,
  opts: { path: string; ignore?: Ignore },
): unknown | undefined {
  const { path, ignore } = opts;

  // If this node itself is ignored, stop here.
  if (path && shouldIgnorePath(path, ignore)) return undefined;

  if (dirty === true) {
    return { old: oldValues, new: newValues } satisfies DiffLeaf;
  }

  if (!isRecord(dirty)) return undefined;

  if (Array.isArray(newValues)) {
    const out: unknown[] = [];
    let hasAny = false;

    for (const key of Object.keys(dirty)) {
      const idx = Number(key);
      if (!Number.isInteger(idx)) continue;

      const childPath = joinPath(path, key);
      if (shouldIgnorePath(childPath, ignore)) continue;

      const child = pickDirtyDiff(
        dirty[key],
        Array.isArray(oldValues) ? oldValues[idx] : undefined,
        newValues[idx],
        { path: childPath, ignore },
      );

      if (child !== undefined) {
        out[idx] = child;
        hasAny = true;
      }
    }

    return hasAny ? out : undefined;
  }

  if (isRecord(newValues)) {
    const out: Record<string, unknown> = {};
    let hasAny = false;

    const oldObj = isRecord(oldValues) ? oldValues : undefined;

    for (const key of Object.keys(dirty)) {
      const childPath = joinPath(path, key);
      if (shouldIgnorePath(childPath, ignore)) continue;

      const child = pickDirtyDiff(dirty[key], oldObj?.[key], newValues[key], {
        path: childPath,
        ignore,
      });

      if (child !== undefined) {
        out[key] = child;
        hasAny = true;
      }
    }

    return hasAny ? out : undefined;
  }

  return undefined;
}

export type ChangeFieldValuesProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  ignoreFields?: Ignore;
  //mapValue?
};

export function useChangedFieldValues<TFieldValues extends FieldValues>(
  opts: ChangeFieldValuesProps<TFieldValues>,
): { changed: DeepPartial<Diffed<TFieldValues>>; hasChanges: boolean } {
  const { control, ignoreFields } = opts;

  const { dirtyFields, defaultValues } = useFormState({ control });
  const values = useWatch({ control }) as unknown;

  return useMemo(() => {
    const picked = pickDirtyDiff(dirtyFields, defaultValues, values, {
      path: "",
      ignore: ignoreFields,
    });

    return {
      changed: (picked ?? {}) as DeepPartial<Diffed<TFieldValues>>,
      hasChanges: picked !== undefined,
    };
  }, [dirtyFields, defaultValues, values, ignoreFields]);
}
