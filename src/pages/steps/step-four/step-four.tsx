import React from "react";
import { FIELDS } from "../../../config/form-types";
import { useSharedState } from "../../../providers/shared-state";
import { Card, Title } from "../../../components";
import { StepPropTypes } from "../../../types/types";
import { getFields } from "../../../config/steps";

export const StepFour: React.FC<StepPropTypes> = ({
  id = "step-four",
  isError = false,
  errorMessage = "Oh no an error has occured trying to submit your review.",
}) => {
  const state = useSharedState();
  const fields = state.steps[id] || {};
  return (
    <aside>
      <Title>Your review has been saved.</Title>
      <Card {...getFields(Object.values(FIELDS), fields)} />
    </aside>
  );
};

export default StepFour;
