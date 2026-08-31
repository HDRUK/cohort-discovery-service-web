"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { demographicGuidance } from "@/config/demographics";
import { Demographics } from "@/types/rules";
import DemographicRow, { DemographicRowActionProps } from "./DemographicRow";

import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useQueryBuilderStore } from "@/store/queryBuilderStore";

const DemographicLocationSection = (props: DemographicRowActionProps) => {
  const { control } = useFormContext<Demographics>();
  const { death } = useQueryBuilder((qb) => ({
    death: qb.queryBuilderJson.demographics?.death ?? null,
  }));

  const { location } = useQueryBuilder((qb) => ({
    location: qb.queryBuilderJson.demographics?.location ?? null,
  }));

  const note = demographicGuidance("death");

  const children = [
    <ToggleButton value="left" key="left">
      <Typography variant="body2" color="text.secondary">
        Unknown/Alive
      </Typography>
    </ToggleButton>,
    <ToggleButton value="center" key="center">
      <Typography variant="body2" color="text.secondary">
        Death recorded
      </Typography>
    </ToggleButton>,
  ];

  useQueryBuilderStore((qb) => {
    console.log(qb);
  });
  console.log("control: ", control);

  return (
    <DemographicRow
      label="Death"
      {...props}
      showClear={death !== null}
      renderEditing={
        <Box
          sx={{ maxHeight: 450, overflowY: "auto", overflowX: "hidden", pr: 1 }}
        >
          <Controller
            name="death"
            control={control}
            render={({ field }) => {
              console.log("field: ", field);

              return (
                <>
                  <ToggleButtonGroup
                    value={field.value}
                    onChange={field.onChange}
                    aria-label="Death options"
                  >
                    {children}
                  </ToggleButtonGroup>
                  <Typography variant="body2" color="text.secondary">
                    {note}
                  </Typography>
                </>
              );
            }}
          />
        </Box>
      }
    >
      <Chip variant="outlined" sx={{ bgcolor: "white" }} label={"test"} />
    </DemographicRow>
  );
};

export default DemographicLocationSection;
