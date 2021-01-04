import React from "react";
import styles from "./paragraph.module.css";

/**
 *
 * @description Return a paragraph
 */
export const Paragraph: React.FC = ({ children }) => (
  <p className={styles.paragraph}>{children}</p>
);
