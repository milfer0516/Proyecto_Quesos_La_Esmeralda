//const express = require("express");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("layouts/index", { title: "Quesos La Esmerala" });
});
router.get("/nosotros", (req, res) => {
  res.render("layouts/nosotros", { title: "Quesos La Esmerala" });
});
router.get("/contacto", (req, res) => {
  res.render("layouts/contacto", { title: "Quesos La Esmerala" });
});
router.get("/registro", (req, res) => {
  res.render("layouts/registro", { title: "Quesos La Esmerala" });
});

module.exports = router;
