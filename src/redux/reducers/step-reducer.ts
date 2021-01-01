export type StepDataType = {
  fields?: Record<string, string>;
} & Partial<ServerResponse>;

/*
  A simple state that is flexible enough to have various different steps
  Each step has a set of fields and possibly information regarding API Requests.
*/
export type State = Record<string, StepDataType>;

export type FormFieldPayload = {
  value: string;
  formFieldKey: string;
};

export enum ActionTypes {
  HYDRATE,
  SAVE_FORM_FIELD,
  START_REQUEST,
  FINISH_REQUEST,
}

export type ServerResponse<T = any> = {
  isLoading?: boolean;
  data?: T;
  error?: T;
};

/* 
  When working with input we use fields to store any values
  When working with server responses we use the serverResponse.
  Any Action should have a stepkey as data is tied to the current step.
*/
export type Action = {
  type: ActionTypes;
  stepKey?: string;
  fields?: FormFieldPayload;
  serverResponse?: ServerResponse;
};

const initialState: State = {};

/*
 * Any step can be accessed at ANY TIME to retrieve data stored before.
 * We are using the localStorage system to hydrate and store our state.
 */
// Defines the Storage key we are using within the localstorage system to store our data.
const storageKey = "STEP_REDUCER_STORE";

// Our state can be quite chunky, lets make sure we only store data that is usefull.
// E.g. our fields data that the user has filled in.
const sanitiseState = (state: State) => {
  let sanitisedState: State = {};
  for (let key in state) {
    sanitisedState[key] = {
      fields: state[key].fields,
    };
  }
  return sanitisedState;
};

// Store our state within localStorage.
export const saveState = (state: State) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(sanitiseState(state)));
  } catch (error) {
    // IO Error
  }
};

// Hydrate our state from localStorage
const hydrateState = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "");
  } catch (error) {
    // IO Error
  }
  return null;
};

export const StepReducer = (state = initialState, action: Action) => {
  let nextState = state;
  switch (action.type) {
    // Retrieve a previous state from localStorage and use it as our next state.
    case ActionTypes.HYDRATE:
      const hydratedState = hydrateState();
      if (hydratedState) {
        nextState = hydratedState;
      }
      return nextState;

    // Clear any old request data and set isLoading to true to signal the API is working
    case ActionTypes.START_REQUEST:
      if (action.stepKey) {
        nextState = {
          ...state,
          [action.stepKey]: {
            ...state[action.stepKey],
            isLoading: true,
            data: null,
            error: null,
          },
        };
      }
      break;

    // Clear our isLoading flag show any data/errors from the API
    case ActionTypes.FINISH_REQUEST:
      if (action.stepKey) {
        nextState = {
          ...state,
          [action.stepKey]: {
            ...state[action.stepKey],
            isLoading: false,
            data: action.serverResponse?.data,
            error: action.serverResponse?.error,
          },
        };
      }
      break;

    // Save a field within a step.
    case ActionTypes.SAVE_FORM_FIELD:
      if (
        action.fields &&
        action.stepKey &&
        action.fields.formFieldKey &&
        action.fields.value
      ) {
        nextState = {
          ...state,
          [action.stepKey]: {
            ...state[action.stepKey],
            fields: {
              ...(state[action.stepKey]?.fields || {}),
              [action.fields.formFieldKey]: action.fields.value,
            },
          },
        };
        saveState(nextState);
      }
      break;
  }
  return nextState;
};
