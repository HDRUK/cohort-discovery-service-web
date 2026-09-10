"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, Chip, Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  demographicGuidance,
  demographicUnavailableGuidance,
} from "@/config/demographics";
import { Demographics, DEATH_OPTIONS } from "@/types/rules";
import DemographicRow, { DemographicRowActionProps } from "./DemographicRow";

interface DemographicDeathSectionProps extends DemographicRowActionProps {
  deathAvailable: boolean;
}

const DemographicDeathSection = ({
  deathAvailable,
  ...props
}: DemographicDeathSectionProps) => {
  const { control, setValue } = useFormContext<Demographics>();
  const { death } = useQueryBuilder((qb) => ({
    death: qb.queryBuilderJson.demographics?.death ?? null,
  }));

  const note = demographicGuidance("death");

  const size = 24;

  const handleEditStart = () => {
    props.onEditStart();
    if (!death) setValue("death", DEATH_OPTIONS[0]);
  };

  const boxSx = (selected: boolean) => ({
    width: "fit-content",
    height: size,
    minWidth: size,
    minHeight: size,
    borderRadius: size,
    bgcolor: selected ? "white" : "grey.500",
    border: selected ? 1 : 0,
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
  });

  return (
    <DemographicRow
      label="Death"
      {...props}
      onEditStart={handleEditStart}
      showClear={death !== null}
      renderEditing={
        !deathAvailable ? (
          <Typography variant="body2" color="text.secondary">
            {demographicUnavailableGuidance("death")}
          </Typography>
        ) : (
          <Box
            sx={{
              maxHeight: 450,
              overflowY: "auto",
              overflowX: "hidden",
              pr: 1,
            }}
          >
            <Controller
              name="death"
              control={control}
              render={({ field }) => {
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
                          bgcolor: "grey.500",
                          zIndex: 0,
                          pointerEvents: "none",
                        },
                      }}
                    >
                      <Stack direction={"row"} gap={0.3}>
                        {DEATH_OPTIONS.map((option) => {
                          const selected = field.value?.value === option.value;
                          const toggle = () =>
                            field.onChange(selected ? null : option);

                          return (
                            <Box
                              key={option.value}
                              data-testid={`toggle-death-action-${option.value}`}
                              onClick={toggle}
                              sx={boxSx(selected)}
                            >
                              <Typography
                                variant="body2"
                                color={selected ? "green" : "white"}
                                sx={{ userSelect: "none" }}
                              >
                                {option.label}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {note}
                    </Typography>
                  </>
                );
              }}
            />
          </Box>
        )
      }
    >
      <Chip
        variant="outlined"
        sx={{ bgcolor: "white" }}
        data-testid="death-chip"
        label={death?.label ?? "Any"}
      />
    </DemographicRow>
  );
};

export default DemographicDeathSection;
