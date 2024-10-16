const asyncErrorBoundary = require("../errors/asyncErrorHandler");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

const REQUIRED_PROPERTIES = ["table_name", "capacity"];
const VALID_PROPERTIES = [...REQUIRED_PROPERTIES, "reservation_id"];

function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  for (let property of REQUIRED_PROPERTIES) {
    if (!data[property])
      return next({
        status: 400,
        message: `The data in the request body requires a ${property} field.`,
      });
  }

  if (data.table_name.length < 2)
    return next({
      status: 400,
      message: `The 'table_name' property must have a length of two or greater`,
    });

  if (typeof data.capacity !== "number" || data.capacity < 1)
    return next({
      status: 400,
      message: `The 'capacity' property must be a number that is 1 or greater`,
    });

  res.locals.table = data;
  return next();
}

function hasValidStatus(req, res, next) {
  const { status = "booked" } = req.body.data;

  // Check if status is one of the valid options
  if (!["booked"].includes(status)) {
    return next({
      status: 400,
      message: `Invalid status: ${status}. Status must be 'booked' when creating a reservation.`,
    });
  }
  return next();
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    next();
  } else {
    next({
      status: 404,
      message: `Table ${table_id} Could Not Be Found.`,
    });
  }
}

function hasReservationId(req, res, next) {
  const { data: { reservation_id } = {} } = req.body;

  if (!reservation_id)
    return next({
      status: 400,
      message: `The data in the request body requires a reservation_id property.`,
    });
  return next();
}

async function isValidReservation(req, res, next) {
  const { data: { reservation_id } = {} } = req.body;

  // Skip this validation if there is no reservation_id
  if (!reservation_id) return next();

  const reservation = await reservationService.read(reservation_id);
  if (!reservation)
    return next({
      status: 404,
      message: `Reservation ${reservation_id} cannot be found.`,
    });

  res.locals.reservation = reservation;
  return next();
}

async function hasRequiredSeating(req, res, next) {
  if (res.locals.table.capacity < res.locals.reservation.people) {
    next({
      status: 400,
      message: "Table does not have the required capacity.",
    });
  }
  return next();
}

function checkTableStatus(desiredStatus) {
  return function (req, res, next) {
    const { table } = res.locals;

    if (desiredStatus === "free" && table.reservation_id) {
      return next({
        status: 400,
        message: "Table is already occupied.",
      });
    }

    if (desiredStatus === "occupied" && !table.reservation_id) {
      return next({
        status: 400,
        message: "Table is not occupied.",
      });
    }

    return next();
  };
}

async function hasReservationSeated(req, res, next) {
  const { reservation } = res.locals;
  if (reservation.status === "seated")
    return next({
      status: 400,
      message: "This reservation has already been seated.",
    });
  if (reservation.status === "finished")
    return next({
      status: 400,
      message:
        "This reservation is currently finished. A finished reservation cannot be seated.",
    });
  return next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function read(req, res) {
  res.json({ data: res.locals.table });
}

async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: req.body.data.reservation_id,
  };
  await service.update(updatedTable);
  const data = await service.read(updatedTable.table_id);
  res.json({ data });
}

// When seating a table, we must set the reservation status to 'seated'
async function assignReservation(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { table_id } = res.locals.table;
  await reservationService.updateStatus(reservation_id, "seated");
  const data = await service.assignReservation(reservation_id, table_id);
  res.json({ data });
}

// When unseating/finishing a table, we must set the reservation status to 'finished'
async function finishTable(req, res) {
  const { reservation_id, table_id } = res.locals.table;
  await reservationService.updateStatus(reservation_id, "finished");
  const data = await service.deleteReservation(table_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasValidProperties),
    hasValidStatus,
    asyncErrorBoundary(isValidReservation),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), read],
  assignReservation: [
    asyncErrorBoundary(tableExists),
    checkTableStatus("free"),
    hasReservationId,
    asyncErrorBoundary(isValidReservation),
    hasRequiredSeating,
    hasReservationSeated,
    asyncErrorBoundary(assignReservation),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    checkTableStatus("occupied"),
    asyncErrorBoundary(finishTable),
  ],
};
