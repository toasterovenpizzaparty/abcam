import { useSharedState } from "../../providers/shared-state";

export const useStepSelector = (step: string) => {
  const state = useSharedState();
  return state?.steps?.[step];
};
