const knex = require("../db/connection");
const table = "reservations";

// List fetches all of the reservations in the table
function list() {
  return knex(table).select("*").orderBy("reservation_time", "ASC");
}

// TODO
// Returns reservation by ID from database
function read(reservation_id) {
  return knex(table);
}

// Create a new reservation and automatically assign status: booked to it
// Return the inserted data
function create(reservation) {
  return knex(table)
    .insert({
      ...reservation,
      status: "booked",
    })
    .returning("*")
    .then((rows) => rows[0]);
}

// Updates entire selected reservation, and returns updated object
async function updateReservation(reservation_id, reservation) {
  return knex(table)
    .where({ reservation_id })
    .update(reservation, "*")
    .then((rows) => rows[0]);
}

async function updateStatus(reservation_id, status) {
  return knex(table)
    .where({ reservation_id })
    .update({ status }, "*")
    .then((rows) => rows[0]);
}

module.exports = {
  list,
  read,
  create,
  updateReservation,
  updateStatus,
};
