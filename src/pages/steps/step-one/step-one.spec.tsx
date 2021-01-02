import React from "react";
import axios from "axios";
import { mount, shallow } from "enzyme";
import { Provider } from "react-redux";
import { getStore } from "../../../redux/store";
import "../../../config/enzyme";
import { Router } from "react-router-dom";
import { StepOne } from "./step-one";
import { STEPS, FIELDS } from "../../../config/form-types";
import { ActionTypes } from "../../../redux/reducers";

const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("axios");

describe("<Step One />", () => {
  it("Renders the page", () => {
    const wrapper = shallow(
      <Provider store={getStore()}>
        <StepOne />
      </Provider>
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it("Saves the users input data in the store", () => {
    const reduxStore = getStore();
    const wrapper = mount(
      <Provider store={reduxStore} data-test-id='redux-provider'>
        <StepOne />
      </Provider>
    );
    wrapper.find('[data-test-id="title"]').simulate("change", {
      target: {
        value: "foobar",
      },
    });
    wrapper.update();

    expect(wrapper.find('[data-test-id="title"]').props().value).toEqual(
      "foobar"
    );
    wrapper
      .find('[data-test-id="rating"] input')
      .at(2)
      .simulate("change", { target: { checked: true } });
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="rating"]').props().selectedRating
    ).toEqual("3");

    console.log(reduxStore.getState());

    expect(reduxStore.getState()).toEqual({
      steps: {
        [STEPS.STEP_ONE]: {
          fields: { title: "foobar", rating: "3" },
        },
      },
    });
  });

  it("disabled the submit if API is loading or insufficient input is given", () => {
    const reduxStore = getStore();
    const wrapper = mount(
      <Provider store={reduxStore} data-test-id='redux-provider'>
        <StepOne />
      </Provider>
    );

    expect(
      wrapper.find('[data-test-id="submit-button"]').props().disabled
    ).toBe(true);

    reduxStore.dispatch({
      type: ActionTypes.SAVE_FORM_FIELD,
      stepKey: STEPS.STEP_ONE,
      fields: {
        formFieldKey: FIELDS.RATING,
        value: "2",
      },
    });
    reduxStore.dispatch({
      type: ActionTypes.SAVE_FORM_FIELD,
      stepKey: STEPS.STEP_ONE,
      fields: {
        formFieldKey: FIELDS.TITLE,
        value: "foobar",
      },
    });
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="submit-button"]').props().disabled
    ).toBe(false);

    reduxStore.dispatch({
      type: ActionTypes.START_REQUEST,
      stepKey: STEPS.STEP_ONE,
    });
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="submit-button"]').props().disabled
    ).toBe(true);

    reduxStore.dispatch({
      type: ActionTypes.FINISH_REQUEST,
      stepKey: STEPS.STEP_ONE,
      serverResponse: {
        data: null,
        error: null,
      },
    });
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="submit-button"]').props().disabled
    ).toBe(false);
  });

  it("shows an error message if the API throws an error", async () => {
    const reduxStore = getStore();
    const wrapper = mount(
      <Provider store={reduxStore} data-test-id='redux-provider'>
        <StepOne />
      </Provider>
    );

    expect(wrapper.find('[data-test-id="error-message"]').exists()).toBe(false);

    reduxStore.dispatch({
      type: ActionTypes.FINISH_REQUEST,
      stepKey: STEPS.STEP_ONE,
      serverResponse: {
        data: null,
        error: { message: "foo bar" },
      },
    });
    wrapper.update();

    expect(wrapper.find('[data-test-id="error-message"]').exists()).toBe(true);
  });

  it("Submits the data to an API and pushes a route with the correct id", async () => {
    const expectedId = 3;
    axios.create.mockImplementation((config) => axios);
    axios.request.mockImplementationOnce(() => ({
      data: {
        id: expectedId,
      },
    }));
    const historyMock = { push: jest.fn(), location: {}, listen: jest.fn() };

    const reduxStore = getStore();
    const wrapper = mount(
      <Provider store={reduxStore} data-test-id='redux-provider'>
        <Router history={historyMock}>
          <StepOne />
        </Router>
      </Provider>
    );

    reduxStore.dispatch({
      type: ActionTypes.SAVE_FORM_FIELD,
      stepKey: STEPS.STEP_ONE,
      fields: {
        formFieldKey: FIELDS.RATING,
        value: "2",
      },
    });
    reduxStore.dispatch({
      type: ActionTypes.SAVE_FORM_FIELD,
      stepKey: STEPS.STEP_ONE,
      fields: {
        formFieldKey: FIELDS.TITLE,
        value: "foobar",
      },
    });
    wrapper.update();

    wrapper.find('[data-test-id="submit-button"]').simulate("click");
    wrapper.update();

    // Flush promises
    await new Promise((resolve) => setImmediate(resolve));

    const route = ((historyMock.push.mock.calls || []).pop() || []).pop();
    expect(route).toEqual(`/step/2/id/${expectedId}`);
  });
});
