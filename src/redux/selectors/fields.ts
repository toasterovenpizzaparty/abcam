import { useSharedState } from "../../hooks/shared-state";
import { RootState } from "../../providers/shared-state";
import { useSaveFieldAction } from "../actions/fields";

/**
 *
 * @description Retrieve a field value by field key and id
 */
const getField = (
  state: RootState,
  id: string,
  fieldKey: string,
  defaultValue = ""
) =>
  (state?.steps?.[id] && state?.steps?.[id].fields?.[fieldKey]) || defaultValue;

/**
 *
 * @description Shorthand to select a field value by field key and id
 */
export const fieldSelector = (
  id: string,
  fieldKey: string,
  defaultValue = ""
) => (state: RootState) => getField(state, id, fieldKey, defaultValue);

/**
 *
 * @description Creates a hook to retrieve a field value by field key and id
 */
const useFieldSelector = (
  id: string,
  fieldKey: string,
  defaultValue: string = ""
) => {
  const state = useSharedState();
  return fieldSelector(id, fieldKey, defaultValue)(state);
};

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

/**
 *
 * @description Create a hook that provides a common interface to read/write field values. E.g. [state, setState] = useFieldState({id,fieldKey})
 */
export const useFieldState = ({
  id,
  fieldKey,
  defaultValue = "",
}: FieldStatePropTypes): [string, (value: string) => void] => {
  const fieldValue = useFieldSelector(id, fieldKey, defaultValue);
  const setFormField = useSaveFieldAction(id, fieldKey);
  return [fieldValue, setFormField];
};

/**
 *
 * @description Provides a H.O.C. to useFieldState without having to resupply id.
 */
export const createUseFieldState = (id: string) => {
  return (props: CreateFieldStatePropTypes) => useFieldState({ ...props, id });
};
