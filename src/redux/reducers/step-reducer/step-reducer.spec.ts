import "../../../config/enzyme";
import { StepReducer, ActionTypes, saveState } from "./step-reducer";

describe("<Step Reducer />", () => {
  it("Should return an (empty) initial state", () => {
    expect(StepReducer(undefined, {})).toMatchObject({});
  });

  it("Hydrates state", () => {
    const stateToHydrate = {
      ["test-step"]: {
        fields: {
          ["test-field"]: "bar",
        },
      },
    };
    saveState(stateToHydrate);
    expect(
      StepReducer(undefined, {
        type: ActionTypes.HYDRATE,
      })
    ).toEqual(stateToHydrate);
  });

  it("Saves a formfield within a step", () => {
    const resultState = {
      ["test-step"]: {
        fields: {
          ["test-field"]: "bar",
        },
      },
    };
    expect(
      StepReducer(undefined, {
        type: ActionTypes.SAVE_FORM_FIELD,
        id: "test-step",
        fields: {
          key: "test-field",
          value: "bar",
        },
      })
    ).toMatchObject(resultState);

    expect(
      StepReducer(resultState, {
        type: ActionTypes.SAVE_FORM_FIELD,
        id: "test-step",
        fields: {
          key: "test-field-2",
          value: "foo",
        },
      })
    ).toMatchObject({
      ["test-step"]: {
        fields: {
          ["test-field"]: "bar",
          ["test-field-2"]: "foo",
        },
      },
    });
  });

  it("Does not save anything if stepkey or fields is missing", () => {
    expect(
      StepReducer(undefined, {
        type: ActionTypes.SAVE_FORM_FIELD,
        fields: {
          key: "test-field",
        },
      })
    ).toEqual({});

    expect(
      StepReducer(undefined, {
        type: ActionTypes.SAVE_FORM_FIELD,
        id: "test-step",
      })
    ).toEqual({});
  });
});
