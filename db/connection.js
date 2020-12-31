// Importing the file
const fawn = require('fawn');
const mongoose = require('mongoose');

// Connection of db
mongoose.connect("mongodb://localhost:27017/cscomm", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
}).then(() => { console.log("DB connected successfully") })
  .catch((err) => { console.log(err) })

fawn.init(mongoose);


module.exports = mongoose;