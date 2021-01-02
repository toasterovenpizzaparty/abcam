import React from "react";
import styles from "./paragraph.module.css";
export const Paragraph: React.FC = ({ children }) => (
  <p className={styles.paragraph}>{children}</p>
);
