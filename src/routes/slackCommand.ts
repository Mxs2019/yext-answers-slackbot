import { Response } from "express";
import { runSearchAndShowResultsModal } from "../slack-ui/actions";
import { configurationModal } from "../slack-ui/views";
import { SlackRequest } from "./slackConfig";

export const slackCommand = async (req, res: Response, next) => {
  const { body, slack, config } = req as SlackRequest;
  const { text: searchQuery, trigger_id } = body;

  // If configuration doesn't exist return error
  if (!config) {
    slack.views.open({
      trigger_id,
      view: configurationModal(),
    });
    res.sendStatus(200);
    return;
  }

  await runSearchAndShowResultsModal(slack, trigger_id, searchQuery, config);

  res.sendStatus(200);
};
