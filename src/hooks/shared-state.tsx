import React from "react";
import { SharedStateContext } from "../providers/shared-state";

/**
 *
 * @description Provide a hook to retrieve our shared state.
 */
export const useSharedState = () => {
  const ctx = React.useContext(SharedStateContext);
  return ctx.state;
};

/**
 *
 * @description Provide a hook to retrieve our dispatch function.
 */
export const useDispatch = () => {
  const ctx = React.useContext(SharedStateContext);
  return ctx.dispatch;
};
