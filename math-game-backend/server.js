const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  const conString =
    "mongodb+srv://achhadahiren201:DSEWOAPj6i4zVI8P@mathematicsgame.jt2xn.mongodb.net/?retryWrites=true&w=majority&appName=mathematicsGame";

  console.log(conString);
  try {
    const conn = await mongoose.connect(conString, {
      // usedNewUrlParser: true,
      useUnifiedTopology: true,
      //   useCreateIndex: true,
    });
    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

const scoreSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  firstTimeScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  lastScore: { type: Number, required: true },
});

const Score = mongoose.model("Score", scoreSchema);

app.post("/submit", async (req, res) => {
  const { userId, score } = req.body;

  if (!userId || score === undefined) {
    return res.status(400).send("Invalid data");
  }

  try {
    const existingUser = await Score.findOne({ userId });

    if (existingUser) {
      existingUser.lastScore = score;
      if (score > existingUser.maxScore) {
        existingUser.maxScore = score;
      }
      await existingUser.save();
    } else {
      const newScore = new Score({
        userId,
        firstTimeScore: score,
        maxScore: score,
        lastScore: score,
      });
      await newScore.save();
    }

    res.status(200).send("Score submitted successfully");
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).send("Error submitting score");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
