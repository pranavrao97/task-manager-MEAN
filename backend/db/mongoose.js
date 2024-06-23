const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/taskManager", { useNewUrlParser: true })
  .then(() => {
    console.log("connected to mongodb at port 27017");
  })
  .catch((e) => {
    console.log(e);
  });
