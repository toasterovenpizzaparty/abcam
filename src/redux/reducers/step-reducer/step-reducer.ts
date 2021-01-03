export type StepDataType = {
  fields?: Record<string, string>;
};

/*
  A simple state that is flexible enough to have various different steps
  Each step has a set of fields and possibly information regarding API Requests.
*/
export type State = Record<string, StepDataType>;

export type FormFieldPayload = {
  value: string;
  key: string;
};

export enum ActionTypes {
  HYDRATE = "hydrate",
  SAVE_FORM_FIELD = "save-form-field",
}

export type ActionWithTypes = {
  type: ActionTypes;
};

/* export type ServerResponse<T = any> = {
  isLoading?: boolean;
  data?: T;
  error?: T;
}; */

/* 
  When working with input we use fields to store any values
  When working with server responses we use the serverResponse.
  Any Action should have a stepkey as data is tied to the current step.
*/
export type Action = {
  type: string;
  id?: string;
  fields?: FormFieldPayload;
  // serverResponse?: ServerResponse;
  // isDataComplete?: boolean;
};

const initialState: State = {};

/*
 * Any step can be accessed at ANY TIME to retrieve data stored before.
 * We are using the localStorage system to hydrate and store our state.
 */
// Defines the Storage key we are using within the localstorage system to store our data.
const storageKey = "STEP_REDUCER_STORE";

// Store our state within localStorage.
export const saveState = (state: State) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
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

    // Save a field within a step.
    case ActionTypes.SAVE_FORM_FIELD:
      if (action.fields && action.id && action.fields.key) {
        nextState = {
          ...state,
          [action.id]: {
            ...state[action.id],
            fields: {
              ...(state[action.id]?.fields || {}),
              [action.fields.key]: action.fields.value || "",
            },
          },
        };
        saveState(nextState);
      }
      break;
  }
  return nextState;
};
