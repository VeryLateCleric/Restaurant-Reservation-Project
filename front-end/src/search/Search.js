import React, { useState } from "react";
import { listReservations } from "../utils/api";
import { Link } from "react-router-dom";

export default function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError(null);

    // Clean up mobile number input
    const cleanedNumber = mobileNumber;

    try {
      const result = await listReservations({ mobile_number: cleanedNumber });
      await setReservations(result);
      if (result.length === 0) setError("No reservations found");
    } catch (error) {
      setError("Error fetching reservations");
    }
  };

  return (
    <main>
      <h1>Search Reservations</h1>
      <form onSubmit={handleSearch}>
        <label htmlFor="mobile_number">Enter a customer's phone number</label>
        <input
          type="text"
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        <button type="submit">Find</button>
      </form>

      {error && <p>{error}</p>}

      {reservations.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Reservation Date</th>
              <th>Status</th>
              <th>Seat</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.reservation_id}>
                <td>{reservation.reservation_id}</td>
                <td>
                  {reservation.first_name} {reservation.last_name}
                </td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_date}</td>
                <td>{reservation.status}</td>
                <td>
                  <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                    Seat
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
