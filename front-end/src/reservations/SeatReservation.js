import React, { useEffect, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { listTables, updateTable, readReservation } from "../utils/api";
import LoadingMessage from "../LoadingMessage/LoadingMessage";

export default function SeatReservation() {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableSelection, setTableSelection] = useState("");
  const [error, setError] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const loadReservation = async () => {
      try {
        const data = await readReservation(reservationId);
        setReservation(data);
      } catch (err) {
        setError(err);
      }
    };

    const loadTables = async () => {
      try {
        const data = await listTables();
        setTables(data);
      } catch (err) {
        setError(err);
      }
    };

    loadReservation();
    loadTables();
  }, [reservationId]);

  const selectTableHandler = (event) => {
    setTableSelection(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const selectedTable = tables.find((table) => table.table_id === +tableSelection);
    if (selectedTable && selectedTable.capacity >= reservation.people) {
      try {
        await updateTable(tableSelection, reservationId);
        history.push("/dashboard");
      } catch (err) {
        setError(err);
      }
    } else {
      setError({ message: "The table does not have sufficient capacity." })
    }
  };

  const cancelHandler = () => {
    history.goBack();
  };

  const tableOptions = tables.map((table) => (
    <option key={table.table_id} value={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  const errorDisplay = error ? (
    <div className="alert alert-danger">{error.message}</div>
  ) : null;

  return (
    <main>
      <div className="d-flex flex-column mb-3 justify-content-around ">
        <h1 className="align-self-center">
          Seating Reservation #{reservationId}
        </h1>
        <LoadingMessage
          component={
            <div className="col-8 col-xl-10 align-self-center">
              {errorDisplay}
              <div className="d-flex flex-column flex-xl-row">
                <form onSubmit={submitHandler} className="col mx-4 mb-4">
                  <fieldset>
                    <div className="form-group my-2">
                      <label htmlFor="table_id">
                        Please assign a table for reservation #{reservationId}
                      </label>
                      <select
                        id="table_id"
                        name="table_id"
                        title="Select a table to assign to this reservation"
                        className="form-select my-2"
                        value={tableSelection}
                        onChange={selectTableHandler}
                        required
                      >
                        <option value="">Please Select a Table</option>
                        {tableOptions}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary mt-2"
                      onClick={cancelHandler}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary ms-4 mt-2">
                      Submit
                    </button>
                  </fieldset>
                </form>
                <div className="col mx-4">
                  <h4>Reservation Details</h4>
                  {reservation && (
                    <div>
                      <p>
                        <strong>Name:</strong> {reservation.first_name}{" "}
                        {reservation.last_name}
                      </p>
                      <p>
                        <strong>Mobile Number:</strong>{" "}
                        {reservation.mobile_number}
                      </p>
                      <p>
                        <strong>Reservation Date:</strong>{" "}
                        {reservation.reservation_date}
                      </p>
                      <p>
                        <strong>Time:</strong> {reservation.reservation_time}
                      </p>
                      <p>
                        <strong>People:</strong> {reservation.people}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          }
        />
      </div>
    </main>
  );
}
