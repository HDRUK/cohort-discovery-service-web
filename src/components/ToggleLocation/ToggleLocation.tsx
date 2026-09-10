import { UpdateCollectionFormValues } from "@/types/forms";
import ToggleVertical from "../ToggleVertical";

const ToggleLocation = ({
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
      name="collection.location_enabled"
      labelTrue="Location Enabled"
      labelFalse="Location Disabled"
    />
  );
};

export default ToggleLocation;
