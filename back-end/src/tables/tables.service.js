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

async function update(updatedTable) {
  return knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id: updatedTable.reservation_id })
      .update({ status: "seated" });

    return await knex("tables")
      .select("*")
      .where({ table_id: updatedTable.table_id })
      .update(updatedTable, "*")
      .then((updatedRecords) => updatedRecords[0]);
  });
}

function assignReservation(reservation_id, table_id) {
  return db(tableName)
    .where({ table_id })
    .update({ table_status: "seated", reservation_id }, "*")
    .then((rows) => rows[0]);
}


function deleteReservation(table_id) {
  return db(tableName)
    .where({ table_id })
    .update({ table_status: "finished", reservation_id: null })
    .then((rows) => rows[0]);
}

module.exports = { list, create, read, update, assignReservation, deleteReservation }