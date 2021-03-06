import React from "react";
import styles from "./logo.module.css";
/**
 *
 * @description Return a logo
 */
export const Logo = () => (
  <img
    className={styles.logo}
    alt='Abcam logo'
    width='147'
    height='30'
    src='/abcam_logo.png'
  />
);
export default Logo;
