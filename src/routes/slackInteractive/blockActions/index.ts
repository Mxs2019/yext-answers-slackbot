import { Response } from "express";
import { buttonValues } from "./../../../enums";
import { configurationModal } from "./../../../slack-ui/views";
import { SlackRequest } from "./../../slackConfig";
import { resetConfiguration } from "./resetConfiguration";
import { showConfigurationModal } from "./showConfigurationModal";
import { viewAll } from "./viewAll";

export const blockActions = (req, res: Response, next, payload: any) => {
  const { actions, trigger_id, type, message } = payload;

  const { slack, config, team_id, user_id, token } = req as SlackRequest;

  const actionType = actions[0].value;

  // Show config modal if config doesn't exist. This should never really
  // happen since this is from a block action
  if (!config && actionType !== "show_configuration_modal") {
    slack.views.open({
      trigger_id,
      view: configurationModal(),
    });
    res.sendStatus(200);
    return;
  }

  switch (actionType) {
    case buttonValues.VIEW_ALL:
      viewAll(slack, trigger_id, config, message);
      break;
    case buttonValues.SHOW_CONFIGURATION_MODAL:
      showConfigurationModal(slack, trigger_id);
      break;
    case buttonValues.RESET_CONFIGURATION:
      resetConfiguration(user_id, team_id, token, slack);
      break;

    default:
      console.log("Unhandled Action", actionType);
      break;
  }
  res.sendStatus(200);
};
