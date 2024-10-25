const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorHandler");

// Validation middleware
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservationId} not found`,
  });
}

// Confirm entry has data
function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have data property.",
  });
}

// Confirm data received first name
function hasFirstName(req, res, next) {
  const name = req.body.data.first_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "first_name property is required",
  });
}

// Confirm data received last name
function hasLastName(req, res, next) {
  const name = req.body.data.last_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "last_name property is required",
  });
}

//
function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const allowedStatuses = ["booked", "seated", "finished", "cancelled"];

  if (!status) {
    // Set status to "booked" by default if not provided
    req.body.data.status = "booked";
    return next();
  }

  // If creating, only allow "booked"
  if (status !== "booked" && req.method === "POST") {
    return next({
      status: 400,
      message: `Status cannot be '${status}' when creating a reservation.`,
    });
  }

  // Allow valid status transitions for updates
  if (allowedStatuses.includes(status)) {
    return next();
  }

  next({
    status: 400,
    message: `Status ${status} is not valid.`,
  });
}

// Confirm reservation contains a mobile number for contact
function hasMobileNumber(req, res, next) {
  const phone = req.body.data.mobile_number;
  if (phone) {
    return next();
  }
  next({
    status: 400,
    message: "mobile_number property is required",
  });
}

// Confirm the reservation date property was added
function hasReservationDate(req, res, next) {
  const date = req.body.data.reservation_date;
  if (date) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date property is required",
  });
}

// Confirm a reservation time property was added
function hasReservationTime(req, res, next) {
  const time = req.body.data.reservation_time;
  if (time) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time property is required.",
  });
}

// Ensure we do not pass through invalid dates
function hasValidDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const validDate = Date.parse(date);
  if (validDate) {
    return next();
  }
  next({
    status: 400,
    message: "A reservation_date must be a date.",
  });
}

// Helper to noPastReservation, check reservation date happens only ever in the future
function hasFutureDate(dateString, timeString) {
  const reservationDateTime = new Date(`${dateString}T${timeString}`);
  return reservationDateTime > new Date();
}

// Reservation cannot be placed before right now
function noPastReservation(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;

  if (!hasFutureDate(reservation_date, reservation_time)) {
    return next({
      status: 400,
      message: "a reservation_time must be in the future.",
    });
  }

  return next();
}

// Reservation must be on open days at open times
function validDateAndTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const daysClosed = { 2: "Tuesday" }; //Restaurant currently closed on Tuesdays. Update here where needed.
  const openTime = "10:30";
  const closeTime = "21:30";

  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}`
  );
  const present = new Date();

  // Confirm reservation is not in the past
  if (reservationDateTime < present) {
    return next({
      status: 400,
      message: "The reservation must be for a future date and time.",
    });
  }

  // Confirm reservation is only on open days
  if (daysClosed[reservationDateTime.getDay()]) {
    return next({
      status: 400,
      message: `The restaurant is closed on ${Object.values(daysClosed).join(
        ", "
      )}`,
    });
  }

  // Confirm reservation is during business hours only.
  const openingTime = new Date(`${reservation_date}T${openTime}`);
  const closingTime = new Date(`${reservation_date}T${closeTime}`);

  if (reservationDateTime < openingTime || reservationDateTime > closingTime) {
    // time for them to go out
    return next({
      status: 400,
      message: `Reservation must be between ${openTime} and ${closeTime} on open days.`,
    });
  }

  return next();
}

// Check we input at least 1 person in the reservation
function hasEnoughPeople(req, res, next) {
  const { people } = req.body.data;

  if (Number.isInteger(people) && people > 0) {
    return next();
  }

  next({
    status: 400,
    message: "The number of people must be at least 1.",
  });
}

// Updating reservations require valid statuses to be updated
function hasValidUpdateStatus(req, res, next) {
  const { status } = req.body.data;
  const currentStatus = res.locals.reservation.status;
  const validTransitions = {
    booked: ["seated", "cancelled", "booked"],
    seated: ["finished"],
    finished: [],
  };

  if (status === "unknown") {
    return next({
      status: 400,
      message: "Status cannot be 'unknown'",
    });
  }
  // Check if transition between status is valid
  if (!validTransitions[currentStatus].includes(status)) {
    return next({
      status: 400,
      message: `Invalid status transition from ${currentStatus} to ${status}.`,
    });
  }

  return next();
}

async function preventUpdateWhenFinished(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated.",
    });
  }
  res.locals.reservation = reservation; // Store the reservation for use later
  return next();
}

/******
 * *
 * List handler for reservation resources
 * *
 *****/

async function list(req, res) {
  const { date: reservation_date } = req.query;
  const data = reservation_date
    ? await service.queryByDate(reservation_date)
    : await service.searchByProperty(req.query);
  res.json({ data });
}

// Get a single reservation from locals
function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

// Create a new reservation using data provided in req.body
async function create(req, res) {
  const reservation = req.body.data;
  const data = await service.create(reservation);
  res.status(201).json({ data });
}

async function updateReservation(req, res) {
  const { reservation } = res.locals;
  const newReservation = req.body.data;

  const data = await service.updateReservation(reservation.reservation_id, newReservation);
  if (!data) {
    return res.status(404).json({ error: "Reservation not found" });
  }
  res.json({ data });
}

// console.log("newReservation:", newReservation);
// console.log("reservation:", reservation);
// console.log("data:", data);

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  let result = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: { status: result.status } });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasValidStatus,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasValidDate,
    noPastReservation,
    validDateAndTime,
    hasEnoughPeople,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateReservation: [
    reservationExists,
    hasFirstName,
    hasLastName,
    hasValidStatus,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasValidDate,
    noPastReservation,
    validDateAndTime,
    hasEnoughPeople,
    hasValidUpdateStatus,
    asyncErrorBoundary(updateReservation),
  ],
  delete: [
    // Add more later
    asyncErrorBoundary(),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidUpdateStatus,
    preventUpdateWhenFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
