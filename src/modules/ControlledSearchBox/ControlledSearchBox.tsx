"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import type { FieldPath, DefaultValues } from "react-hook-form";
import { useCallback, useRef } from "react";

import useSearchParams from "@/hooks/useSearchParams";
import SearchBox from "@/components/SearchBox";
import type { SearchBoxProps } from "@/components/SearchBox/SearchBox";
import type { ApiSearchParams } from "@/types/api";
import { useDebounce } from "@/hooks/useDebounce";
import { DEFAULT_SEARCH_WAIT_TIME } from "@/config/defaults";

type StringParamKey<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined> extends string ? K : never;
}[keyof T] &
  string;

type FormValues<K extends string> = Record<K, string>;

export interface ControlledSearchBoxProps<
  TParams extends ApiSearchParams = ApiSearchParams,
  K extends StringParamKey<TParams> = StringParamKey<TParams>,
> extends SearchBoxProps {
  paramName?: K;
  useErrors?: boolean;
  submitOnChange?: boolean;
  submitDelay?: number;
}

const ControlledSearchBox = <
  TParams extends ApiSearchParams = ApiSearchParams,
  K extends StringParamKey<TParams> = StringParamKey<TParams>,
>({
  paramName,
  useErrors = false,
  submitOnChange = false,
  submitDelay = DEFAULT_SEARCH_WAIT_TIME,
  onKeyDown,
  ...searchBoxProps
}: ControlledSearchBoxProps<TParams, K>) => {
  const key = (paramName ?? ("search_term" as StringParamKey<TParams>)) as K;

  const { getSearchParam, setSearchParam } = useSearchParams(key);

  type FV = FormValues<K>;

  const defaultValues = {
    [key]: getSearchParam() ?? "",
  } as unknown as DefaultValues<FV>;

  const { handleSubmit, control } = useForm<FV>({ defaultValues });

  const lastSubmittedValueRef = useRef(getSearchParam() ?? "");

  const submitValue = useCallback(
    (value: string) => {
      const nextValue = value.trim();

      if (nextValue === lastSubmittedValueRef.current) return;

      lastSubmittedValueRef.current = nextValue;
      setSearchParam(nextValue);
    },
    [setSearchParam],
  );

  const watchedValues = useWatch({ control });

  const liveInput = String(watchedValues?.[key] ?? "");

  const { flush: flushSearchedValue } = useDebounce(liveInput, {
    delay: submitDelay,
    shouldApplyImmediately: (value) => value.trim() === "",
    onValueChange: submitOnChange ? submitValue : undefined,
  });

  const onSubmit = useCallback(
    (data: FV) => {
      submitValue(data[key] ?? "");
      flushSearchedValue();
    },
    [submitValue, flushSearchedValue, key],
  );

  return (
    <Controller<FV>
      name={key as unknown as FieldPath<FV>}
      control={control}
      render={({ field, fieldState: { error, isDirty } }) => (
        <SearchBox
          {...searchBoxProps}
          {...field}
          {...(useErrors
            ? { error: !!error, label: !isDirty && error?.message }
            : {})}
          collapsible={false}
          onSubmit={handleSubmit(onSubmit)}
          onClickEndAdornment={handleSubmit(onSubmit)}
          onKeyDown={(e) => {
            onKeyDown?.(e);

            if (e.defaultPrevented) return;

            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(onSubmit)();
            }
          }}
        />
      )}
    />
  );
};

export default ControlledSearchBox;
