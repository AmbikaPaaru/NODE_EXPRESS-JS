const express = require("express");
const router = express();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactControllers");
const validateAuthToken = require("../middleware/validateTokenHandler");

router.use(validateAuthToken);
router.route("/").get(getContacts).post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
