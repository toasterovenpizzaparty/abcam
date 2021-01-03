import React from "react";
import { StepDataType } from "../redux/reducers/step-reducer/step-reducer";
import { StepPropTypes } from "../types/types";
import { FIELDS } from "./form-types";

const StepOne = React.lazy(() => import("../pages/steps/step-one/step-one"));
const StepTwo = React.lazy(() => import("../pages/steps/step-two/step-two"));
const StepThree = React.lazy(
  () => import("../pages/steps/step-three/step-three")
);
const StepFour = React.lazy(() => import("../pages/steps/step-four/step-four"));

// Create a simple map to connect our step index to a component
export const StepComponentMap: Readonly<
  Record<number, () => React.FC<StepPropTypes>>
> = {
  0: () => StepOne,
  1: () => StepTwo,
  2: () => StepThree,
  3: () => StepFour,
};

export const StepDescriptionMap: Readonly<Record<number, string>> = {
  0: "Title and rating",
  1: "Description",
  2: "Image and description",
  3: "See your review",
};
export const numOfSteps = Object.keys(StepComponentMap).length;

export const getStepComponent = (index: number) =>
  StepComponentMap[index] || StepOne;

export const getStepIndex = (stepIndex: string | undefined) =>
  Math.max(0, (parseInt(stepIndex || "0") || 0) - 1);

export const getField = (state: StepDataType, field: string) =>
  (state?.fields && state?.fields[field]) || "";

export const getNextPageIndex = (index: number) =>
  Math.min(numOfSteps, index + 1);

export const getPreviousPageIndex = (index: number) => Math.max(0, index - 1);

export const getFields = (fields: string[], stepState: StepDataType) => {
  const mappedFields = fields.map((key) => {
    return {
      key,
      value: (stepState?.fields && stepState?.fields[key]) || null,
    };
  });
  if (mappedFields.length) {
    return mappedFields.reduce(
      (acc, field) => ({
        ...acc,
        ...(field.value !== null ? { [field.key]: field.value } : {}),
      }),
      {}
    );
  } else {
    return {};
  }
};

export const getButtonDisabled = (
  stepState: StepDataType,
  componentIndex: number
) => {
  switch (componentIndex) {
    case 0:
      return (
        [FIELDS.TITLE, FIELDS.RATING].filter(
          (field) => !getField(stepState, field)
        ).length > 0
      );
    case 2:
      return (
        [FIELDS.IMAGE].filter((field) => !getField(stepState, field)).length > 0
      );
    default:
      return false;
  }
};
