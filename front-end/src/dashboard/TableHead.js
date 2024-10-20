import React from "react";

// Defines a dynamic table with all the necessary column labels.
export default function TableHead({ columnLabels }) {
  const tableHeader = columnLabels.map((columnName, index) => (
    <th className="text-center" key={index} scope="col">
      {columnName}
    </th>
  ));

  return (
    <thead>
      <tr>{tableHeader}</tr>
    </thead>
  );
}