import React from "react";
import axios from "axios";
import { mount } from "enzyme";
import "../../config/enzyme";
import { MemoryRouter, Router, Route } from "react-router-dom";
import { StepPage } from "./step";
import {
  getStepComponent,
  getStepIndex,
  StepComponentMap,
} from "../../config/steps";
import { STEPS, FIELDS } from "../../config/form-types";
import { SharedStateProvider } from "../../providers/shared-state";
import { ActionTypes as ApiReducerActionTypes } from "../../redux/reducers/api-reducer/api-reducer";
import {
  ActionTypes as StepReducerActionTypes,
  StepReducer,
} from "../../redux/reducers/step-reducer/step-reducer";

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("axios");

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe("<StepPage />", () => {
  it("Renders the correct step", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/2"]}>
        <Route path='/step/:step'>
          <StepPage />
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find('[data-test-id="step-component-1"]').exists()).toBe(
      true
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders step 3", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/3"]}>
        <Route path='/step/:step'>
          <StepPage />
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find('[data-test-id="step-component-2"]').exists()).toBe(
      true
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders step 4", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/4"]}>
        <Route path='/step/:step'>
          <StepPage />
        </Route>
      </MemoryRouter>
    );
    expect(wrapper.find('[data-test-id="step-component-3"]').exists()).toBe(
      true
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Retrieves the correct component", () => {
    expect(getStepComponent(0)).toBe(StepComponentMap[0]);
    expect(getStepComponent(1)).toBe(StepComponentMap[1]);
  });

  it("Returns the correct step index", () => {
    expect(getStepIndex(undefined)).toBe(0);
    expect(getStepIndex("Hi")).toBe(0);
    expect(getStepIndex("2")).toBe(1);
  });

  it("Renders a fallback if the step does not exist", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/undefined-123"]}>
        <Route path='/step/:step'>
          <StepPage />
        </Route>
      </MemoryRouter>
    );

    expect(wrapper.find('[data-test-id="step-component-0"]').exists()).toBe(
      true
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("disabled the submit if API is loading or insufficient input is given", () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/1"]}>
        <Route path='/step/:step'>
          <SharedStateProvider>
            <StepPage />
          </SharedStateProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      wrapper.find('[data-test-id="next-button"]').props().isDisabled
    ).toBe(true);

    expect(
      wrapper.find('[data-test-id="previous-button"]').props().isDisabled
    ).toBe(true);

    const dispatch = wrapper
      .find('[data-test-id="shared-state-provider"]')
      .props().value.dispatch;

    // Input a value into the textfield and verify it got saved in our reducer.
    const textInput = wrapper.find('[data-test-id="title"] input');
    textInput.getDOMNode().value = "foobar";
    textInput.simulate("input");

    const ratingInput = wrapper.find('[data-test-id="rating"] input').at(2);
    ratingInput.getDOMNode().checked = true;
    ratingInput.simulate("change");
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="next-button"]').props().isDisabled
    ).toBe(false);

    expect(
      wrapper.find('[data-test-id="previous-button"]').props().isDisabled
    ).toBe(true);

    dispatch({
      type: ApiReducerActionTypes.START_REQUEST,
    });
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="next-button"]').props().isDisabled
    ).toBe(true);

    dispatch({
      type: ApiReducerActionTypes.FINISH_REQUEST,
      data: null,
      error: null,
    });
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="next-button"]').props().isDisabled
    ).toBe(false);
  });

  it("shows an error message if the API throws an error", async () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/1"]}>
        <Route path='/step/:step'>
          <SharedStateProvider>
            <StepPage />
          </SharedStateProvider>
        </Route>
      </MemoryRouter>
    );

    const dispatch = wrapper
      .find('[data-test-id="shared-state-provider"]')
      .props().value.dispatch;

    wrapper.update();
    expect(
      wrapper.find('[data-test-id="step-error-message"]').at(0).props()
        .isVisible
    ).toBe(false);

    dispatch({
      type: ApiReducerActionTypes.FINISH_REQUEST,
      data: null,
      error: { message: "foo bar" },
    });
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="step-error-message"]').at(0).props()
        .isVisible
    ).toBe(true);
  });

  it("On step 1 creates a review and pushes the correct route id", async () => {
    const expectedId = 3;
    axios.create.mockImplementation((config) => axios);
    axios.request.mockImplementationOnce(() => ({
      data: {
        id: expectedId,
      },
    }));

    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/1"]}>
        <SharedStateProvider>
          <StepPage />
        </SharedStateProvider>
      </MemoryRouter>
    );
    const dispatch = wrapper
      .find('[data-test-id="shared-state-provider"]')
      .props().value.dispatch;

    dispatch({
      type: StepReducerActionTypes.SAVE_FORM_FIELD,
      stepKey: STEPS.STEP_ONE,
      fields: {
        formFieldKey: FIELDS.RATING,
        value: "2",
      },
    });
    dispatch({
      type: StepReducerActionTypes.SAVE_FORM_FIELD,
      stepKey: STEPS.STEP_ONE,
      fields: {
        formFieldKey: FIELDS.TITLE,
        value: "foobar",
      },
    });
    wrapper.update();

    wrapper.find('[data-test-id="next-button"] button').simulate("click");
    wrapper.update();

    // Flush promises
    await new Promise((resolve) => setImmediate(resolve));

    expect(mockHistoryPush).toHaveBeenCalledWith(`/step/2/id/${expectedId}`);
  });

  it("On step 2 updates the review and proceeds to the next step", async () => {
    const expectedId = 3;
    axios.create.mockImplementation((config) => axios);
    axios.request.mockImplementationOnce(() => ({
      data: {
        id: expectedId,
      },
    }));

    const wrapper = mount(
      <MemoryRouter initialEntries={["/step/2/id/3"]}>
        <Route path='/step/:step/id/:id'>
          <SharedStateProvider>
            <StepPage />
          </SharedStateProvider>
        </Route>
      </MemoryRouter>
    );

    const dispatch = wrapper
      .find('[data-test-id="shared-state-provider"]')
      .props().value.dispatch;

    dispatch({
      type: StepReducerActionTypes.SAVE_FORM_FIELD,
      stepKey: 2,
      fields: {
        formFieldKey: FIELDS.DESCRIPTION,
        value: "A description",
      },
    });
    wrapper.update();

    wrapper.find('[data-test-id="next-button"] button').simulate("click");
    wrapper.update();

    // Flush promises
    await new Promise((resolve) => setImmediate(resolve));

    // const route = ((historyMock.push.mock.calls || []).pop() || []).pop();
    // expect(route).toEqual(`/step/3/id/${expectedId}`);
    expect(mockHistoryPush).toHaveBeenCalledWith(`/step/3/id/${expectedId}`);
  });
});
