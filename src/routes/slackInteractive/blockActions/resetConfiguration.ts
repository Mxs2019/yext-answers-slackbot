import { WebClient } from "@slack/web-api";
import { resetWorkspace } from "./../../../db";
import { notConfiguredHome } from "./../../../slack-ui/views";

export const resetConfiguration = async (
  user_id: string,
  team_id: string,
  token: string,
  slack: WebClient
) => {
  slack.views.publish({
    user_id,
    view: notConfiguredHome(),
  });
  await resetWorkspace(token, team_id);
};
