import { useCallback } from "react";
import { ActionTypes } from "../reducers/step-reducer/step-reducer";
import { useDispatch } from "react-redux";

/*
 * Returns a function to save a field value in the redux store.
 */
export const useSaveFieldAction = (id: string, fieldKey: string) => {
  const dispatch = useDispatch();
  return useCallback(
    (fieldValue: string) => {
      console.log(createSaveFieldActionPayload(id, fieldKey, fieldValue));
      dispatch(createSaveFieldActionPayload(id, fieldKey, fieldValue));
    },
    [id, fieldKey]
  );
};

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
