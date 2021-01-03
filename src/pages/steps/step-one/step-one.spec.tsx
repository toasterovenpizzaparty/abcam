import React from "react";
import { mount, shallow } from "enzyme";
import { SharedStateProvider } from "../../../providers/shared-state";
import "../../../config/enzyme";

import { StepOne } from "./step-one";

describe("<Step One />", () => {
  it("Renders the page", () => {
    const wrapper = shallow(
      <SharedStateProvider>
        <StepOne />
      </SharedStateProvider>
    ).dive();

    expect(wrapper).toMatchSnapshot();
  });

  it("Saves the users input data in the store", () => {
    const wrapper = mount(
      <SharedStateProvider>
        <StepOne />
      </SharedStateProvider>
    );

    // Input a value into the textfield and verify it got saved in our reducer.
    const textInput = wrapper.find('[data-test-id="title"] input');
    textInput.getDOMNode().value = "foobar";
    textInput.simulate("input");

    wrapper.update();
    expect(wrapper.find('[data-test-id="title"] input').props().value).toEqual(
      "foobar"
    );

    // Pick a rating.
    const ratingInput = wrapper.find('[data-test-id="rating"] input').at(2);
    ratingInput.getDOMNode().checked = true;
    ratingInput.simulate("change");
    wrapper.update();

    expect(
      wrapper.find('[data-test-id="rating"]').props().selectedRating
    ).toEqual("3");

    expect(
      wrapper.find('[data-test-id="shared-state-provider"]').props().value.state
    ).toEqual({
      api: {
        data: null,
        error: null,
        isLoading: false,
      },
      steps: {
        "step-one": {
          fields: {
            rating: "3",
            title: "foobar",
          },
        },
      },
    });
  });
});
