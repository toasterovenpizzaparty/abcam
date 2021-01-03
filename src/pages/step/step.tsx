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
import {
  getStepIndex,
  getStepComponent,
  getButtonDisabled,
  numOfSteps,
  getFields,
  getField,
  getNextPageIndex,
  getPreviousPageIndex,
  StepDescriptionMap,
} from "../../config/steps";
import styles from "./step.module.css";

const ErrorMessage = React.lazy(() => import("../../components/ErrorMessage"));

// Setup our route params type
export type StepRouteParamsType = {
  step: string | undefined;
  id?: string | undefined;
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
        <Suspense fallback={<></>}>
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
