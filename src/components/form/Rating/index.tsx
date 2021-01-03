import React from "react";
import styles from "./rating.module.css";

export const Rating = ({
  label = "",
  maxRating = 5,
  selectedRating = "0",
  onRatingChange = (rating: string) => {},
}) => {
  return (
    <div className={styles.rating}>
      <span className={styles["rating__label-text"]}>{label}</span>
      <fieldset className={styles["rating__stars"]}>
        {Array.from({ length: maxRating }).map((value, labelIndex) => (
          <label key={`rating-label-${labelIndex}`}>
            <input
              type='radio'
              name='stars'
              value={labelIndex + 1}
              onChange={() => onRatingChange(`${labelIndex + 1}`)}
              checked={parseInt(selectedRating) === labelIndex + 1}
              aria-label={`${labelIndex + 1} out of ${maxRating} stars`}
            />
            {Array.from({ length: labelIndex + 1 }).map((val, iconIndex) => (
              <span
                className={styles.icon}
                key={`rating-icon-${labelIndex}-${iconIndex}`}
              >
                ★
              </span>
            ))}
          </label>
        ))}
      </fieldset>
    </div>
  );
};
export default Rating;
