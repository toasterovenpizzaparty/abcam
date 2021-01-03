import React from "react";
import styles from "./error-message.module.css";

type ErrorMessagePropTypes = {
  messages: string[];
  isVisible: boolean;
};

export const ErrorMessage = ({
  messages = [],
  isVisible = false,
}: ErrorMessagePropTypes) =>
  isVisible ? (
    <>
      {messages.map((message, index) => (
        <p key={`${message}-${index}`} className={styles.errormessage}>
          {message}
        </p>
      ))}
    </>
  ) : null;
export default ErrorMessage;
