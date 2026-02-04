"use client";
import Modal from "@/components/Modal";

const GuidanceModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      title="Guidance"
      open={open}
      onClose={onClose}
      children={<>hey!</>}
    ></Modal>
  );
};

export default GuidanceModal;
