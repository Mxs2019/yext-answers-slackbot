import { WebClient } from "@slack/web-api";
import { WorkspaceConfig } from "../../db";
import { configuredHome, notConfiguredHome } from "../../slack-ui/views";

export const handleAppHomeOpened = (
  event,
  slack: WebClient,
  config?: WorkspaceConfig
) => {
  const { user } = event;

  if (config) {
    slack.views.publish({
      user_id: user,
      view: configuredHome(config.experienceKey),
    });
  } else {
    slack.views.publish({
      user_id: user,
      view: notConfiguredHome(),
    });
  }
};
