import React from "react";
import Rating from "../../../components/Form/Rating";
import TextField from "../../../components/Form/TextField";
import { FIELDS } from "../../../config/form-types";
import { createUseFieldState } from "../../../redux/selectors";
import { StepPropTypes } from "../../../types/types";

export const StepOne: React.FC<StepPropTypes> = ({
  id = "step-one",
  isError = false,
  errorMessage = "Oh no an error has occured trying to submit your review.",
}) => {
  const useFieldState = createUseFieldState(id);
  const [title, setTitle] = useFieldState({
    fieldKey: FIELDS.TITLE,
  });
  const [rating, setRating] = useFieldState({
    fieldKey: FIELDS.RATING,
    defaultValue: "-1",
  });
  return (
    <aside data-test-id='step-one'>
      {isError && <span data-test-id='error-message'>{errorMessage}</span>}
      <Rating
        label='Rating'
        data-test-id='rating'
        selectedRating={rating}
        onRatingChange={setRating}
      />
      <TextField
        label='Title'
        placeholder='a great titel e.g. a once in a lifetime product'
        value={title}
        onTextChange={setTitle}
        data-test-id='title'
      />
    </aside>
  );
};

export default StepOne;
