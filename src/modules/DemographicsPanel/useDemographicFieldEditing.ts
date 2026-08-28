import { useState } from "react";
import { useForm } from "react-hook-form";
import { EMPTY_DEMOGRAPHICS } from "@/store/queryBuilderStore";
import { Demographics } from "@/types/rules";
import { DemographicRowActionProps } from "./DemographicRow";

type DemographicField = keyof Demographics;

const isDemographicsEmpty = (d?: Demographics) =>
  !d ||
  (d.age === null &&
    d.sex.length === 0 &&
    d.race.length === 0 &&
    d.location === null &&
    d.death === null);

const useDemographicFieldEditing = (
  demographics: Demographics | undefined,
  setDemographics: (demographics: Demographics) => void,
) => {
  const form = useForm<Demographics>({
    defaultValues: demographics ?? EMPTY_DEMOGRAPHICS,
  });

  const [activeField, setActiveField] = useState<DemographicField | null>(null);
  const [allOpen, setAllOpen] = useState(() =>
    isDemographicsEmpty(demographics),
  );

  const save = form.handleSubmit((values) => {
    setDemographics(values);
    setActiveField(null);
    setAllOpen(false);
  });

  const propsFor = (field: DemographicField): DemographicRowActionProps => ({
    editing: allOpen || activeField === field,
    disabled: !allOpen && activeField !== null && activeField !== field,
    hideActions: allOpen,
    onEditStart: () => {
      const current = demographics ?? EMPTY_DEMOGRAPHICS;
      form.resetField(field, { defaultValue: current[field] });
      setActiveField(field);
    },
    onSave: allOpen
      ? save
      : () => {
          const current = demographics ?? EMPTY_DEMOGRAPHICS;
          setDemographics({ ...current, [field]: form.getValues(field) });
          setActiveField(null);
        },
    onReset: () => {
      const current = demographics ?? EMPTY_DEMOGRAPHICS;
      form.resetField(field, { defaultValue: current[field] });
      setActiveField(null);
    },
    onClear: () => {
      const current = demographics ?? EMPTY_DEMOGRAPHICS;
      setDemographics({ ...current, [field]: EMPTY_DEMOGRAPHICS[field] });
    },
  });

  return { form, allOpen, save, propsFor };
};

export default useDemographicFieldEditing;
