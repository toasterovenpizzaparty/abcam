import { useSharedState } from "../../hooks/shared-state";

/**
 *
 * @description Creates a hook to retrieve the entire state for a step/id.
 */
export const useStepSelector = (step: string) => {
  const state = useSharedState();
  return state?.steps?.[step];
};
