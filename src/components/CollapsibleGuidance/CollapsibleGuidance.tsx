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
  const active = selectedGuidance[guidanceKey] ?? false;
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
    const key = collapsibleGuidanceKey(keyPrefix, selected);
    const showThisGuidance = selectedGuidance[key] ?? false;

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
            if (showThisGuidance) {
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
