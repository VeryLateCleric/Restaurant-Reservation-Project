const knex = require("../db/connection");
const table = "reservations";

// List fetches all of the reservations in the table
function list() {
  return knex(table).select("*").orderBy("reservation_time", "ASC");
}

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
async function updateReservation(reservation_id) {
  return knex(table)
    .where({ reservation_id })
    .update(reservation, "*")
    .then((rows) => rows[0]);
}

module.exports = {
  list,
  read,
  create,
  updateReservation,
};
