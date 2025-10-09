import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Chip,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import SearchConcepts from "@/components/SearchConcepts";
import { Concept } from "@/types/api";
import { useState } from "react";
import ConceptChip from "@/components/ConceptChip";
import { RuleLeafType } from "@/types/rules";
import { useDaphneStore } from "@/store/useDaphneStore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  isEmptyRule,
  updateById,
  removeById,
  isSingleConcept,
  isRuleLeaf,
  ruleToGroup,
  isMultipleConcept,
} from "@/utils/rules";

import RuleWrapper from "../RuleWrapper";

interface RuleProps {
  rule: RuleLeafType;
  sortable?: boolean;
}

const Rule = ({ rule, sortable = true }: RuleProps) => {
  const {
    id,
    exclude,
    valid = true,
    rule: { concept },
  } = rule;

  const domain =
    concept && Array.isArray(concept)
      ? concept?.[0].category
      : concept?.category;

  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson },
  } = useDaphneStore();

  const setConcept = (c: Concept) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            rule: { ...node.rule, concept: c },
          };
        }
        return node;
      })
    );
  };

  const clearConcept = () => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            rule: { ...node.rule, concept: null },
          };
        }
        return node;
      })
    );
  };

  const [showChildren, setShowChildren] = useState<boolean>(false);
  const onClick = (c: Concept) => {
    setConcept(c);
  };

  const removeChild = (parent: Concept, child: Concept) => {
    const children = parent.children?.filter(
      (c) => c.concept_id !== child.concept_id
    );
    const newConcept = {
      ...parent,
      children,
    };
    return newConcept;
  };

  const handleDeleteRule = () => {
    const newQuery = removeById(queryBuilderJson, id);
    setQueryBuilderJson(newQuery);
    handleClose();
  };

  const handleConvertToGroup = () => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (!isRuleLeaf(node)) return node;
        const newGroup = ruleToGroup(node);
        return newGroup;
      })
    );
    handleClose();
  };

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

  const handleClose = () => {
    setMenuPos(null);
  };

  return (
    <RuleWrapper
      id={id}
      sortable={sortable}
      render={(ref) => (
        <Card
          key={id}
          ref={ref}
          sx={{
            p: 2,
            border: 1,
            borderColor: valid ? "black" : "warning.main",
            width: "100%",
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={handleContextMenu}
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
              <>
                <Chip
                  color={exclude ? "error" : "primary"}
                  sx={{
                    bgcolor: "white",
                  }}
                  variant="outlined"
                  label={exclude ? "Exclude" : "Include"}
                />
                {!valid && <WarningAmberIcon color="warning" />}
              </>
            }
            action={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h5">Rule</Typography>
                {!isEmptyRule(rule) && domain && (
                  <>
                    <Typography variant="h5">/</Typography>
                    <Chip
                      sx={{
                        bgcolor: "white",
                        borderColor: "white",
                      }}
                      variant="outlined"
                      label={domain}
                    />
                  </>
                )}
              </Box>
            }
          />
          <CardContent>
            {isEmptyRule(rule) ? (
              <SearchConcepts onClick={onClick} />
            ) : (
              <>
                {isSingleConcept(concept) && (
                  <>
                    <ConceptChip
                      indicateIfParent={showChildren}
                      concept={concept}
                      onDelete={() => clearConcept()}
                      onClick={
                        concept?.children && concept.children.length > 0
                          ? () => setShowChildren(!showChildren)
                          : undefined
                      }
                    />
                    {showChildren &&
                      concept?.children?.map((childConcept) => (
                        <ConceptChip
                          draggable={false}
                          key={childConcept.concept_id}
                          concept={childConcept}
                          onDelete={() => {
                            setConcept(removeChild(concept, childConcept));
                          }}
                        />
                      ))}
                  </>
                )}
                {isMultipleConcept(concept) && (
                  <Alert color="error"> Not yet implemented </Alert>
                )}
              </>
            )}
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
            <MenuItem onClick={handleConvertToGroup}>Convert to Group</MenuItem>
            <MenuItem onClick={handleClose}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteRule}>Delete</MenuItem>
          </Menu>
        </Card>
      )}
    />
  );
};

export default Rule;
