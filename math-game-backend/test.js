const mongoose = require("mongoose");

const uri =
  "mongodb+srv://achhadahappy:YQEt7tRQf9tn2A59@mathsgame.adfdb.mongodb.net/?retryWrites=true&w=majority&appName=MathsGame";

mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
