"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import ErrorIcon from "@/components/ErrorIcon";
import { Warning } from "@mui/icons-material";
import useStateManagement from "@/hooks/useStateManagement";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const FeedbackAccordian = ({
  feedback,
  icon,
  noun,
}: {
  feedback: string[];
  icon: React.ReactNode;
  noun: string;
}) => {
  return (
    <Stack direction="row" gap={1} marginLeft={2}>
      {icon}
      {feedback.length === 1 ? (
        <Stack>
          {feedback.map((feedbackItem) => (
            <Typography key={feedbackItem} variant="body1">
              {feedbackItem}
            </Typography>
          ))}
        </Stack>
      ) : (
        <Accordion
          disableGutters
          elevation={0}
          square
          sx={{
            bgcolor: "transparent",
            pb: 1,
            my: 0,
          }}
        >
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="errors-content"
            id="errors-header"
            sx={{
              backgroundColor: "inherit",
              justifyContent: "flex-start",
              minHeight: "auto",
              px: 0.25,
              "& .MuiAccordionSummary-content": {
                flexGrow: 0, // prevents content pushing icon to far right
                my: 0,
                px: 0,
              },
            }}
          >
            <Typography variant="body1">
              {feedback.length} {noun}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ ml: 1.25, pb: 0 }}>
            {feedback.map((feedbackItem) => (
              <ListItem
                key={feedbackItem}
                style={{ display: "list-item" }}
                sx={{ py: 0, pl: 0 }}
              >
                {feedbackItem}
              </ListItem>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
};

const CohortErrors = () => {
  const {
    queryBuilderJson: { warnings = [] },
    errors,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    errors: qb.errors,
  }));

  const isLoading = useStateManagement((s) => s.isLoading);

  if (isLoading) return null;

  return (
    <>
      {errors.length > 0 && (
        <FeedbackAccordian
          icon={<ErrorIcon />}
          feedback={errors}
          noun="Errors"
        />
      )}

      {warnings.length > 0 && (
        <FeedbackAccordian
          icon={<Warning color="warning" />}
          feedback={warnings}
          noun="Warnings"
        />
      )}
    </>
  );
};

export default CohortErrors;
