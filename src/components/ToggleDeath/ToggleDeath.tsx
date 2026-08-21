import { UpdateCollectionFormValues } from "@/types/forms";
import ToggleVertical from "../ToggleVertical";

const ToggleDeath = ({
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
      name="collection.death_enabled"
      labelTrue="Death Enabled"
      labelFalse="Death Disabled"
    />
  );
};

export default ToggleDeath;
