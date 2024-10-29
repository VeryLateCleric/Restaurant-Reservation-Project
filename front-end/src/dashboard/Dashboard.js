import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTables,
  finishReservation,
  setReservationStatus,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import DateNavigatorButton from "./DateNavigatorButton";
import DisplayTables from "./DisplayTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const reservationsCols = {
    seatButton: "",
    first_name: "First Name",
    last_name: "Last Name",
    mobile_number: "Mobile Number",
    reservation_time: "Time of Reservation",
    people: "Party Size",
    status: "Current Status",
    editButton: "",
    cancelButton: "",
  };

  const tableCols = {
    finishButton: "",
    table_name: "Table Name",
    capacity: "Maximum Capacity",
    table_status: "Availability",
  };

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadReservations, [date]);
  useEffect(loadTables, []);

  // Call to listReservations. Retrieves necessary data for rendering tables
  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    setReservations([]);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // Call to listTables, where we retrieve and store necessary state data
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    setTables([]);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  // Function to load both Tables and Reservations
  async function loadDashboard() {
    try {
      await Promise.all([loadReservations(), loadTables()]);
    } catch (error) {}
  }

  // Function to call finishReservation, then to call listTables
  async function finishTable(id) {
    setTablesError(null);
    const abortController = new AbortController();

    // Window confirmation dialogue
    if (
      !window.confirm(
        "Is this table ready to seat new guests?\nThis action cannot be undone."
      )
    )
      return () => abortController.abort();

    // After confirmation, finishReservation then loadDashboard again
    try {
      await finishReservation(id, abortController.signal);
      loadDashboard();
    } catch (error) {
      setTablesError(error);
    }
    return () => abortController.abort();
  }

  async function cancelReservation(id, controller) {
    setReservationsError(null);
    try {
      await setReservationStatus(id, "cancelled", controller.signal);
      loadDashboard();
    } catch (error) {
      setReservationsError(error);
    }
    return () => controller.abort();
  }

  return (
    <main>
      <div className="d-flex flex-column mb-3">
        <h1 className="h1 align-self-center">Dashboard</h1>
        <div className="container-lg d-flex flex-column align-items-center justify-content-center px-0">
          <div className="col-12">
            <ErrorAlert error={reservationsError} />
            <ErrorAlert error={tablesError} />
          </div>
          <h4 className="h4">Reservations for {date}</h4>
          <div>
            <DateNavigatorButton type="previous" currentDate={date} />
            <DateNavigatorButton type="today" currentDate={date} />
            <DateNavigatorButton type="next" currentDate={date} />
          </div>
          <div className="col-11">
            <DisplayTables
              data={reservations}
              objCols={reservationsCols}
              buttonFunction={cancelReservation}
            />
          </div>
          <h4 className="h4 mt-5">Tables in the Restaurant</h4>
          <div className="col-12">
            <DisplayTables
              data={tables}
              objCols={tableCols}
              buttonFunction={finishTable}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
