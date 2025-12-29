"use client";

import { Controller, useForm } from "react-hook-form";
import type { FieldPath, DefaultValues } from "react-hook-form";

import useSearchParams from "@/hooks/useSearchParams";
import SearchBox from "@/components/SearchBox";
import type { SearchBoxProps } from "@/components/SearchBox/SearchBox";
import type { ApiSearchParams } from "@/types/api";

type StringParamKey<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined> extends string ? K : never;
}[keyof T] &
  string;

type FormValues<K extends string> = Record<K, string>;

export interface ControlledSearchBoxProps<
  TParams extends ApiSearchParams = ApiSearchParams,
  K extends StringParamKey<TParams> = "search_term" & StringParamKey<TParams>
> extends SearchBoxProps {
  paramName?: K;
  useErrors?: boolean;
}

const ControlledSearchBox = <
  TParams extends ApiSearchParams = ApiSearchParams,
  K extends StringParamKey<TParams> = "search_term" & StringParamKey<TParams>
>({
  paramName,
  useErrors = false,
  ...searchBoxProps
}: ControlledSearchBoxProps<TParams, K>) => {
  const key = (paramName ?? ("search_term" as K)) as K;

  const { getSearchParam, setSearchParam } = useSearchParams(key);

  type FV = FormValues<K>;

  const defaultValues = {
    [key]: getSearchParam() ?? "",
  } as unknown as DefaultValues<FV>;

  const { handleSubmit, control } = useForm<FV>({ defaultValues });

  const onSubmit = (data: FV) => {
    setSearchParam(data[key]);
  };

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
        />
      )}
    />
  );
};

export default ControlledSearchBox;
