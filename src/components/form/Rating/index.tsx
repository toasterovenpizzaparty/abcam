import React from "react";
import styles from "./rating.module.css";

export const Rating = ({
  maxRating = 5,
  selectedRating = "0",
  onRatingChange = (rating: string) => {},
}) => {
  return (
    <form className={styles.rating}>
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
    </form>
  );
};
