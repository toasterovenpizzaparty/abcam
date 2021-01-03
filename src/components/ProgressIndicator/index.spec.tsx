import React from "react";
import { shallow } from "enzyme";
import "../../config/enzyme";
import { ProgressIndicator, getFloat, getPercentage } from "./index";

describe("<ProgressIndicator />", () => {
  it("Renders the progress indicator", () => {
    const wrapper = shallow(<ProgressIndicator current={25} />);
    expect(wrapper).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();
  });

  it("Converts input to a proper float number", () => {
    // Verify string conversion
    expect(getFloat("0")).toEqual(0);
    // Verify string conversion from non-numeric value
    expect(getFloat("foobar")).toEqual(0.0);
    // Verify number conversion
    expect(getFloat(123)).toEqual(123);
    // Verify precision
    expect(getFloat(123.2343, 0.0, 2)).toEqual(123.23);
  });

  it("Converts input to a proper percentage number", () => {
    // Division by zero
    expect(getPercentage("0", "0")).toEqual(0);
    expect(getPercentage("0", "100")).toEqual(0);
    expect(getPercentage(25, 100)).toEqual(0.25);
    expect(getPercentage("25", "100")).toEqual(0.25);
  });
});
