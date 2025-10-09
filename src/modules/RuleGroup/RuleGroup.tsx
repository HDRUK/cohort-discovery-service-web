import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";

import { useState } from "react";
import { RuleGroupType } from "@/types/rules";
import { useDaphneStore } from "@/store/useDaphneStore";
import {
  updateById,
  removeById,
  createRule,
  createOperator,
} from "@/utils/rules";

import RuleBoard from "../RuleBoard";
import RuleWrapper from "../RuleWrapper";

interface RuleProps {
  group: RuleGroupType;
  sortable?: boolean;
  showConnector?: boolean;
}

const RuleGroup = ({ group, sortable = true }: RuleProps) => {
  const { id, rules, exclude } = group;
  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson },
  } = useDaphneStore();

  const [menuPos, setMenuPos] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuPos(
      menuPos === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    );
  };

  const handleCollapseGroup = () => {};

  const handleClose = () => {
    setMenuPos(null);
  };
  const handleCreateNewRule = () => {
    const newRules = [...rules, createRule()];

    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => ({
        ...node,
        rules: newRules,
      }))
    );

    handleClose();
  };

  const handleCreateNewOperator = () => {
    const newRules = [...rules, createOperator()];

    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => ({
        ...node,
        rules: newRules,
      }))
    );

    handleClose();
  };

  const handleDeleteRule = () => {
    setQueryBuilderJson(removeById(queryBuilderJson, id));
    handleClose();
  };

  return (
    <RuleWrapper
      id={id}
      sortable={sortable}
      render={(ref) => (
        <Card
          ref={ref}
          key={id}
          sx={{
            p: 2,
            border: 1,
            width: "100%",
          }}
          onContextMenu={handleContextMenu}
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              p: 0,
              m: 0,
              pb: 1,
            }}
            avatar={
              <Chip
                color={exclude ? "error" : "primary"}
                sx={{
                  bgcolor: "white",
                }}
                variant="outlined"
                label={exclude ? "Exclude" : "Include"}
              />
            }
            action={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5">Group</Typography>
              </Box>
            }
          />
          <CardContent>
            <RuleBoard ruleGroup={group} />
          </CardContent>
          <Menu
            open={menuPos !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
              menuPos !== null
                ? { top: menuPos.mouseY, left: menuPos.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleCreateNewRule}>Add Rule</MenuItem>
            <MenuItem onClick={handleCreateNewOperator}>Add Operator</MenuItem>
            <MenuItem onClick={handleCollapseGroup}>Collapse Group</MenuItem>
            <MenuItem onClick={handleDeleteRule}>Delete</MenuItem>
          </Menu>
        </Card>
      )}
    />
  );
};

export default RuleGroup;
