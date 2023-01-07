const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const conexion = require("../config/conexion_BD");
const { promisify } = require("util");

// Metodo para registrarnos
exports.register = async (req, res) => {
  try {
    const cliNombres = req.body.cliNombres;
    const cliIdentificacion = req.body.cliIdentificacion;
    const cliContrasena = req.body.cliContrasena;
    const cliCorreo = req.body.cliCorreo;
    const cliTelefono = req.body.cliTelefono;
    const cliPlacaVehi = req.body.cliPlacaVehi;

    // utilizo el console para hacer la captura de datos del form
    /* console.log(`${cliNombres} - ${cliIdentificacion} - ${cliContrasena}`); */
    let passHash = await bcrypt.hash(cliContrasena, 8);
    //console.log(passHash);
    conexion.query(
      "INSERT INTO clientes SET ?",
      {
        cliNombres,
        cliIdentificacion,
        cliContrasena: passHash,
        cliCorreo,
        cliTelefono,
        cliPlacaVehi,
      },
      (error, results) => {
        if (error) {
          console.log(error);
        }
        res.redirect("/login");
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = req.body.cliNombres;
    const cliIdentificacion = req.body.cliIdentificacion;
    const cliContrasena = req.body.cliContrasena;
    // Para capturar los valores en la consola
    console.log(`${user}-${cliIdentificacion}-${cliContrasena}`);
    if (!user || !cliIdentificacion || !cliContrasena) {
      res.render("login", {
        alert: true,
        title: "Advertencia",
        aletIcon: "warning",
        html: "Ingrese un nombre y/o contraseña",
        showConfirmButton: true,
        timer: false,
        ruta: "login",
      });
    } else {
      conexion.query(
        "SELECT * FROM clientes WHERE cliNombres=?",
        [user],
        async (error, results) => {
          if (
            results.length == 0 ||
            !(await bcrypt.compare(cliContrasena, results[0].cliContrasena))
          ) {
            res.render("login", {
              alert: true,
              title: "Advertencia",
              aletIcon: "info",
              html: "Ingrese un nombre y/o contraseña",
              showConfirmButton: true,
              timer: false,
              ruta: "login",
            });
          } else {
            //Inicio de sesion ok
            const idClientes = results[0].idClientes;
            const token = jwt.sign({ idClientes: idClientes }, "secret", {
              expiresIn: "7d",
            });
            console.log("TOKEN: " + token + " para el usuario " + user);

            const cookiesOptions = {
              expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            };
            res.cookie("jwt", token, cookiesOptions);
            res.render("login", {
              alert: true,
              title: "Conexión exitosa",
              aletIcon: "success",
              html: "¡INICIO CORRECTO!",
              showConfirmButton: true,
              timer: 800,
              ruta: "index",
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// Se verifica si el usuario ingreso bien
exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        "secret"
      );
      conexion.query(
        "SELECT * FROM clientes WHERE idClientes = ?",
        [decodificada.idClientes],
        (error, results) => {
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  return res.redirect("/login");
};

exports.categorias = async (req, res) => {
  //console.log(req.body);
  const cateNombre = req.body.cateNombre;
  const cateDescripcion = req.body.cateDescripcion;

  conexion.query("INSERT INTO categorias SET ?", {
    cateNombre,
    cateDescripcion,
  });
  res.redirect("/categorias");
};

exports.update = (req, res) => {
  const idcategorias = req.body.idcategorias;
  const cateNombre = req.body.cateNombre;
  const cateDescripcion = req.body.cateDescripcion;
  conexion.query(
    "UPDATE categorias SET ? WHERE idcategorias = ?",
    [
      {
        cateNombre: cateNombre,
        cateDescripcion: cateDescripcion,
      },
      idcategorias,
    ],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.redirect("/categorias");
    }
  );
};
