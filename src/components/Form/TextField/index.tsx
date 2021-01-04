import React from "react";
import styles from "./textfield.module.css";

/**
 *
 * @description Returns a textfield input with a label
 */
export const TextField = ({
  label = "",
  value = "",
  placeholder = "",
  onTextChange = (text: string) => {},
}) => {
  return (
    <label className={styles.textfield}>
      <span className={styles["textfield__label-text"]}>{label}</span>
      <div className={styles["textfield__input-wrapper"]}>
        <input
          className={styles["textfield__input"]}
          type='text'
          placeholder={placeholder}
          value={value}
          onChange={(event) => onTextChange(event.target.value)}
        />
      </div>
    </label>
  );
};
export default TextField;
