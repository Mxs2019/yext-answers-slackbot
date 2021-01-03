import { Response } from "express";
import { callbackIds } from "../../../enums";
import {
  getUniversalResults,
  getVerticalResults,
} from "./../../../answers/index";
import { configureWorkspace } from "./../../../db/index";
import { configuredHome } from "./../../../slack-ui/views";
import { SlackRequest } from "./../../slackConfig";

export const viewSubmissions = async (
  req,
  res: Response,
  next,
  payload: any
) => {
  const { slack, team_id, user_id } = req as SlackRequest;
  const {
    view: {
      callback_id,
      state: { values },
    },
  } = payload;
  switch (callback_id) {
    case callbackIds.FINISH_CONFIGURATION:
      const apiKey = values.apiKey.input.value;
      const experienceKey = values.experienceKey.input.value;
      const verticalKey = values.verticalKey.input.value;
      const clickThroughURL = values.clickThroughURL.input.value;
      const config = {
        apiKey,
        experienceKey,
        verticalKey,
        clickThroughURL,
      };

      let apiWorks = false;

      // Confirm an API request works
      if (verticalKey) {
        const { results } = await getVerticalResults("", config);
        if (results) {
          apiWorks = true;
        }
      } else {
        const { modules } = await getUniversalResults("Test Query", config);
        if (modules) {
          apiWorks = true;
        }
      }
      if (apiWorks) {
        await configureWorkspace(team_id, config);
        await slack.views.publish({
          user_id,
          view: configuredHome(experienceKey),
        });
        res.send({
          response_action: "clear",
        });
      } else {
        res.send({
          response_action: "errors",
          errors: {
            apiKey: "Your API Key, Experience Key or Vertical Key is invalid",
          },
        });
      }

      break;

    default:
      console.log("Unhandled View Submission", callback_id);
      break;
  }
};
