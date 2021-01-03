import { WebClient } from "@slack/web-api";
import { WorkspaceConfig } from "../db";
import { getUniversalResults, getVerticalResults } from "./../answers/index";
import {
  answersUniversalResultsModal,
  answersVerticalResultsModal,
} from "./views";

export const runSearchAndShowResultsModal = async (
  slack: WebClient,
  trigger_id: string,
  searchQuery: string,
  config: WorkspaceConfig,
  verticalKeyOverride?: string
) => {
  const vk = verticalKeyOverride || config.verticalKey;
  if (vk) {
    const verticalResponse = await getVerticalResults(searchQuery, config);
    slack.views.open({
      trigger_id,
      view: answersVerticalResultsModal(searchQuery, verticalResponse, config),
    });
  } else {
    const universalResponse = await getUniversalResults(searchQuery, config);
    slack.views.open({
      trigger_id,
      view: answersUniversalResultsModal(
        searchQuery,
        universalResponse,
        config
      ),
    });
  }
};
