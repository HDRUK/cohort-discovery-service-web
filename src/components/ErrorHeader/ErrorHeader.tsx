import { Link, Typography } from "@mui/material";
import { FieldErrors } from "react-hook-form";
import { startCase } from "lodash";

const ErrorHeader = ({
  errors,
  depth,
  editing = false,
}: {
  errors: FieldErrors;
  depth: number;
  editing?: boolean;
}) => {
  if (depth === 1) {
    return (
      Object.keys(errors).length > 0 &&
      Object.entries(errors).map(([error_entry, _]) => {
        return (
          <Typography key={`${error_entry}`} role="alert" color="error">
            Cannot save changes {editing ? "and lock the editing" : ""} as a
            mandatory field has been left empty in the{" "}
            <Link href={`#${error_entry}`}> {startCase(error_entry)}</Link>
          </Typography>
        );
      })
    );
  } else if (depth === 2) {
    return (
      Object.keys(errors).length > 0 &&
      Object.entries(errors).map(([error_section, error]) => {
        if (error === undefined) {
          return null;
        }
        return Object.entries(error).map(([error_entry, _]) => {
          return (
            <Typography
              key={`${error_section}.${error_entry}`}
              role="alert"
              color="error"
            >
              Cannot save changes {editing ? "and lock the editing" : ""} as a
              mandatory field has been left empty in the{" "}
              <Link href={`#${error_section}.${error_entry}`}>
                {startCase(`${error_section} ${error_entry}`)}
              </Link>
            </Typography>
          );
        });
      })
    );
  } else {
    return null;
  }
};

export default ErrorHeader;
