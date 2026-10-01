import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { CloseGuardProvider } from "@/providers/CloseGuardProvider";
import ConfirmProvider from "@/components/ConfirmProvider";
import { Concept } from "@/types/api";
import useRuleConceptSelection from "./useRuleConceptSelection";

const wrapper = ({ children }: PropsWithChildren) => (
  <CloseGuardProvider>
    <ConfirmProvider>{children}</ConfirmProvider>
  </CloseGuardProvider>
);

const makeConcept = (concept_id: number, name: string): Concept =>
  ({ concept_id, name }) as Concept;

const diabetes = makeConcept(1, "Diabetes");
const hypertension = makeConcept(2, "Hypertension");

describe("useRuleConceptSelection", () => {
  it("adds a toggled concept to the selection", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useRuleConceptSelection(onConfirm), {
      wrapper,
    });

    act(() => result.current.handleOnToggle(diabetes, true));

    expect(result.current.selectedConcepts).toEqual([diabetes]);
  });

  it("removes a concept when toggled off", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useRuleConceptSelection(onConfirm), {
      wrapper,
    });

    act(() => result.current.handleOnToggle(diabetes, true));
    act(() => result.current.handleOnToggle(diabetes, false));

    expect(result.current.selectedConcepts).toEqual([]);
  });

  it("confirms a single selection without the alternatives field", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useRuleConceptSelection(onConfirm), {
      wrapper,
    });

    act(() =>
      result.current.handleOnToggle(
        { ...diabetes, alternatives: [hypertension] } as Concept,
        true,
      ),
    );
    act(() => result.current.handleConfirm());

    expect(onConfirm).toHaveBeenCalledWith(diabetes);
  });

  it("confirms multiple selections as an array", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useRuleConceptSelection(onConfirm), {
      wrapper,
    });

    act(() => result.current.handleOnToggle(diabetes, true));
    act(() => result.current.handleOnToggle(hypertension, true));
    act(() => result.current.handleConfirm());

    expect(onConfirm).toHaveBeenCalledWith([diabetes, hypertension]);
  });

  it("does not confirm when nothing is selected", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useRuleConceptSelection(onConfirm), {
      wrapper,
    });

    act(() => result.current.handleConfirm());

    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("clears the selection and selected ids", () => {
    const onConfirm = jest.fn();
    const { result } = renderHook(() => useRuleConceptSelection(onConfirm), {
      wrapper,
    });

    act(() => result.current.setSelectedIds({ 1: true }));
    act(() => result.current.handleOnToggle(diabetes, true));
    act(() => result.current.clearAll());

    expect(result.current.selectedConcepts).toEqual([]);
    expect(result.current.selectedIds).toEqual({});
  });

  it("keeps a pending selection across re-renders (no implicit reset)", () => {
    const onConfirm = jest.fn();
    const { result, rerender } = renderHook(
      () => useRuleConceptSelection(onConfirm),
      { wrapper },
    );

    act(() => result.current.handleOnToggle(diabetes, true));
    rerender();

    expect(result.current.selectedConcepts).toEqual([diabetes]);
  });
});
