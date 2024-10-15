import React, { useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

export default function EditReservation() {
  const { reservationId } = useParams();
  const [defaultFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
}
