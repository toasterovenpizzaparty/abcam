import react, { createContext, useReducer, Reducer, useEffect } from "react";
import { AxiosResponse, AxiosError } from "axios";

/* 
  Deprecated, redux is used for our state management.
  */

type FormFields = {
  [key: string]: string;
};

type Step = {
  formFields: FormFields;
  isLoading: false;
};

type State = {
  [key: string]: Step;
};

type FormFieldPayload = {
  value: string;
  stepKey: string;
  formFieldKey: string;
};

export enum ActionTypes {
  HYDRATE,
  SAVE_FORM_FIELD,
}

export type Action = {
  type: ActionTypes;
  state?: State;
  formFields?: FormFieldPayload;
};

type StepProviderProps = {
  children: React.ReactNode;
  CACHE_KEY?: string;
};

type StepContextType = {
  state: State;
  dispatch: react.Dispatch<Action>;
};

export const StepContext = createContext<StepContextType | null>(null);

const reducer: Reducer<State, Action> = (state, action) => {
  return state;
};

export const StepProvider: React.FC<StepProviderProps> = ({
  children,
  CACHE_KEY = "STEP_STATE_PROVIDER",
}) => {
  const [state, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(state));
    } catch (error) {
      // Quota limit exceeded or turned off by the user.
      console.log("Error storing state", error);
    }
  }, [state]);

  useEffect(() => {
    // Hydrate our state from cache.
    try {
      const contents = localStorage.getItem(CACHE_KEY);
      if (contents) {
        const state = JSON.parse(contents);
        dispatch({
          type: ActionTypes.HYDRATE,
          state,
        });
      }
    } catch (error) {
      console.log("Error hydrating state", error);
    }
  }, []);

  return (
    <StepContext.Provider value={{ state, dispatch }}>
      {children}
    </StepContext.Provider>
  );
};
