const express = require("express");
const router = express.Router();
const contactsController = require("../../controllers/contacts.controller");
const authenticateMiddleware = require("../../controllers/authenticateMiddleware");

router.get("/contacts", authenticateMiddleware, contactsController.get);
router.get("/contacts/:id", authenticateMiddleware, contactsController.getById);
router.post("/contacts", authenticateMiddleware, contactsController.create);
router.put("/contacts/:id", authenticateMiddleware, contactsController.update);
router.patch(
  "/contacts/:id/favorite",
  authenticateMiddleware,
  contactsController.updateFavorite
);
router.delete(
  "/contacts/:id",
  authenticateMiddleware,
  contactsController.remove
);

module.exports = router;
