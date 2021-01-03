import { useSharedState } from "../../providers/shared-state";
import { RootState } from "../../providers/shared-state";
import { useSaveFieldAction } from "../actions/fields";

/*
* Retrieve a field value from a step
* {
  [step]: {
    fields: {
      [key]: value;
    }
  }
}
*/
const getField = (
  state: RootState,
  id: string,
  fieldKey: string,
  defaultValue = ""
) =>
  (state?.steps?.[id] && state?.steps?.[id].fields?.[fieldKey]) || defaultValue;

export const fieldSelector = (
  id: string,
  fieldKey: string,
  defaultValue = ""
) => (state: RootState) => getField(state, id, fieldKey, defaultValue);

/*
 * Creates a selector to retrieve a field value from within a step
 * If no value was found, return the defaultValue
 */
const useFieldSelector = (
  id: string,
  fieldKey: string,
  defaultValue: string = ""
) => {
  const state = useSharedState();
  return fieldSelector(id, fieldKey, defaultValue)(state);
};

/*
 * Provides a common interface to work with updating field values in the redux store.
 * Returns a function that can be utilized like setState.
 * E.g. const useFieldState = getFieldState("step-one", "3");
 * The useFieldState provides the value and a setter to update the field.
 * E.g. const [title, setTitle] = useFieldState("title", "");
 */
type FieldStatePropTypes = {
  fieldKey: string;
  id: string;
  defaultValue?: string;
};

type CreateFieldStatePropTypes = {
  fieldKey: string;
  id?: string;
  defaultValue?: string;
};

export const useFieldState = ({
  id,
  fieldKey,
  defaultValue = "",
}: FieldStatePropTypes): [string, (value: string) => void] => {
  const fieldValue = useFieldSelector(id, fieldKey, defaultValue);
  const setFormField = useSaveFieldAction(id, fieldKey);
  return [fieldValue, setFormField];
};

export const createUseFieldState = (id: string) => {
  return (props: CreateFieldStatePropTypes) => useFieldState({ ...props, id });
};
