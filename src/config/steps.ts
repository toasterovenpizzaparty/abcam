import React from "react";
import { StepDataType } from "../redux/reducers/step-reducer/step-reducer";
import { StepPropTypes } from "../types/types";
import { FIELDS } from "./form-types";

/**
 *
 * @description Lazy load our steps to ensure speedy views.
 */
const StepOne = React.lazy(() => import("../pages/steps/step-one/step-one"));
const StepTwo = React.lazy(() => import("../pages/steps/step-two/step-two"));
const StepThree = React.lazy(
  () => import("../pages/steps/step-three/step-three")
);
const StepFour = React.lazy(() => import("../pages/steps/step-four/step-four"));

/**
 *
 * @description Provide a map of the steps and their number, this is used to configure which component is displayed on which step.
 */
export const StepComponentMap: Readonly<
  Record<number, () => React.FC<StepPropTypes>>
> = {
  0: () => StepOne,
  1: () => StepTwo,
  2: () => StepThree,
  3: () => StepFour,
};

/**
 *
 * @description Provide a map of descriptions for our progress indicator
 */
export const StepDescriptionMap: Readonly<Record<number, string>> = {
  0: "Title and rating",
  1: "Description",
  2: "Image and description",
  3: "See your review",
};

/**
 *
 * @description Keep track of the number of steps we have
 */
export const numOfSteps = Object.keys(StepComponentMap).length;

/**
 *
 * @description Returns the current StepComponent
 */
export const getStepComponent = (index: number) =>
  StepComponentMap[index] || StepOne;

/**
 *
 * @description Returns the current index for our step
 */
export const getStepIndex = (stepIndex: string | undefined) =>
  Math.max(0, (parseInt(stepIndex || "0") || 0) - 1);

/**
 *
 * @description Get a field from within a step
 */
export const getField = (state: StepDataType, field: string) =>
  (state?.fields && state?.fields[field]) || "";

/**
 *
 * @description Get the next index number for our step components
 */
export const getNextPageIndex = (index: number) =>
  Math.min(numOfSteps, index + 1);
/**
 *
 * @description Get the previous index number for our step components
 */
export const getPreviousPageIndex = (index: number) => Math.max(0, index - 1);

/**
 *
 * @description Map all our fields as key: value object
 */
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

/**
 *
 * @description Specifies if our button is disabled
 */
export const getButtonDisabled = (
  stepState: StepDataType,
  componentIndex: number
) => {
  switch (componentIndex) {
    case 0: // On the first step title and rating are required
      return (
        [FIELDS.TITLE, FIELDS.RATING].filter(
          (field) => !getField(stepState, field)
        ).length > 0
      );
    case 2: // On the third step the image is required
      return (
        [FIELDS.IMAGE].filter((field) => !getField(stepState, field)).length > 0
      );
    default:
      return false;
  }
};
