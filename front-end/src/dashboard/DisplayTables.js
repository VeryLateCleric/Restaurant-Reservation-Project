import React from "react";
import { Link } from "react-router-dom";
import LoadingMessage from "../LoadingMessage/LoadingMessage"
import TableHead from "./TableHead";
import TableRow from "./TableRow";


export default function DisplayTable({
    data,
    objCols = {},
    buttonFunction = () => null,
  }) {
    const rows = data?.map((object, index) => (
      <TableRow
        key={index}
        rowObject={object}
        propNames={Object.keys(objCols)}
        buttonFunction={buttonFunction}
      />
    ));
    const emptyMessage = Object.keys(objCols).includes("table_name") ? (
      <>
        <p>There are no tables in the restaurant.</p>
        <Link className="btn btn-success" to="/tables/new">
          Click here to add a Table!
        </Link>
      </>
    ) : (
      <>
        <p>No reservations scheduled today.</p>
        <Link className="btn btn-success" to="/reservations/new">
          Click here to add a Reservation!
        </Link>
      </>
    );
  
    return rows?.length ? (
      <div className="table-responsive">
        <table className="table table-hover">
          <TableHead columnLabels={Object.values(objCols)} />
          <tbody>{rows}</tbody>
        </table>
      </div>
    ) : (
      <div className="my-3">
        <LoadingMessage
          component={<h5 className="h5 text-center">{emptyMessage}</h5>}
        />
      </div>
    );
  }
  