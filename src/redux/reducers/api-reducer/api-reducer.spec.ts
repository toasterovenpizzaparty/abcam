import "../../../config/enzyme";
import { APIReducer, ActionTypes } from "./api-reducer";

it("Resets data and error and sets loading to true if a request is started", () => {
  expect(
    APIReducer(undefined, {
      type: ActionTypes.START_REQUEST,
    })
  ).toEqual({
    data: null,
    error: null,
    isLoading: true,
  });

  expect(
    APIReducer(undefined, {
      type: ActionTypes.FINISH_REQUEST,
      data: 123,
      error: 123,
    })
  ).toEqual({
    data: 123,
    error: 123,
    isLoading: false,
  });
});

it("Finishes a request, sets data/error and loading false", () => {
  expect(
    APIReducer(undefined, {
      type: ActionTypes.FINISH_REQUEST,
      data: 123,
      error: 123,
    })
  ).toEqual({
    data: 123,
    error: 123,
    isLoading: false,
  });

  expect(
    APIReducer(undefined, {
      type: ActionTypes.FINISH_REQUEST,
    })
  ).toEqual({
    data: null,
    error: null,
    isLoading: false,
  });
});
