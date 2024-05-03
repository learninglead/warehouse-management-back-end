const { Router } = require("express");
const router = Router();

//import controllers
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  register,
  login,
  getMe,
} = require("../controllers/user.controller");
const { authHandler } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/me", authHandler, getMe);
router.post("/users", authHandler, createUser);
router.put("/users/:id", authHandler, updateUser);
router.delete("/users/:id", authHandler, deleteUser);
router.get("/users/:id", authHandler, getUserById);
router.get("/users", authHandler, getUsers);

module.exports = router;
