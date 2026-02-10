import { ReactNode } from "react";
import { CustomH1 } from "../GuidanceHeaders";
import { Box, BoxProps, ClickAwayListener } from "@mui/material";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

interface CollapsibleGuidanceProps extends Omit<
  BoxProps,
  "children" | "title"
> {
  title: ReactNode;
  keyPrefix: string;
  children: ReactNode[];
}
const CollapsibleGuidance = ({
  title,
  keyPrefix,
  children,
}: CollapsibleGuidanceProps) => {
  const { selectedGuidance, setSelectedGuidance, selected } = useQueryBuilder(
    (qb) => ({
      selectedGuidance: qb.selectedGuidance,
      setSelectedGuidance: qb.setSelectedGuidance,
      selected: qb.selected,
    }),
  );
  if (children) {
    // const firstChild = children[0] ?? null;
    // if (Object.keys(selected).length === 1) {
    //   console.log("selected", Object.keys(selected)[0]);
    // } else {
    //   console.log("selected", "multiple");
    // }
    // const keySuffix =
    //   Object.keys(selected).length === 1
    //     ? Object.keys(selected)[0]
    //     : "multiple";
    // console.log("keySuffix", keySuffix);
    const key = collapsibleGuidanceKey(keyPrefix, selected);
    // console.log("key", key);
    // console.log(`CollapsibleGuidance ${keyPrefix} children`, children);
    // console.log(
    //   `CollapsibleGuidance ${keyPrefix} last child`,
    //   children[children.length - 1],
    // );
    // console.log("other children", children.slice(0, children.length - 1));
    // console.log("selectedGuidance", selectedGuidance);
    // console.log("key", key);
    const showThisGuidance =
      key in selectedGuidance && selectedGuidance[key] === true;
    // console.log("showThisGuidance", showThisGuidance);
    return (
      <>
        {title && <CustomH1>{title}</CustomH1>}
        <ClickAwayListener
          onClickAway={() => {
            console.log(
              `clickaway detected from ${key} while selectedGuidance is`,
              selectedGuidance,
            );
            if (showThisGuidance) {
              console.log(`clickaway actioned for ${key}`);
              setSelectedGuidance(key, false);
            }
          }}
        >
          <Box sx={{ p: 0, m: 0 }}>
            {showThisGuidance ? children : children[0]}
          </Box>
        </ClickAwayListener>
      </>
    );
  }

  return null;
};

export default CollapsibleGuidance;
