import React, { useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useStepSelector, apiSelector } from "../../redux/selectors";
import {
  useCreateReviewAction,
  useUpdateReviewAction,
} from "../../redux/actions";
import { useParams } from "react-router-dom";
import { FIELDS } from "../../config/form-types";
import { ProgressIndicator, Title, Button } from "../../components";
import { StepOne, StepTwo, StepThree, StepFour } from "../steps";
import { StepDataType } from "../../redux/reducers/step-reducer/step-reducer";
import { StepPropTypes } from "../../types/types";
import styles from "./step.module.css";

// Setup our route params type
export type StepRouteParamsType = {
  step: string | undefined;
  id?: string | undefined;
};

// Create a simple map to connect our step index to a component
const StepComponentMap: Readonly<Record<number, React.FC<StepPropTypes>>> = {
  [0]: StepOne,
  [1]: StepTwo,
  [2]: StepThree,
  [3]: StepFour,
};
const StepDescriptionMap: Readonly<Record<number, string>> = {
  [0]: "Title and rating",
  [1]: "Description",
  [2]: "Image and description",
  [3]: "See your review",
};
const numOfSteps = Object.keys(StepComponentMap).length;

export const getStepComponent = (index: number) =>
  StepComponentMap[index] || StepOne;

export const getStepIndex = (stepIndex: string | undefined) =>
  Math.max(0, (parseInt(stepIndex || "0") || 0) - 1);

const getField = (state: StepDataType, field: string) =>
  (state?.fields && state?.fields[field]) || "";

export const getNextPageNumber = (index: number) =>
  Math.min(numOfSteps, index + 1);
export const getPreviousPageNumber = (index: number) => Math.max(0, index - 1);

export const getFields = (fields: string[], stepState: StepDataType) => {
  const mappedFields = fields.map((key) => {
    return {
      key,
      value: (stepState?.fields && stepState?.fields[key]) || null,
    };
  });
  if (mappedFields.length) {
    console.log(mappedFields);
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

// Return the corresponding component for the current step.
export const StepPage: React.FC = () => {
  const history = useHistory();
  const params = useParams<StepRouteParamsType>();
  const updateReview = useUpdateReviewAction();
  const createReview = useCreateReviewAction();
  const api = useSelector(apiSelector);
  const stepState = useStepSelector(params?.id || "step-one");
  const index = getStepIndex(params?.step);
  const StepComponent = getStepComponent(index);
  const isButtonDisabled =
    api.isLoading ||
    (StepComponent == StepOne &&
      [FIELDS.TITLE, FIELDS.RATING].filter(
        (field) => !getField(stepState, field)
      ).length > 0);
  const isPreviousButtonVisible = index - 1 > -1;
  const isNextButtonVisible = index + 1 < numOfSteps;

  const navigateToPage = useCallback(
    async (index) => {
      const nextPageNumber = index + 1;
      try {
        if (StepComponent === StepOne) {
          const response = await createReview(
            getField(stepState, FIELDS.TITLE),
            getField(stepState, FIELDS.RATING)
          );
          if (!response || !response?.data?.id) {
            throw new Error("No ID was returned from the API");
          }
        } else {
          // Update a review and navigate
          const isSuccess = await updateReview(
            getFields(Object.values(FIELDS), stepState)
          );
          if (!isSuccess) {
            throw new Error("Could not update the review.");
          }
        }
        history.push(`/step/${nextPageNumber}/id/${params?.id}`);
      } catch (error) {
        console.log(error);
      }
    },
    [StepComponent, stepState]
  );

  const onPressNext = () =>
    getNextPageNumber(index) !== index &&
    navigateToPage(getNextPageNumber(index));

  const onPressPrevious = () =>
    getPreviousPageNumber(index) !== index &&
    navigateToPage(getPreviousPageNumber(index));

  return (
    <>
      <Title>Submit a review</Title>
      <ProgressIndicator
        numSteps={numOfSteps}
        currentStep={index + 1}
        stepDescriptions={StepDescriptionMap}
      />
      <section
        className={styles.wrapper}
        data-test-id={`step-component-${index}`}
      >
        <StepComponent
          errorMessage={api?.error?.message || ""}
          isError={!!api?.error}
          id={params?.id || "step-one"}
        />
      </section>
      <nav className={styles.navigation}>
        <Button
          isDisabled={isButtonDisabled || !isPreviousButtonVisible}
          onClick={onPressPrevious}
        >
          Previous
        </Button>
        <Button
          isDisabled={isButtonDisabled || !isNextButtonVisible}
          onClick={onPressNext}
        >
          Next
        </Button>
      </nav>
    </>
  );
};
