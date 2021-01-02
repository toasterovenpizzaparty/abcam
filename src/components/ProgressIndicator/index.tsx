import React from "react";
import styles from "./progressbar.module.css";

type ProgressIndicatorPropTypes = {
  currentStep: number;
  numSteps?: number;
  stepDescriptions: Record<number, string>;
};

export const getFloat = (
  value: string,
  defaultValue: number = 0.0,
  toFixed = 2
) =>
  isNaN(parseFloat(value))
    ? defaultValue
    : parseFloat(parseFloat(value).toFixed(toFixed));

export const getPercentage = (
  current: string | number,
  total: string | number
) => {
  const percentage = getFloat(current.toString()) / getFloat(total.toString());
  return isNaN(percentage) || !isFinite(percentage) ? 0.0 : percentage;
};

export const ProgressIndicator: React.FC<ProgressIndicatorPropTypes> = ({
  currentStep = 1,
  numSteps = 4,
  stepDescriptions,
}) => {
  const percentage = getPercentage(currentStep, numSteps);
  return (
    <div className={styles.progressbar}>
      {Array.from({ length: numSteps }).map((data, index) => (
        <div
          key={`progress-step-block-${index}`}
          className={`${styles["progressbar__block-step"]} ${
            index < currentStep && styles["progressbar__block-step--completed"]
          }`}
        >
          Step {index + 1}:{" "}
          {(stepDescriptions && stepDescriptions[index]) || ""}
        </div>
      ))}
    </div>
  );
};
