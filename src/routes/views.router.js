const express = require("express");
const {
  isAuthenticated,
  isNotAuthenticated,
} = require("../middleware/auth.js");

const router = express.Router();

router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", { title: "Bienvenido" });
});

router.get("/userregistrade", (req, res) => {
  res.render("registrade", {
    title: "Registro Exitoso",
  });
});

router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register", {title: "Registro" });
});

router.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

module.exports = router;
