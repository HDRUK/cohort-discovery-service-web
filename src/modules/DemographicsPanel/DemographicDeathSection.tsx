"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, Chip, Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  demographicGuidance,
  demographicUnavailableGuidance,
} from "@/config/demographics";
import { Demographics, DeathStatus, deathLabel } from "@/types/rules";
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
    if (!death) setValue("death", DeathStatus.UNKNOWN_OR_ALIVE);
  };

  const boxSx = (field: { value: string | null }, deathState: string) => ({
    width: "fit-content",
    height: size,
    minWidth: size,
    minHeight: size,
    borderRadius: size,
    bgcolor: field.value === deathState ? "white" : "grey.500",
    border: field.value === deathState ? 1 : 0,
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
                        <Box
                          data-testid="toggle-action-off"
                          onClick={() => {
                            field.onChange(DeathStatus.UNKNOWN_OR_ALIVE);
                          }}
                          sx={boxSx(field, DeathStatus.UNKNOWN_OR_ALIVE)}
                        >
                          <Typography
                            variant="body2"
                            color={
                              field.value === DeathStatus.UNKNOWN_OR_ALIVE
                                ? "green"
                                : "white"
                            }
                          >
                            {deathLabel(DeathStatus.UNKNOWN_OR_ALIVE)}
                          </Typography>
                        </Box>
                        <Box
                          data-testid="toggle-action-on"
                          onClick={() =>
                            field.onChange(DeathStatus.DEATH_RECORDED)
                          }
                          sx={boxSx(field, DeathStatus.DEATH_RECORDED)}
                        >
                          <Typography
                            variant="body2"
                            color={
                              field.value === DeathStatus.DEATH_RECORDED
                                ? "green"
                                : "white"
                            }
                          >
                            {deathLabel(DeathStatus.DEATH_RECORDED)}
                          </Typography>
                        </Box>
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
        label={deathLabel(death) ?? "Any"}
      />
    </DemographicRow>
  );
};

export default DemographicDeathSection;
