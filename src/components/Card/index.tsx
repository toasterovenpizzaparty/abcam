import React from "react";
import { Title, Paragraph } from "../";
import styles from "./card.module.css";

type CardPropTypes = {
  title: string;
  rating: string;
  description: string;
  image: string;
  "image-description": string;
};

/**
 *
 * @description Parse a string to an integer (defaults to 0)
 */
const getNumber = (value: string) =>
  !isNaN(parseInt(value)) ? parseInt(value) : 0;

/**
 *
 * @description Limits the words to x ammount adding an elipses
 */
const limitWords = (value: string, maxLength: number = 300) =>
  value.length > maxLength ? `${value.substr(0, maxLength)}...` : value;

/** Creates a card that shows an image, title and rating
 *
 * @description Returns a card with the provided review information
 */
export const Card: React.FC<Partial<CardPropTypes>> = ({
  title,
  rating,
  description,
  image,
  "image-description": imageDescription,
}) => (
  <section className={styles.card}>
    <div className={styles.imagepreview}>
      {!!image && (
        <>
          <img
            className={styles["imagepreview__image"]}
            alt='A review poster'
            src={image}
          />
          <span className={styles["imagepreview__description"]}>
            {(imageDescription && limitWords(imageDescription)) || ""}
          </span>
        </>
      )}
    </div>
    <div className={styles.review}>
      <div className={styles.review__stars}>
        {Array.from({ length: getNumber(rating || "0") }).map((data, index) => (
          <React.Fragment key={`rating-star-${index}`}>*</React.Fragment>
        ))}
      </div>
      <Title>{title}</Title>
      <Paragraph>{description}</Paragraph>
    </div>
  </section>
);
export default Card;
