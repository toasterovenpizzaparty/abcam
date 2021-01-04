import { AxiosError, AxiosResponse } from "axios";

export type State = {
  isLoading: boolean;
  data: AxiosResponse | null;
  error: AxiosError | null;
};

export enum ActionTypes {
  START_REQUEST = "api-start-request",
  FINISH_REQUEST = "api-request",
  CLEAR = "api-clear",
}

export type Action = {
  type: string;
  data?: AxiosResponse | null;
  error?: AxiosError | null;
};

const initialState: State = {
  isLoading: false,
  data: null,
  error: null,
};

/**
 *
 * @description A reducer to handle API Request, holds data and error messages as well as proving a simple loading flag.
 */
export const APIReducer = (state = initialState, action: Action) => {
  let nextState = state;
  switch (action.type) {
    // Clear any old request data and set isLoading to true to signal the API is working
    case ActionTypes.START_REQUEST:
      nextState = {
        isLoading: true,
        data: null,
        error: null,
      };
      break;

    // Clear our isLoading flag show any data/errors from the API
    case ActionTypes.FINISH_REQUEST:
      nextState = {
        isLoading: false,
        data: action?.data || null,
        error: action?.error || null,
      };
      break;

    // Clear our isLoading flag show any data/errors from the API
    case ActionTypes.CLEAR:
      nextState = {
        isLoading: false,
        data: null,
        error: null,
      };
  }
  return nextState;
};
