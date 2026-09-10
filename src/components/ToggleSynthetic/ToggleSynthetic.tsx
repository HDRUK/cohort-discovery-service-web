import { UpdateCollectionFormValues } from "@/types/forms";
import ToggleVertical from "../ToggleVertical";

const ToggleSynthetic = ({
  label,
  disabled = false,
}: {
  label?: string;
  disabled?: boolean;
}) => {
  return (
    <ToggleVertical<UpdateCollectionFormValues>
      label={label}
      disabled={disabled}
      name="collection.is_synthetic"
      labelTrue="Synthetic"
      labelFalse="Non-synthetic"
    />
  );
};

export default ToggleSynthetic;
