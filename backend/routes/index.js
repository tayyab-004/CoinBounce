const express = require("express");
const authController = require("../controller/authController");
const blogController = require("../controller/blogController");
const commentController = require("../controller/commentController");
const auth = require("../middlewares/auth");

const router = express.Router();

// user
// register endpoint
router.post("/register", authController.register);

// login endpoint
router.post("/login", authController.login);

// logout endpoint
router.post("/logout", auth, authController.logout);

// refresh endpoint
router.get("/refresh", authController.refresh);

// blog endpoint
// create
router.post("/blog", auth, blogController.create);

// read all blogs
router.get("/blog/all", auth, blogController.getAll);

// read blog by id
router.get("/blog/:id", auth, blogController.getById);

// update
router.put("/blog", auth, blogController.update);

// delete
router.delete("/blog/:id", auth, blogController.delete);

// comment
// create comment
router.post("/comment", auth, commentController.create);

// read comments by blog id
router.get("/comment/:id", auth, commentController.getById);

module.exports = router;
