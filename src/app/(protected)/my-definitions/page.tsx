import { Suspense } from "react";
import { Paper, Typography } from "@mui/material";
import TableSkeleton from "@/components/TableSkeleton";
import MyDefinitions from "./components/MyDefinitions";
import getConceptSets from "@/actions/conceptSet/getConceptSets";

const MyDefinitionsContent = async () => {
  const { data: conceptSets } = await getConceptSets();
  return <MyDefinitions conceptSets={conceptSets} />;
};

export default function MyDefinitionsPage() {
  return (
    <Paper sx={{ width: "100%", minHeight: "100%", p: 2 }}>
      <Typography variant="h2" sx={{ mb: 1 }}>
        My Definitions
      </Typography>
      <Suspense fallback={<TableSkeleton />}>
        <MyDefinitionsContent />
      </Suspense>
    </Paper>
  );
}
