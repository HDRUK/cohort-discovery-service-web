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
import { useState } from "react";

const DemographicLocationSection = (props: DemographicRowActionProps) => {
  const { control } = useFormContext<Demographics>();
  const { death } = useQueryBuilder((qb) => ({
    death: qb.queryBuilderJson.demographics?.death ?? null,
  }));

  const [active, setActive] = useState(false);

  const { location } = useQueryBuilder((qb) => ({
    location: qb.queryBuilderJson.demographics?.location ?? null,
  }));

  const note = demographicGuidance("death");

  const children = [
    <ToggleButton value="Unknown/Alive" key="Unknown/Alive">
      <Typography variant="body2" color="text.secondary">
        Unknown/Alive
      </Typography>
    </ToggleButton>,
    <ToggleButton value="Death recorded" key="Death recorded">
      <Typography variant="body2" color="text.secondary">
        Death recorded
      </Typography>
    </ToggleButton>,
  ];

  const size = 24;

  useQueryBuilderStore((qb) => {
    console.log(qb);
  });
  console.log("death from qb: ", death);

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
              console.log("death field: ", field);

              return (
                <>
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      width: "fit-content",
                      maxWidth: "fit-content",

                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: size / 2,
                        right: size / 2,
                        top: "50%",
                        transform: "translateY(-50%)",
                        height: size * 0.5,
                        bgcolor: "grey.400",
                        zIndex: 0,
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <Stack direction={"row"} gap={0.3}>
                      <Box
                        data-testid="toggle-action-off"
                        onClick={(e) => {
                          field.onChange(e.currentTarget.innerText);
                        }}
                        sx={{
                          width: "fit-content",
                          height: size,
                          minWidth: size,
                          minHeight: size,
                          borderRadius: size,
                          bgcolor:
                            field.value === "Unknown/Alive"
                              ? "white"
                              : "grey.400",
                          border: field.value === "Unknown/Alive" ? 1 : 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          px: 2,
                          zIndex: 1,
                          "& svg": {
                            transition: "transform 0.15s ease",
                          },

                          "&:hover svg": {
                            transform: "scale(1.15)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={
                            field.value === "Unknown/Alive" ? "green" : "white"
                          }
                        >
                          Unknown/Alive
                        </Typography>
                      </Box>
                      <Box
                        data-testid="toggle-action-on"
                        onClick={(e) =>
                          field.onChange(e.currentTarget.innerText)
                        }
                        sx={{
                          width: "fit-content",
                          height: size,
                          minWidth: size,
                          minHeight: size,
                          borderRadius: size,
                          bgcolor:
                            field.value === "Death recorded"
                              ? "white"
                              : "grey.400",
                          border: field.value === "Death recorded" ? 1 : 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          px: 2,
                          zIndex: 1,
                          "& svg": {
                            transition: "transform 0.15s ease",
                          },

                          "&:hover svg": {
                            transform: "scale(1.15)",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={
                            field.value === "Death recorded" ? "green" : "white"
                          }
                        >
                          Death recorded
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </>
              );
            }}
          />
        </Box>
      }
    >
      <Chip
        variant="outlined"
        sx={{ bgcolor: "white" }}
        label={death ?? "Any"}
      />
    </DemographicRow>
  );
};

export default DemographicLocationSection;
