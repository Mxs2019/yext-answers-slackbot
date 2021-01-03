require("dotenv").config();

import bodyParser from "body-parser";
import express from "express";
import { authRedirect, slackButton } from "./routes/auth";
import { slackCommand } from "./routes/slackCommand";
import { slackConfig } from "./routes/slackConfig";
import { slackEvents } from "./routes/slackEvents";
import { slackInteractive } from "./routes/slackInteractive";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MAX_RESULTS = 3;

// Health Check
app.get("/", (req, res) => {
  res.send("Everything is working");
});

// OAuth Routes
app.get("/slack-button", slackButton);
app.get("/auth/redirect", authRedirect);

// Get Slack Config Stuff
app.use(slackConfig);

app.post("/slack-command", slackCommand); // Slash Command
app.post("/slack-events", slackEvents); // Events (@mention, home)
app.post("/slack-interactive", slackInteractive); // Interactive Events

app.use((error, req, res, next) => {
  console.log(error);
  return res.status(500).json({ error: error.toString() });
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
