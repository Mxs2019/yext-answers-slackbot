import { WebClient } from "@slack/web-api";
import { configurationModal } from "../../../slack-ui/views";

export const showConfigurationModal = (
  slack: WebClient,
  trigger_id: string
) => {
  slack.views.open({
    trigger_id,
    view: configurationModal(),
  });
};
