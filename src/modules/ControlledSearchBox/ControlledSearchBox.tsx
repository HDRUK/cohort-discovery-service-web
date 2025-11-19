"use client";

import { Controller, useForm } from "react-hook-form";
import useSearchParams from "@/hooks/useSearchParams";
import SearchBox from "@/components/SearchBox";
import { SearchBoxProps } from "@/components/SearchBox/SearchBox";

type FormValues = {
  searchTerm: string;
};

interface ControlledSearchBoxProps extends SearchBoxProps {
  paramName?: string;
  useErrors?: boolean;
}

const ControlledSearchBox = ({
  paramName,
  useErrors = false,
  ...searchBoxProps
}: ControlledSearchBoxProps) => {
  const { getSearchParam, setSearchParam } = useSearchParams(paramName);
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      searchTerm: getSearchParam() || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setSearchParam(data.searchTerm);
  };

  return (
    <Controller
      name="searchTerm"
      control={control}
      render={({ field, fieldState: { error, isDirty } }) => (
        <SearchBox
          {...searchBoxProps}
          {...field}
          {...(useErrors
            ? {
                error: !!error,
                label: !isDirty && error?.message,
              }
            : {})}
          collapsible={false}
          onSubmit={handleSubmit(onSubmit)}
        />
      )}
    />
  );
};

export default ControlledSearchBox;
