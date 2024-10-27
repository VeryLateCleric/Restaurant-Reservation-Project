import React from "react";

export default function FinishEatingButton({ table, finishTable }) {
    const { table_id: id, occupied } = table;
  
    const buttonStyle = occupied ? "btn-danger" : "btn-secondary";
  
    const onClick = () => {
      finishTable(id);
    };
  
    return (
      <button
        type="button"
        onClick={onClick}
        className={`btn ${buttonStyle}`}
        disabled={!occupied}
        data-table-id-finish={id}
      >
        Finish
      </button>
    );
}