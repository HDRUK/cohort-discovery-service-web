import { ReactNode, Children } from "react";
import { CustomH1 } from "../GuidanceHeaders";
import { Box, BoxProps, ClickAwayListener, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";
import theme from "@/config/theme";

const ToggleGuidanceButton = ({
  guidanceKey,
  selectedGuidance,
  setSelectedGuidance,
}: {
  guidanceKey: string;
  selectedGuidance: Record<string, boolean>;
  setSelectedGuidance: (id: string, value: boolean) => void;
}) => {
  const active =
    guidanceKey in selectedGuidance && selectedGuidance[guidanceKey] === true;
  const handleClick = () => {
    setSelectedGuidance(guidanceKey, !active);
  };

  return (
    <IconButton size="small">
      <InfoIcon
        onClick={handleClick}
        sx={{ color: active ? theme.palette.tooltip?.main : null }}
      />
    </IconButton>
  );
};
interface CollapsibleGuidanceProps extends Omit<
  BoxProps,
  "children" | "title"
> {
  title: ReactNode;
  keyPrefix: string;
  children?: ReactNode | ReactNode[];
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

    // Ensure we have an array we can index into without TypeScript errors
    const childrenArray = Children.toArray(children as ReactNode[]);

    return (
      <>
        {title && (
          <CustomH1>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {title}
              <ToggleGuidanceButton
                guidanceKey={key}
                selectedGuidance={selectedGuidance}
                setSelectedGuidance={setSelectedGuidance}
              />
            </Box>
          </CustomH1>
        )}
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
            {showThisGuidance ? children : childrenArray[0]}
          </Box>
        </ClickAwayListener>
      </>
    );
  }

  return null;
};

export default CollapsibleGuidance;
