const mysql = require("mysql");
const { database } = require("../keys");
//import { database } from "./conexion_BD";

const conexion = mysql.createConnection(database);

conexion.connect((err, conecction) => {
  if (err) {
    console.error("Error al conectar la BD");
  }
  if (conecction) {
    console.log("Conexion exitosa a la BD");
  }
});

module.exports = conexion;
