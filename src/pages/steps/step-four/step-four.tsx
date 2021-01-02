import React from "react";
import { FIELDS } from "../../../config/form-types";
import { StepDataType } from "../../../redux/reducers/step-reducer/step-reducer";
import { useStepSelector } from "../../../redux/selectors";
import { Card } from "../../../components";
import { StepPropTypes } from "../../../types/types";
import { getFields } from "../../step/step";
import styles from "./step-four.module.css";

export const StepFour: React.FC<StepPropTypes> = ({
  id = "step-four",
  isError = false,
  errorMessage = "Oh no an error has occured trying to submit your review.",
}) => {
  const state = useStepSelector(id);
  return (
    <aside data-test-id='step-four'>
      <Card {...getFields(Object.values(FIELDS), state)} />
    </aside>
  );
};
