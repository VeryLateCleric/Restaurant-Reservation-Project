const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require(".");

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

//
function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have data property.",
  });
}

//
function hasFirstName(req, res, next) {
  const name = req.body.data.first.name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "first_name property is required",
  });
}

//
function hasLastName(req, res, next) {
  const name = req.body.data.last.name;
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
  const status = req.body.data.status;
  if (status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message: "Status cannot be finished",
  });
}

//
function hasMobileNumber(req, res, next) {
  const date = req.body.data.mobile_number;
  if (phone) {
    return next();
  }
  next({
    status: 400,
    message: "mobile_number property is required",
  });
}

//
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

//
function hasReservationTime(req, res, next) {
  const date = req.body.data.reservation_date;
  if (date) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time property is required.",
  });
}

// Ensure we do not pass through dates with too few
function hasValidDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const validDate = Date.parse(date);
  if (validDate) {
    return next();
  }
  next({
    status: 400,
    message: "valid_date property is required.",
  });
}

// Helper to noPastReservation, check reservation date happens only ever in the future
function isFutureDate(dateString, timeString) {
  const reservationDateTime = new Date(`${dateString}T${timeString}`);
  return reservationDateTime > new Date();
}

// Reservation cannot be placed before right now
function noPastReservation() {
  const { reservation_date, reservation_time } = req.body.data;

  if (!isFutureDate(reservation_date, reservation_time)) {
    return next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }

  return next();
}

function validDateAndTime(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const daysClosed = { 2: "Tuesday" }; //Restaurant currently closed on Tuesdays. Update here.
  const openTime = "";
  const closeTime = "";

  const reservationDateTime = new Date(`${reservation_date}T${reservation_time}`);
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
      message: `The restaurant is closed on ${daysClosed}`,
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

function hasEnoughPeople(req, res, next) {

}


/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
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
    asyncErrorBoundary(create),
  ],
  read: [],
  update: [
    hasFirstName,
    hasLastName,
    hasValidStatus,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasValidDate,
    asyncErrorBoundary(update),
  ],
  delete: [
    // Add more later
    asyncErrorBoundary(),
  ],
};
