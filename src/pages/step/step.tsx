import React, { useCallback, Suspense } from "react";
import { useHistory } from "react-router-dom";
import { useSharedState } from "../../providers/shared-state";
import { useStepSelector } from "../../redux/selectors/step";
import {
  useCreateReviewAction,
  useUpdateReviewAction,
} from "../../redux/actions";
import { useParams } from "react-router-dom";
import { FIELDS } from "../../config/form-types";
import ProgressIndicator from "../../components/ProgressIndicator";
import Title from "../../components/Title";
import Button from "../../components/Button";
import { StepDataType } from "../../redux/reducers/step-reducer/step-reducer";
import { StepPropTypes } from "../../types/types";
import styles from "./step.module.css";

const ErrorMessage = React.lazy(() => import("../../components/ErrorMessage"));
const StepOne = React.lazy(() => import("../steps/step-one/step-one"));
const StepTwo = React.lazy(() => import("../steps/step-two/step-two"));
const StepThree = React.lazy(() => import("../steps/step-three/step-three"));
const StepFour = React.lazy(() => import("../steps/step-four/step-four"));

// Setup our route params type
export type StepRouteParamsType = {
  step: string | undefined;
  id?: string | undefined;
};

// Create a simple map to connect our step index to a component
export const StepComponentMap: Readonly<
  Record<number, () => React.FC<StepPropTypes>>
> = {
  0: () => StepOne,
  1: () => StepTwo,
  2: () => StepThree,
  3: () => StepFour,
};
const StepDescriptionMap: Readonly<Record<number, string>> = {
  0: "Title and rating",
  1: "Description",
  2: "Image and description",
  3: "See your review",
};
const numOfSteps = Object.keys(StepComponentMap).length;

export const getStepComponent = (index: number) =>
  StepComponentMap[index] || StepOne;

export const getStepIndex = (stepIndex: string | undefined) =>
  Math.max(0, (parseInt(stepIndex || "0") || 0) - 1);

const getField = (state: StepDataType, field: string) =>
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

const getButtonDisabled = (stepState: StepDataType, componentIndex: number) => {
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

// Return the corresponding component for the current step.
export const StepPage: React.FC = () => {
  const history = useHistory();
  const params = useParams<StepRouteParamsType>();
  const updateReview = useUpdateReviewAction();
  const createReview = useCreateReviewAction();
  const api = useSharedState().api;
  const stepState = useStepSelector(params?.id || "step-one");
  const index = getStepIndex(params?.step);
  const StepComponent = getStepComponent(index)();

  const isButtonDisabled = api.isLoading || getButtonDisabled(stepState, index);
  const isPreviousButtonVisible = index - 1 > -1;
  const isNextButtonVisible = index + 1 < numOfSteps;

  const navigateToPage = useCallback(
    async (nextPageIndex) => {
      try {
        let id = params?.id;
        if (!index) {
          const response = await createReview(
            getField(stepState, FIELDS.TITLE),
            getField(stepState, FIELDS.RATING)
          );
          if (!response || !response?.data?.id) {
            throw new Error("No ID was returned from the API");
          }
          id = response?.data.id;
        } else {
          // Update a review and navigate
          const isSuccess = await updateReview(
            getFields(Object.values(FIELDS), stepState)
          );
          if (!isSuccess) {
            throw new Error("Could not update the review.");
          }
        }
        history.push(`/step/${nextPageIndex + 1}/id/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    [stepState, createReview, history, params?.id, updateReview, index]
  );

  const onPressNext = () =>
    getNextPageIndex(index) !== index &&
    navigateToPage(getNextPageIndex(index));

  const onPressPrevious = () =>
    getPreviousPageIndex(index) !== index &&
    navigateToPage(getPreviousPageIndex(index));

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
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorMessage
            data-test-id='step-error-message'
            isVisible={!!api?.error}
            messages={[
              "Something went wrong while trying to save your review.",
            ]}
          />
          <StepComponent
            errorMessage={""}
            isError={false}
            id={params?.id || "step-one"}
          />
        </Suspense>
      </section>
      <nav className={styles.navigation}>
        <Button
          data-test-id='previous-button'
          isDisabled={isButtonDisabled || !isPreviousButtonVisible}
          onClick={onPressPrevious}
        >
          Previous
        </Button>
        <Button
          data-test-id='next-button'
          isDisabled={isButtonDisabled || !isNextButtonVisible}
          onClick={onPressNext}
        >
          Next
        </Button>
      </nav>
    </>
  );
};
export default StepPage;
