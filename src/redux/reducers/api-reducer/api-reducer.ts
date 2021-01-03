import { AxiosError, AxiosResponse } from "axios";

/*
    A simple state that is flexible enough to have various different steps
    Each step has a set of fields and possibly information regarding API Requests.
  */
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

/* 
    When working with input we use fields to store any values
    When working with server responses we use the serverResponse.
    Any Action should have a stepkey as data is tied to the current step.
  */
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
