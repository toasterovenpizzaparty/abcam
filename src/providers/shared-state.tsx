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

const initialState = {
  steps: {},
  api: { isLoading: false, data: null, error: null },
};

const StepStoreContext = React.createContext<{
  state: RootState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: (value: Action) => {},
});

export const useSharedState = () => {
  const ctx = React.useContext(StepStoreContext);
  return ctx.state;
};

export const useDispatch = () => {
  const ctx = React.useContext(StepStoreContext);
  return ctx.dispatch;
};

const reducer = (state: RootState, action: Action): RootState => {
  state.steps = StepReducer(state.steps, action);
  state.api = APIReducer(state.api, action);

  return {
    ...state,
  };
};

type SharedStateProviderPropTypes = {
  CACHE_KEY?: string;
};

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
    <StepStoreContext.Provider
      value={{ state, dispatch }}
      data-test-id='shared-state-provider'
    >
      {children}
    </StepStoreContext.Provider>
  );
};
