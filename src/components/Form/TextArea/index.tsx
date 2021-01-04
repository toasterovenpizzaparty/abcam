import React from "react";
import styles from "./textarea.module.css";

type TextAreaPropTypes = {
  value: string;
  label: string;
  onTextChange: (text: string) => void;
};

/**
 *
 * @description Returns a textarea with a label
 */
export const TextArea: React.FC<Partial<TextAreaPropTypes>> = ({
  label = "",
  value = "",
  onTextChange = (text: string) => {},
}) => {
  return (
    <label className={styles.textarea}>
      <span className={styles["textarea__label-text"]}>{label}</span>
      <div className={styles["textarea__input-wrapper"]}>
        <textarea
          className={styles["textarea__input"]}
          onChange={(event) => onTextChange(event.target.value)}
          value={value}
        />
      </div>
    </label>
  );
};
export default TextArea;
