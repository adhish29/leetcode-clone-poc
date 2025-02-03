import express from "express";
import { createClient } from "redis";

const languages = [
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "PHP",
  "Swift",
  "Go",
  "Kotlin",
  "Ruby",
];

let i = 1;

const users = ["adhish", "shloka"];

const app = express();
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
client.on("error", (err) => console.log("Redis Client creation Error", err));

app.use(express.json());

app.post("/submit", async (req, res) => {
  try {
    // const problemId = <string>req.body.problemId;
    // const language = <string>req.body.language;
    const problemId = i++;
    const language = languages[Math.floor(Math.random() * languages.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    await client.lPush(
      "problems",
      JSON.stringify({ user, problemId, language })
    );
    res.status(200).send("Submission received and stored.");
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).send("Failed to store submission.");
  }
});

(async () => {
  try {
    await client.connect();
    console.log("connected to redis server");
    app.listen(4000, () => console.log("listening to http://localhost:4000"));
  } catch (error) {
    console.log("error in connecting to redis client", error);
  }
})();
