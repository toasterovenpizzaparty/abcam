import React from "react";
import styles from "./title.module.css";

const supportedHeaderLevels = ["h1", "h2", "h3", "h4", "h5"];

type TitleProps = {
  children: React.ReactNode;
  headerLevel?: "h1" | "h2" | "h3" | "h4" | "h5";
};

/**
 *
 * @description Returns a title with a header-level
 */
export const Title: React.FC<TitleProps> = ({
  children,
  headerLevel = "h1",
}) => {
  const Tag =
    supportedHeaderLevels.indexOf(headerLevel) > -1 ? headerLevel : "h1";
  return <Tag className={styles.title}>{children}</Tag>;
};
export default Title;
