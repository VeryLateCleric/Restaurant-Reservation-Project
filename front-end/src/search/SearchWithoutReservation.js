import React from "react";
export default function SearchWithoutReservation() {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Mobile</th>
          <th scope="col">Date</th>
          <th scope="col">Time</th>
          <th scope="col">People</th>
          <th scope="col">Status</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <td>No reservations found</td>
      </tbody>
    </table>
  );
}