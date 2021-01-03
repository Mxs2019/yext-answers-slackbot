import { Response } from "express";
import { SlackRequest } from "./../slackConfig";
import { handleAppHomeOpened } from "./handleAppHomeOpened";
import { handleAtMention } from "./handleAtMention";

export const slackEvents = async (req, res: Response, next) => {
  const { body, slack, config, user_id } = req as SlackRequest;
  const { event, authorizations } = body;

  switch (event.type) {
    case "app_mention":
      await handleAtMention(event, authorizations, slack, config);
      res.sendStatus(200);
      break;
    case "app_home_opened":
      await handleAppHomeOpened(event, slack, config);
      res.sendStatus(200);
      break;
    default:
      console.log("Unknown Event Type:", event.type);
      res.sendStatus(200);
      break;
  }
};
