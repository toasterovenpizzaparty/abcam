import "../../config/enzyme";
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
        stepKey: "test-step",
        fields: {
          formFieldKey: "test-field",
          value: "bar",
        },
      })
    ).toMatchObject(resultState);

    expect(
      StepReducer(resultState, {
        type: ActionTypes.SAVE_FORM_FIELD,
        stepKey: "test-step",
        fields: {
          formFieldKey: "test-field-2",
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
        stepKey: "test-step",
        fields: {
          formFieldKey: "test-field",
        },
      })
    ).toEqual({});

    expect(
      StepReducer(undefined, {
        type: ActionTypes.SAVE_FORM_FIELD,
        fields: {
          formFieldKey: "test-field",
        },
      })
    ).toEqual({});

    expect(
      StepReducer(undefined, {
        type: ActionTypes.SAVE_FORM_FIELD,
        stepKey: "test-step",
      })
    ).toEqual({});
  });

  it("Resets data and error and sets loading to true if a request is started", () => {
    expect(
      StepReducer(undefined, {
        type: ActionTypes.START_REQUEST,
        stepKey: "foo-bar",
      })
    ).toEqual({
      "foo-bar": {
        data: null,
        error: null,
        isLoading: true,
      },
    });

    expect(
      StepReducer(undefined, {
        type: ActionTypes.START_REQUEST,
      })
    ).toEqual({});

    expect(
      StepReducer(undefined, {
        type: ActionTypes.FINISH_REQUEST,
        stepKey: "foo-bar",
        serverResponse: {
          data: 123,
          error: 123,
        },
      })
    ).toEqual({
      "foo-bar": {
        data: 123,
        error: 123,
        isLoading: false,
      },
    });

    expect(
      StepReducer(undefined, {
        type: ActionTypes.START_REQUEST,
        stepKey: "foo-bar",
      })
    ).toEqual({
      "foo-bar": {
        data: null,
        error: null,
        isLoading: true,
      },
    });
  });

  it("Finishes a request, sets data/error and loading false", () => {
    expect(
      StepReducer(undefined, {
        type: ActionTypes.FINISH_REQUEST,
        stepKey: "foo-bar",
        serverResponse: {
          data: 123,
          error: 123,
        },
      })
    ).toEqual({
      "foo-bar": {
        data: 123,
        error: 123,
        isLoading: false,
      },
    });

    expect(
      StepReducer(undefined, {
        type: ActionTypes.FINISH_REQUEST,
        stepKey: "foo-bar",
      })
    ).toEqual({
      "foo-bar": {
        data: undefined,
        error: undefined,
        isLoading: false,
      },
    });

    expect(
      StepReducer(undefined, {
        type: ActionTypes.FINISH_REQUEST,
      })
    ).toEqual({});
  });
});
