const knex = require("../db/connection");

function list() {
  return knex();
}

function read(reservation_id) {
  return knex();
}

function create(newReservation) {
  return knex();
}

async function update(reservation_id, status) {
  return knex();
}

module.exports = {
  list,
  read,
  create,
  update,
};
