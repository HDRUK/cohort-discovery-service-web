import { Typography, Grid, Chip, Box } from "@mui/material";
import ActionMenuSection from "../ActionMenuSection";
import { ReactNode } from "react";

export interface CollectionMetadata {
  created_at: string;
  os: string | null;
  bclink: string;
  biobank: string;
  datamodel: string;
  protocol: string;
  rounding: string;
  threshold: string;
}

type MetadataPanelProps = {
  metadata?: CollectionMetadata | null;
};

type MetadataItemProps = {
  label: string;
  value: ReactNode;
};

const MetadataItem = ({ label, value }: MetadataItemProps) => {
  const isPrimitive =
    typeof value === "string" || typeof value === "number" || value == null;

  return (
    <>
      <Grid size={4}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Grid>

      <Grid size={8}>
        {isPrimitive ? (
          <Typography variant="body2">{value ?? "-"}</Typography>
        ) : (
          <Box>{value}</Box>
        )}
      </Grid>
    </>
  );
};

const MetadataPanel = ({ metadata }: MetadataPanelProps) => {
  if (!metadata) return null;

  return (
    <ActionMenuSection title="Metadata" underline boldTitle={false}>
      <Grid container spacing={1} padding={2}>
        <MetadataItem
          label="Created"
          value={new Date(metadata.created_at).toLocaleString()}
        />
        <MetadataItem label="OS" value={metadata.os ?? "-"} />
        <MetadataItem label="Biobank" value={metadata.biobank} />
        <MetadataItem label="Data Model" value={metadata.datamodel} />
        <MetadataItem label="Protocol" value={metadata.protocol} />
        <MetadataItem label="Rounding" value={metadata.rounding} />
        <MetadataItem label="Threshold" value={metadata.threshold} />
        <MetadataItem
          label="BC Link Version"
          value={<Chip label={metadata.bclink} size="small" />}
        />
        <MetadataItem label="Death Table" value={metadata.death_filter} />
      </Grid>
    </ActionMenuSection>
  );
};

export default MetadataPanel;
