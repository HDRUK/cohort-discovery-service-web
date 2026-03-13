"use client";
import Modal from "@/components/Modal";
import { maskClientTest } from "@/lib/maskClientTest";
import { Box } from "@mui/material";

const QueryBuilderGuidance = maskClientTest(
  () =>
    import("@/app/(protected)/dashboard/[tabId]/components/QueryBuilderGuidance"),
);

const QueryBuilderWelcome = maskClientTest(
  () =>
    import("@/app/(protected)/dashboard/[tabId]/components/QueryBuilderWelcome"),
);

const GuidanceModal = ({
  open,
  onClose,
  showHeader = false,
}: {
  open: boolean;
  onClose: () => void;
  showHeader?: boolean;
}) => {
  return (
    <Modal
      showTitle={false}
      open={open}
      onClose={onClose}
      closeButtonSx={{ bgcolor: "#475DA7" }}
      maxWidth="lg"
    >
      {true ? (
        <Box display="flex" flexDirection="column">
          <QueryBuilderWelcome onClose={onClose} />
          <QueryBuilderGuidance />
        </Box>
      ) : (
        <QueryBuilderGuidance onClose={onClose} />
      )}
    </Modal>
  );
};

export default GuidanceModal;
