import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
  StoreEnhancer,
} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {};
const enhancers: StoreEnhancer[] = [];
const middleware = [thunk];

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  composeWithDevTools(...enhancers)
);
const combinedReducers = combineReducers({
  potato: (state = {}, action) => state,
  tomato: (state = {}, action) => state,
});
const store = createStore(combinedReducers, initialState, composedEnhancers);

export default store;
