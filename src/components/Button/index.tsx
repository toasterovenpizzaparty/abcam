import React from "react";
import styles from "./button.module.css";

type ButtonPropTypes = {
  isDisabled: boolean;
  onClick: () => void;
};
/** Creates a simple button
 *
 * @description Returns a simple button
 */
export const Button: React.FC<ButtonPropTypes> = ({
  isDisabled = false,
  onClick = () => {},
  children,
}) => (
  <button className={styles.button} disabled={isDisabled} onClick={onClick}>
    {children}
  </button>
);
export default Button;
