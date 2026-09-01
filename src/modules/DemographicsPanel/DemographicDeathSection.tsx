"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Box, Chip, Skeleton, Stack, Typography } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { demographicGuidance } from "@/config/demographics";
import { Demographics } from "@/types/rules";
import DemographicRow, { DemographicRowActionProps } from "./DemographicRow";
import { useQueryBuilderStore } from "@/store/queryBuilderStore";
import { deathEnum } from "@/types/rules";

const DemographicLocationSection = (props: DemographicRowActionProps) => {
  const { control, setValue } = useFormContext<Demographics>();
  const { death } = useQueryBuilder((qb) => ({
    death: qb.queryBuilderJson.demographics?.death ?? null,
  }));

  const note = demographicGuidance("death");

  const size = 24;

  const handleEditStart = () => {
    props.onEditStart();
    if (!death) setValue("death", deathEnum.UNKNOWN_OR_ALIVE);
  };

  const boxSx = (field: { value: string | null }, deathState: string) => ({
    width: "fit-content",
    height: size,
    minWidth: size,
    minHeight: size,
    borderRadius: size,
    bgcolor: field.value === deathState ? "white" : "grey.400",
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

  useQueryBuilderStore((qb) => {
    console.log(qb);
  });
  console.log("death from qb: ", death);

  return (
    <DemographicRow
      label="Death"
      {...props}
      onEditStart={handleEditStart}
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
                          field.onChange(deathEnum.UNKNOWN_OR_ALIVE);
                        }}
                        sx={boxSx(field, deathEnum.UNKNOWN_OR_ALIVE)}
                      >
                        <Typography
                          variant="body2"
                          color={
                            field.value === deathEnum.UNKNOWN_OR_ALIVE
                              ? "green"
                              : "white"
                          }
                        >
                          {deathEnum.UNKNOWN_OR_ALIVE}
                        </Typography>
                      </Box>
                      <Box
                        data-testid="toggle-action-on"
                        onClick={(e) =>
                          field.onChange(deathEnum.DEATH_RECORDED)
                        }
                        sx={boxSx(field, deathEnum.DEATH_RECORDED)}
                      >
                        <Typography
                          variant="body2"
                          color={
                            field.value === deathEnum.DEATH_RECORDED
                              ? "green"
                              : "white"
                          }
                        >
                          {deathEnum.DEATH_RECORDED}
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
