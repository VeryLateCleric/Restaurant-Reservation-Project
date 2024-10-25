import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert";
import { convert12HourTime } from "../utils/date-time";

export default function ReservationForm({ type, defaultFormData, APICall }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [submissionErrors, setSubmissionErrors] = useState([]);

  // Reload the formData anytime defaultFormData changes
  useEffect(() => {
    setFormData(defaultFormData);
  }, [defaultFormData]);

  const history = useHistory();

  const formChangeHandler = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let isFormValid = true;
    const closedDays = { 2: "Tuesday" }; // Days the restaurant is closed
    const startTime = "10:30"; // Restaurant opening time
    const closeTime = "21:30"; // Restaurant closing time (one hour before actual close)

    const reservationDateTime = new Date(
      `${formData.reservation_date}T${formData.reservation_time}`
    );
    const now = new Date();

    // Helper function to add an error
    const addError = (message) => {
      isFormValid = false;
      setSubmissionErrors((subErrors) => [...subErrors, { message }]);
    };

    // Check if reservation is in the past
    if (reservationDateTime <= now) {
      addError(
        "Your reservation cannot be made for a date or time in the past. Please select a future date."
      );
    }

    // Check if the restaurant is closed on the selected day
    const selectedDay = reservationDateTime.getDay();
    if (closedDays[selectedDay]) {
      addError(createClosedMessage(closedDays, selectedDay)); // Using the alternative message generator function
    }

    const openTime = new Date(`${formData.reservation_date}T${startTime}`);
    const lastReservationTime = new Date(
      `${formData.reservation_date}T${closeTime}`
    );

    // Check if the reservation is within allowed hours
    if (
      reservationDateTime < openTime ||
      reservationDateTime > lastReservationTime
    ) {
      addError(
        `The restaurant is only taking reservations between ${convert12HourTime(
          startTime
        )} and ${convert12HourTime(closeTime)}.`
      );
    }

    return isFormValid;
  };

  const submitHandler = (event) => {
    event.preventDefault(); // prevents default behavior
    setSubmissionErrors([]);

    formData.people = parseInt(formData.people); // people must an integer before submiting the data

    // API util to submit to the backend
    if (validateForm())
      APICall(formData)
        .then(() =>
          history.push(`/dashboard?date=${formData.reservation_date}`)
        )
        .catch((errorObj) =>
          setSubmissionErrors((subErrors) => [...subErrors, errorObj])
        );
  };

  const cancelHandler = () => {
    // Navigate one step backwards through browser's history
    history.goBack();
  };

  const errorDisplay = submissionErrors.map((error, index) => (
    <ErrorAlert key={index} error={error} />
  ));

  // Helper function to generate error message for days the restaurant is closed
  function createClosedMessage(closedDays, selectedDay) {
    // Convert the closedDays object values into an array of closed day names
    const closedDayNames = Object.values(closedDays);

    // Construct the base of the message with the selected day's name
    let message = `The date you have selected is a ${closedDays[selectedDay]}. `;
    message += "The restaurant is closed on ";

    const numClosedDays = closedDayNames.length;

    // If there is only one closed day
    if (numClosedDays === 1) {
      message += `${closedDayNames[0]}s.`;
    } else if (numClosedDays === 2) {
      // If there are exactly two closed days, use " and " between them
      message += `${closedDayNames[0]}s and ${closedDayNames[1]}s.`;
    } else {
      // For more than two closed days, join with commas and use " and " for the last item
      message += `${closedDayNames.slice(0, -1).join("s, ")}s, and ${
        closedDayNames[numClosedDays - 1]
      }s.`;
    }

    return message;
  }

  // JSX return statement to create the form
  return (
    <main>
      <div className="d-flex flex-column mb-3">
        <h1 className="h1 align-self-center">{type} Reservation</h1>
        <form
          onSubmit={submitHandler}
          className="align-self-center col-10 col-xl-5"
        >
          {errorDisplay}
          <fieldset className="d-flex flex-column ">
            <div className="form-group my-2">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                title="Enter your first name"
                className="form-control my-2"
                value={formData.first_name}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                title="Enter your last name"
                className="form-control my-2"
                value={formData.last_name}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="mobile_number">Mobile number</label>
              <input
                id="mobile_number"
                type="text"
                name="mobile_number"
                placeholder="Enter your mobile phone number"
                title="Enter your mobile phone number"
                className="form-control my-2"
                value={formData.mobile_number}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="reservation_date">Date of Reservation</label>
              <input
                id="reservation_date"
                type="date"
                name="reservation_date"
                title="Please select the date you wish to reserve"
                className="form-control my-2"
                value={formData.reservation_date}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="reservation_time">Time of Reservation</label>
              <input
                id="reservation_time"
                type="time"
                name="reservation_time"
                title="Please select the time you wish to reserve"
                className="form-control my-2"
                value={formData.reservation_time}
                onChange={formChangeHandler}
                required
              />
            </div>

            <div className="form-group my-2">
              <label htmlFor="people">Size of Party</label>
              <input
                id="people"
                type="number"
                name="people"
                placeholder="Please enter the size of your party"
                title="Please enter the size of your party"
                className="form-control my-2"
                min="1"
                value={formData.people}
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
