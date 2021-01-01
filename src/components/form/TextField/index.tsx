import React from "react";

export const TextField = ({
  value = "",
  onTextChange = (text: string) => {},
}) => {
  return (
    <input
      type='text'
      value='asda'
      onChange={(event) => onTextChange(event.target.value)}
    />
  );
};
