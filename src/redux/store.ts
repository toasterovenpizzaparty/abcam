import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
  StoreEnhancer,
} from "redux";
import thunk from "redux-thunk";
import { StepReducer, StepState, APIReducer, APIState } from "./reducers";
const initialState = {};
const enhancers: StoreEnhancer[] = [];
const middleware = [thunk];

export type RootState = {
  steps: StepState;
  api: APIState;
};

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  compose(...enhancers)
);
const combinedReducers = combineReducers({
  steps: StepReducer,
  api: APIReducer,
});

const getStore = () =>
  createStore(combinedReducers, initialState, composedEnhancers);
const store = getStore();

export default store;
export { getStore };
