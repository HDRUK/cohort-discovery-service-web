import { Concept } from "@/types/api";
import { Box, Button, Stack, Typography } from "@mui/material";
import ConceptChip from "@/components/ConceptChip";
import { getDomain } from "@/utils/omop";

interface SelectedConceptsPanelProps {
  concepts: Concept[];
  onRemove: (concept: Concept) => void;
  onClearAll: () => void;
}

const SelectedConceptsPanel = ({
  concepts,
  onRemove,
  onClearAll,
}: SelectedConceptsPanelProps) => (
  <Box sx={{ mt: 1 }}>
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      py={0.5}
    >
      <Typography variant="body2" color="text.secondary">
        Items selected / {concepts.length}
      </Typography>
      {concepts.length > 0 && (
        <Button
          variant="text"
          size="small"
          color="secondary"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </Stack>
    <Stack spacing={0.5}>
      {concepts.map((c) => (
        <ConceptChip
          key={c.concept_id}
          concept={c}
          categoryLabel={getDomain(c) || undefined}
          onDelete={(e) => {
            e.stopPropagation();
            onRemove(c);
          }}
        />
      ))}
    </Stack>
  </Box>
);

export default SelectedConceptsPanel;
