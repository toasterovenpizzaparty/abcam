import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Title, Rating, TextField } from "../../components";
import { STEPS, FIELDS } from "../../config/form-types";

import {
  getFieldSelector,
  useStepSelector,
} from "../../redux/selectors/fieldSelector";
import {
  useSaveFormField,
  useCreateReview,
} from "../../redux/actions/fieldActions";

const useFieldSelector = getFieldSelector(STEPS.STEP_ONE);

export const StepOne: React.FC = () => {
  const step = useStepSelector(STEPS.STEP_ONE);
  const title = useFieldSelector(FIELDS.TITLE, "");
  const rating = useFieldSelector(FIELDS.RATING, "-1");
  const saveFormField = useSaveFormField(STEPS.STEP_ONE);
  const createReview = useCreateReview();
  const history = useHistory();

  const saveRating = (rating: string) => saveFormField(rating, FIELDS.RATING);
  const saveTitle = (title: string) => saveFormField(title, FIELDS.TITLE);

  const onPressSubmit = useCallback(async () => {
    const result = await createReview(title, rating, STEPS.STEP_ONE);
    if (result) {
      history.push(`/step/2/id/${result?.data?.id}`);
    }
  }, [rating, title]);
  return (
    <section data-test-id='step-one'>
      <Title>Submit a review</Title>
      {step?.error && (
        <span data-test-id='error-message'>
          Oh no an error has occured trying to submit your review.
        </span>
      )}
      <TextField
        value={title}
        onTextChange={(title) => saveTitle(title)}
        data-test-id='title'
      />
      <Rating
        data-test-id='rating'
        selectedRating={rating}
        onRatingChange={(rating) => saveRating(rating)}
      />
      <button
        data-test-id='submit-button'
        disabled={rating === "-1" || !!step?.isLoading}
        onClick={onPressSubmit}
      >
        submit
      </button>
    </section>
  );
};
