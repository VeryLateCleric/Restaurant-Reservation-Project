import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

// TODO Add multi line commenting
export default function NewTable() {
  const defaultFormData = {
    table_name: "",
    capacity: 0,
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  const history = useHistory();

  const formChangeHandler = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const formIsValid = () => {
    let validForm = true;
    return validForm;
  };

  const submitHandler = (event) => {
    event.preventDefault(); // prevents default behavior
    setSubmissionErrors([]);

    formData.capacity = parseInt(formData.capacity); // capacity must be an integer for to the backend

    // API util to submit to the backend
    if (formIsValid())
      createTable(formData)
        .then(() => history.push("/dashboard"))
        .catch((errorObj) =>
          setSubmissionErrors((subErrors) => [...subErrors, errorObj])
        );
  };

  const cancelHandler = () => {
    history.goBack();
  };

  const errorDisplay = submissionErrors.map((error, index) => (
    <ErrorAlert key={index} error={error} />
  ));

  // JSX return statement to create the form
  return (
    <main>
      <div className="d-flex flex-column mb-3">
        <h1 className="h1 align-self-center">Create a New Table</h1>
        <form
          onSubmit={submitHandler}
          className="align-self-center col-10 col-xl-5"
        >
          {errorDisplay}
          <fieldset>
            <div className="form-group my-2">
              <label htmlFor="table_name">Table Name</label>
              <input
                id="table_name"
                type="text"
                name="table_name"
                placeholder="Please provide a name for the table"
                title="Please provide a name for the table"
                className="form-control my-2"
                value={formData.table_name}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="capacity">Maximum Capacity</label>
              <input
                id="capacity"
                type="number"
                name="capacity"
                placeholder="Please enter the maximum seating capacity for this table"
                title="Please enter the maximum seating capacity for this table"
                className="form-control my-2"
                min="1"
                value={formData.capacity}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary btn-lg col-5"
                onClick={cancelHandler}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-lg col-5">
                Submit
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  );
}
