import React from "react";
import { FIELDS } from "../../../config/form-types";
import { createUseFieldState } from "../../../redux/selectors";
import TextArea from "../../../components/Form/TextArea";
import { StepPropTypes } from "../../../types/types";

export const StepTwo: React.FC<StepPropTypes> = ({
  id = "step-one",
  isError = false,
  errorMessage = "Oh no an error has occured trying to submit your review.",
}) => {
  const useFieldState = createUseFieldState(id);
  const [description, setDescription] = useFieldState({
    fieldKey: FIELDS.DESCRIPTION,
  });
  return (
    <aside>
      <TextArea
        label='Please provide a description (optional)'
        onTextChange={setDescription}
        value={description}
      />
    </aside>
  );
};
export default StepTwo;
