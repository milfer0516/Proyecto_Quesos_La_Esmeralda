/* const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const conexion = require("../config/conexion_BD");
const helpers = require("../controllers/helpers");

passport.use(
  "local.registro",
  new LocalStrategy(
    {
      usernameField: "cliNombres",
      passwordField: "cliContrasena",
      passReqToCallback: true,
    },
    async (req, cliNombres, cliContrasena, done) => {
      console.log(req.body);
      const {
        cliIdentificacion,
        cliApellidos,
        cliCorreo,
        cliTelefono,
        cliPlacaVehi,
      } = req.body;
      const newUser = {
        cliNombres: cliNombres,
        cliContrasena: cliContrasena,
        cliApellidos: cliApellidos,
        cliIdentificacion: cliIdentificacion,
        cliCorreo: cliCorreo,
        cliTelefono: cliTelefono,
        cliPlacaVehi: cliPlacaVehi,
      };
      newUser.cliContrasena = await helpers.encryptPassword(cliContrasena);
      conexion.query(
        "INSERT INTO clientes SET ?",
        [newUser],
        (err, result, field) => {
          if (err) throw err;
          newUser.cliIdentificacion = result.cliIdentificacion;
          //console.log(result);
          return done(null, newUser);
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.cliIdentificacion);
});

passport.deserializeUser(async (id, done) => {
  conexion.query(
    "SELECT * FROM clientes WHERE cliIdentificacion = ?",
    [id],
    (err, rows) => {
      if (err) throw err;
      done(null, rows[0]);
    }
  );
}); */
