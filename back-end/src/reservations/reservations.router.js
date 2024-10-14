const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/new")
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:reservationId")
  .get(controller.read)
  .put(controller.updateReservation)
  .all(methodNotAllowed);
  
router.route("/:reservationId/status").put(controller.updateStatus);

module.exports = router;
