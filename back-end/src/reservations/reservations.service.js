const knex = require("../db/connection");
const tableName = "reservations";

// List fetches all of the reservations in the table
function list() {
  return knex(tableName).select("*").orderBy("reservation_time", "ASC");
}

function queryByDate(reservation_date) {
  return knex(tableName).select("*").where({ reservation_date }).orderBy("reservation_time", "ASC")
}

// Returns reservation by ID from database
function read(reservation_id) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id })
    .first();
}

// Create a new reservation and automatically assign status: booked to it
// Return the inserted data
function create(reservation) {
  return knex(tableName)
    .insert({
      ...reservation,
      status: "booked",
    })
    .returning("*")
    .then((rows) => rows[0]);
}

// Updates entire selected reservation, and returns updated object
async function updateReservation(reservation_id, reservation) {
  return knex(tableName)
    .where({ reservation_id })
    .update(reservation, "*")
    .then((rows) => rows[0]);
}

async function updateStatus(reservation_id, status) {
  return knex(tableName)
    .where({ reservation_id })
    .update({ status }, "*")
    .then((rows) => rows[0]);
}

module.exports = {
  list,
  queryByDate,
  read,
  create,
  updateReservation,
  updateStatus,
};
