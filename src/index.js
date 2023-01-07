// Se Inicializa express para poder ejecutar
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
//const flash = require("connect-flash");
const MySQLStore = require("express-mysql-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const { database } = require("./keys");

//import indexRoutes from "./routes/index.js";
const indexRoutes = require("./routes/index");

// Se pasa express por referencia para hacer uso de sus metodos y funciones
const app = express();
require("./controllers/passport");

// Settings
// se verifica si existe una direccion URL ejecutela si no tome el puerto 4000
app.set("port", process.env.PORT || 4000);
app.set("views", path.join(__dirname, "views"));

// Se setea el motor de plantillas
app.set("view engine", "ejs");

// Middlewares
app.use(
  session({
    secret: "Milfer0516",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database),
  })
);
//app.use(flash());
app.use(morgan("dev"));
// Para procesar los datos enviados desde los forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Para trabajar con cookies
app.use(cookieParser());

// seteammos las variables de entorno
dotenv.config({ path: "./env/.env" });
//Routes
app.use(indexRoutes);
//app.use("/", require("./routes/authencation"));
app.use("/", require("./routes/router"));

// Seteamos la carpeta public para archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

// Starting the server
app.listen(app.get("port"), () => {
  console.log("Server running on port:", app.get("port"));
});
