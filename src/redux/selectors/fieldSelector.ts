import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { StepDataType } from "../../redux/reducers/step-reducer";
export const fieldSelector = (
  step: string,
  field: string,
  defaultValue = ""
) => (state: RootState) =>
  (state?.steps?.[step] && state?.steps?.[step].fields?.[field]) ||
  defaultValue;

export const getFieldSelector = (step: string) => (
  field: string,
  defaultValue: string
) => {
  return useSelector<RootState, string>(
    fieldSelector(step, field, defaultValue)
  );
};

export const useStepSelector = (step: string) =>
  useSelector<RootState, StepDataType>((state) => state?.steps?.[step]);
