import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next, today } from "../utils/date-time"; // Import your utility functions

export default function DateNavigatorButton({ type, currentDate }) {
  const history = useHistory();

  // Use the utility functions directly to compute the new date
  const dateChangeFunctions = {
    previous: () => previous(currentDate),
    next: () => next(currentDate),
    today: () => today(),
  };

  const newDate = dateChangeFunctions[type](); // Call the appropriate function based on `type`
  const destination = `/dashboard?date=${newDate}`;

  const onClickHandler = () => {
    history.push(destination);
  };

  const buttonText = type.charAt(0).toUpperCase() + type.slice(1); // Capitalize the button text
  const buttonStyle = buttonText === "Today" ? "btn-primary" : "btn-secondary";

  return (
    <button className={`btn ${buttonStyle} me-3 mb-3`} onClick={onClickHandler}>
      {buttonText}
    </button>
  );
}