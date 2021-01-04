import React, { useReducer, useEffect } from "react";
import {
  State as StepReducerState,
  Action as StepReducerAction,
  ActionTypes as StepReducerActionTypes,
  StepReducer,
} from "../redux/reducers/step-reducer/step-reducer";
import {
  State as ApiReducerState,
  Action as ApiReducerAction,
  APIReducer,
} from "../redux/reducers/api-reducer/api-reducer";

export type RootState = {
  steps: StepReducerState;
  api: ApiReducerState;
};

type Action = StepReducerAction & ApiReducerAction;

/**
 *
 * @description Set our initial state.
 */
const initialState = {
  steps: {},
  api: { isLoading: false, data: null, error: null },
};

/**
 *
 * @description Main context object
 */
export const SharedStateContext = React.createContext<{
  state: RootState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: (value: Action) => {},
});

/**
 *
 * @description Combines our two reducers.
 * @todo Split these reducers into seperate contexts. Either update triggers an update for both.
 */
const reducer = (state: RootState, action: Action): RootState => {
  state = { ...state, steps: StepReducer(state.steps, action) };
  state = { ...state, api: APIReducer(state.api, action) };

  return state;
};

type SharedStateProviderPropTypes = {
  CACHE_KEY?: string;
};

/**
 *
 * @description Initialize our reducer and hydrate on start.
 */
export const SharedStateProvider: React.FC<SharedStateProviderPropTypes> = ({
  children,
  CACHE_KEY = "STEP_STATE_PROVIDER",
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({
      type: StepReducerActionTypes.HYDRATE,
    });
  }, []);

  return (
    <SharedStateContext.Provider
      value={{ state, dispatch }}
      data-test-id='shared-state-provider'
    >
      {children}
    </SharedStateContext.Provider>
  );
};
