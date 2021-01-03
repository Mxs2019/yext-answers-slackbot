import { WebClient } from "@slack/web-api";
import { WorkspaceConfig } from "../../../db";
import { runSearchAndShowResultsModal } from "./../../../slack-ui/actions";

export const viewAll = async (
  slack: WebClient,
  trigger_id: string,
  config: WorkspaceConfig,
  message
) => {
  const { text: searchTerm } = message;

  runSearchAndShowResultsModal(slack, trigger_id, searchTerm, config);
};
