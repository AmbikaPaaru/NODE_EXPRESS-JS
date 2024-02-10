const express = require("express");
const {
  registerUser,
  currentUser,
  loginUser,
  usersList,
  updateRole,
  removeUser
} = require("../controllers/userController");
const validateAuthToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.get("/userslist",validateAuthToken,usersList)

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateAuthToken, currentUser);

router.route("/:id").put(validateAuthToken,updateRole).delete(validateAuthToken,removeUser)

module.exports = router;
