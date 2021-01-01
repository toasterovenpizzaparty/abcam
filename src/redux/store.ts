import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
  StoreEnhancer,
} from "redux";
import thunk from "redux-thunk";
import { StepReducer, State as StepState } from "./reducers";
const initialState = {};
const enhancers: StoreEnhancer[] = [];
const middleware = [thunk];

export type RootState = {
  steps: StepState;
};

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  compose(...enhancers)
);
const combinedReducers = combineReducers({
  steps: StepReducer,
});

const getStore = () =>
  createStore(combinedReducers, initialState, composedEnhancers);
const store = getStore();

export default store;
export { getStore };
