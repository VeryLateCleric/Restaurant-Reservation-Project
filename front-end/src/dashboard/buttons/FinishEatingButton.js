import React from "react";

export default function FinishEatingButton({ table, finishTable }) {
    const { table_id: id, table_status } = table;
  
    const buttonStyle = table_status === "occupied" ? "btn-danger" : "btn-secondary";
  
    const onClick = () => {
      finishTable(id);
    };
  
    return (
      <button
        type="button"
        onClick={onClick}
        className={`btn ${buttonStyle}`}
        disabled={table_status === "free"}
        data-table-id-finish={id}
      >
        Finish
      </button>
    );
}