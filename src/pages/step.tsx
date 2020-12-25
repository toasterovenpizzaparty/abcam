import React from "react";
import { useParams } from "react-router-dom";
import { StepOne } from "./steps";

// Setup our route params type
type StepRouteParamsType = {
  step: string | undefined;
};

// Create a simple map to connect our step index to a component
const StepComponentMap: Readonly<Record<number, React.FC>> = {
  [0]: StepOne,
};

// Return the corresponding component for the current step.
export const StepPage: React.FC = () => {
  const params = useParams<StepRouteParamsType>();
  const index = Math.max(0, parseInt(params?.step || "0") - 1);
  const StepComponent = StepComponentMap[index] || StepOne;
  return <StepComponent />;
};
