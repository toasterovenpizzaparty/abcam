import React from "react";
import { useParams } from "react-router-dom";
import { StepOne, StepTwo } from "./steps";

// Setup our route params type
export type StepRouteParamsType = {
  step: string | undefined;
};

// Create a simple map to connect our step index to a component
const StepComponentMap: Readonly<Record<number, React.FC>> = {
  [0]: StepOne,
  [1]: StepTwo,
};

export const getStepComponent = (index: number) =>
  StepComponentMap[index] || StepOne;

export const getStepIndex = (stepIndex: string | undefined) =>
  Math.max(0, (parseInt(stepIndex || "0") || 0) - 1);

// Return the corresponding component for the current step.
export const StepPage: React.FC = () => {
  const params = useParams<StepRouteParamsType>();
  const index = getStepIndex(params?.step);
  const StepComponent = getStepComponent(index);
  return (
    <section data-test-id={`step-component-${index}`}>
      <StepComponent />
    </section>
  );
};
