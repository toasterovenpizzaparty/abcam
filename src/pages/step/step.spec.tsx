import React from "react";
import { mount } from "enzyme";
import "../../config/enzyme";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { MemoryRouter as Router, Route } from "react-router-dom";
import { StepPage, getStepComponent, getStepIndex } from "./step";
import { StepOne, StepTwo } from "../steps";

describe("<StepPage />", () => {
  it("Renders the correct step", () => {
    const wrapper = mount(
      <Router initialEntries={["/step/2"]}>
        <Provider store={store}>
          <Route path='/step/:step'>
            <StepPage />
          </Route>
        </Provider>
      </Router>
    );
    expect(wrapper.find('[data-test-id="step-component-1"]').exists()).toBe(
      true
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Retrieves the correct component", () => {
    expect(getStepComponent(0)).toBe(StepOne);
    expect(getStepComponent(1)).toBe(StepTwo);
  });

  it("Returns the correct step index", () => {
    expect(getStepIndex(undefined)).toBe(0);
    expect(getStepIndex("Hi")).toBe(0);
    expect(getStepIndex("2")).toBe(1);
  });

  it("Renders a fallback if the step does not exist", () => {
    const wrapper = mount(
      <Router initialEntries={["/step/undefined-123"]}>
        <Provider store={store}>
          <Route path='/step/:step'>
            <StepPage />
          </Route>
        </Provider>
      </Router>
    );

    expect(wrapper.find('[data-test-id="step-component-0"]').exists()).toBe(
      true
    );
    expect(wrapper).toMatchSnapshot();
  });
});
