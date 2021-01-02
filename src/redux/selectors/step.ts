import { useSelector } from "react-redux";
import { RootState } from "../store";
import { StepDataType } from "../reducers/step-reducer/step-reducer";

export const useStepSelector = (step: string) =>
  useSelector<RootState, StepDataType>((state) => state?.steps?.[step]);
