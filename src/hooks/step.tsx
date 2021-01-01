import { useContext } from "react";
import { StepContext, ActionTypes } from "../providers/step";

export const useStep = (key: string) => {
  const context = useContext(StepContext);

  return (formFieldKey: string) => {
    return {
      getField: () => {
        if (context && context?.state[key]) {
          return (
            context?.state[key] && context?.state[key].formFields[formFieldKey]
          );
        }
        return null;
      },
      saveField: (value: string) => {
        if (context?.dispatch) {
          context.dispatch({
            type: ActionTypes.SAVE_FORM_FIELD,
            formFields: {
              stepKey: key,
              formFieldKey,
              value,
            },
          });
        }
      },
    };
  };
};
