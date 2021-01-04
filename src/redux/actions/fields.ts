import { useCallback } from "react";
import { ActionTypes } from "../reducers/step-reducer/step-reducer";
import { useDispatch } from "../../hooks/shared-state";

/**
 *
 * @description Provides a hook to save a field within our reducer
 */
export const useSaveFieldAction = (id: string, fieldKey: string) => {
  const dispatch = useDispatch();
  return useCallback(
    (fieldValue: string) => {
      dispatch(createSaveFieldActionPayload(id, fieldKey, fieldValue));
    },
    [id, fieldKey, dispatch]
  );
};

/**
 *
 * @description Create a payload to save a field within a step
 */
export const createSaveFieldActionPayload = (
  id: string,
  fieldKey: string,
  fieldValue: string
) => ({
  type: ActionTypes.SAVE_FORM_FIELD,
  id,
  fields: {
    value: fieldValue,
    key: fieldKey,
  },
});
