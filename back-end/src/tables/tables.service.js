const db = require("../db/connection");
const tableName = "tables";


function list() {
  return db(tableName).select("*").orderBy("table_name");
}


function read(table_id) {
    return db(tableName).where({ table_id }).first();
}


function create(table) {
  return db(tableName)
    .insert(table)
    .returning("*")
    .then((rows) => rows[0]);
}


function assignReservation(reservation_id, table_id) {
  return db(tableName)
    .where({ table_id })
    .update({ occupied: true, reservation_id }, "*")
    .then((rows) => rows[0]);
}


function deleteReservation(table_id) {
  return db(tableName)
    .where({ table_id })
    .update({ occupied: false, reservation_id: null })
    .then((rows) => rows[0]);
}

module.exports = { list, create, read, assignReservation, deleteReservation }