import React from "react";
import CancelButton from "./CancelButton";
import EditButton from "./EditButton";
import FinishEatingButton from "./FinishEatingButton";
import SeatTableButton from "./SeatTableButton";

export default function AssignReservationButton({ rowObject, buttonFunction, type }) {
    switch (type) {
        case "seatButton":
          return <SeatTableButton reservation={rowObject} />;
        case "editButton":
          return <EditButton reservation={rowObject} />;
        case "cancelButton":
          return (
            <CancelButton
              reservation={rowObject}
              cancelReservation={buttonFunction}
            />
          );
        default:
          return <FinishEatingButton table={rowObject} finishTable={buttonFunction} />;
      }
}