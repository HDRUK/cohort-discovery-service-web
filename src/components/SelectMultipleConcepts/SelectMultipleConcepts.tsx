import { Concept } from "@/types/api";

export const SelectMultipleConcepts = ({ concept }: { concept: Concept }) => {
  return (
    <>
      <ConceptChip
        indicateIfParent={showDescendants}
        concept={concept}
        onDelete={() => {
          clearConcept();
        }}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setConcept({ ...concept, alternatives: [] });
          setSelected(id, true, true);
        }}
      />
      {concept?.alternatives &&
        concept?.alternatives?.map((childConcept) => (
          <ConceptChip
            chipSx={{
              borderColor: "error.main",
            }}
            draggable={false}
            key={childConcept.concept_id}
            concept={childConcept}
            onClick={() => setConcept(childConcept)}
            onDelete={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setConcept(removeAlternative(concept, childConcept));
              setSelected(id, true, true);
            }}
          />
        ))}
    </>
  );
};
