const mongoose = require("mongoose");
const { DB_CONNECTION_STRING } = require("../config/index");

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(DB_CONNECTION_STRING);
    console.log(`Datebase connected to host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`DB error occured: ${error}`);
  }
};

module.exports = dbConnect;
