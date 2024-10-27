import React from "react";
import { convert12HourTime } from "../utils/date-time";
import AssignReservationButton from "./buttons/AssignRerservationButton";

export default function TableRow({ rowObject, propNames, buttonFunction }) {
    const dataStyle = "text-center align-middle";
  
    // Helper function to create table cell
    const createCell = (key, content, extraProps = {}) => (
      <td className={dataStyle} key={key} {...extraProps}>
        {content}
      </td>
    );
  
    // Helper function to render assignment button if data is undefined
    const renderButtonCell = (index, propName) =>
      createCell(index, (
        <AssignReservationButton
          rowObject={rowObject}
          buttonFunction={buttonFunction}
          type={propName}
        />
      ));
  
    // Helper function to handle reservation statuses
    const renderReservationStatusCell = (index, data) =>
      createCell(index, data, { "data-reservation-id-status": rowObject.reservation_id });
  
    // Helper function to render time data in 12-hour format
    const renderTimeCell = (index, data) =>
      createCell(index, convert12HourTime(data));
  
    // Render row based on prop names
    return (
      <tr>
        {propNames.map((propName, index) => {
          let data = rowObject[propName];
          if (data === "seated") {
            data = "occupied"
          }
          
          switch (true) {
            case data === undefined || data === null:
              return renderButtonCell(index, propName);
            case ["booked", "seated", "finished", "cancelled"].includes(data):
              return renderReservationStatusCell(index, data);
            case /time/gi.test(propName):
              return renderTimeCell(index, data);
            default:
              return createCell(index, data);
          }
        })}
      </tr>
    );
  }