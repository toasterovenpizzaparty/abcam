import { useCallback } from "react";
import { ActionTypes, Action } from "../../redux/reducers/step-reducer";
import { AxiosResponse, AxiosError } from "axios";
import { client } from "../../providers/axios";
import { useDispatch } from "react-redux";

// Payload: Start Request, signifies the start of an API request.
const createStartRequestPayload = (stepKey: string): Action => ({
  type: ActionTypes.START_REQUEST,
  stepKey,
});

// Payload: Finish request, signifies that our API request has finished.
const createFinishRequestPayload = (
  stepKey: string,
  data: AxiosResponse | null,
  error: AxiosError | null
): Action => ({
  type: ActionTypes.FINISH_REQUEST,
  stepKey,
  serverResponse: {
    data,
    error,
  },
});

// Shorthand; creates a dispatch to save a field within a step.
export const useSaveFormField = (stepKey: string) => {
  const dispatch = useDispatch();
  return useCallback(
    (value: string, formFieldKey: string) =>
      dispatch({
        type: ActionTypes.SAVE_FORM_FIELD,
        stepKey,
        fields: {
          value,
          formFieldKey,
        },
      }),
    []
  );
};

// Shorthand; dispatches to the state an API request has started.
// Creates a new review with the given title and rating.
// Dispatches to the state the API request has finished.
export const useCreateReview = () => {
  const dispatch = useDispatch();
  return useCallback(async (title: string, rating: string, stepKey: string) => {
    dispatch(createStartRequestPayload(stepKey));
    try {
      const response = await client().request({
        url: "/reviews",
        method: "POST",
        data: {
          title,
          rating,
        },
      });
      dispatch(createFinishRequestPayload(stepKey, response.data, null));
      return response;
    } catch (error) {
      dispatch(createFinishRequestPayload(stepKey, null, error));
      return null;
    }
  }, []);
};
