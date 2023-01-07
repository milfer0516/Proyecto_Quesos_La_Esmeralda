const express = require("express");
const conexion = require("../config/conexion_BD");
const router = express.Router();
//const conexion = require("../config/conexion_BD");
const authController = require("../controllers/authController");

// Rutas para las vistas
router.get("/index", authController.isAuthenticated, (req, res) => {
  res.render("index", { title: "Inicio sesion" });
});

router.get("/login", (req, res) => {
  res.render("login", { alert: false });
});

// Ruta para las categorias
router.get("/categorias", (req, res) => {
  const categorias = conexion.query(
    "SELECT * FROM categorias",
    (error, results) => {
      if (error) {
        throw error;
      }
      res.render("products/categorias", { results: results });
    }
  );
});

/* Metodos y rutas para actualizar y elminar un producto o categoria */
// ACTUALIZAR CATEGORIAS
router.get("/update/:idcategorias", (req, res) => {
  const idcategorias = req.params.idcategorias;
  // Aca consulto si los parametros son capturados
  // console.log(idcategoria);
  // res.send("Actualizado");
  conexion.query(
    "SELECT * FROM categorias WHERE idcategorias = ?",
    [idcategorias],
    (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(idcategorias);
        res.render("update", { categoria: results[0] });
      }
    }
  );
});

// ELIMINAR CATEGORIAS
router.get("/delete/:idcategoria", (req, res) => {
  // Aca consulto si los parametros son capturados
  // console.log(req.params.idCategoria);
  // res.send("Producto eliminado");

  const idCategoria = req.params.idcategoria;
  // Consulto la DB para elminar el componente segun el ID
  conexion.query(
    "DELETE FROM categorias WHERE idcategorias = ?",
    [idCategoria],
    (error, results) => {
      if (error) {
        throw error;
      } else {
        res.redirect("/categorias");
      }
    }
  );
});

// Rutas para los métodos del contralador
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/categorias", authController.categorias);
router.post("/update", authController.update);

// Esta ruta su usa con el metodo get ya que no se hace ninguna accion
router.get("/logout", authController.logout);

// Se exporta el router para hacer uso de las rutas
module.exports = router;
