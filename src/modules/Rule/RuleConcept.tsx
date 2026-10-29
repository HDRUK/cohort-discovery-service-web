import ConceptChip from "@/components/ConceptChip";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { Concept } from "@/types/api";
import { RuleLeafType } from "@/types/rules";
import { isSingleConcept } from "@/utils/rules";

interface RuleConceptProps {
  rule: RuleLeafType;
  onChange: (concept: Concept) => void;
  onClear: () => void;
}

const RuleConcept = ({ rule, onChange, onClear }: RuleConceptProps) => {
  const { showDescendants, setShowDescendants } = useQueryBuilder((qb) => ({
    showDescendants: qb.showDescendants[rule.id],
    setShowDescendants: qb.setShowDescendants,
  }));

  const concept = rule.rule.concept;

  if (!isSingleConcept(concept)) {
    return null;
  }

  const hasChildren = (concept.children?.length ?? 0) > 0;

  return (
    <>
      <ConceptChip
        indicateIfParent={showDescendants}
        concept={concept}
        onDelete={(e: React.MouseEvent) => {
          e.stopPropagation();
          onClear();
        }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (hasChildren) {
            setShowDescendants(rule.id, !showDescendants);
          }
        }}
      />
      {showDescendants &&
        concept.children?.map((childConcept) => (
          <ConceptChip
            key={childConcept.concept_id}
            concept={childConcept}
            onDelete={() =>
              onChange({
                ...concept,
                children: concept.children?.filter(
                  (c) => c.concept_id !== childConcept.concept_id,
                ),
              })
            }
          />
        ))}
    </>
  );
};

export default RuleConcept;
