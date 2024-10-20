import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import "./LoadingMessage.css";

// Supplies a message for loading to help hide delays between async calls.
export default function LoadingMessage({ component = null, color = "primary" }) {
  const { promiseInProgress } = usePromiseTracker();
  return promiseInProgress ? (
    <div className={`loader text-${color}`}>Now Loading...</div>
  ) : (
    component
  );
}
