// Importing the file
const app = require("./index");
require("./db/connection");
//var cors = require("cors");

//app.use(cors())
// Const variable for port
const port = process.env.PORT || 8900;

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Server Starting
app.listen(port, () => {
  console.log(`Port is runnning at ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
