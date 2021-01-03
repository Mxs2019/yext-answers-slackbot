import { WebClient } from "@slack/web-api";
import { getUniversalResults, getVerticalResults } from "../../answers";
import { WorkspaceConfig } from "../../db";
import blocks from "../../slack-ui/blocks";
import { renderUniversalResults } from "../../slack-ui/resultsRendering/renderUniversalResults";
import { buttonValues } from "./../../enums";
import { renderVerticalResults } from "./../../slack-ui/resultsRendering/renderVerticalResults";

export const handleAtMention = async (
  event,
  authorizations,
  slack: WebClient,
  config?: WorkspaceConfig
) => {
  const { text, ts, thread_ts, channel } = event;
  const response_thread_ts = thread_ts ?? ts;
  const searchQuery = text
    .split(`<@${authorizations[0].user_id}>`)
    .join("")
    .trim();

  if (!config) {
    slack.chat.postMessage({
      channel: channel,
      text: "Your Answers Bot is not set up. Set it up now.",
      thread_ts: response_thread_ts,
      blocks: [
        blocks.text(
          "Your Answers Bot is not set up. Configure the bot to continue."
        ),
        blocks.button(
          "Set Up",
          buttonValues.SHOW_CONFIGURATION_MODAL,
          undefined,
          "primary"
        ),
      ],
    });
  } else if (searchQuery === "") {
    slack.chat.postMessage({
      channel: channel,
      text: "Include a question you want Answers Bot to respond to",
      thread_ts: response_thread_ts,
    });
  } else {
    let resultBlocks = [];
    if (config.verticalKey) {
      const verticalResponse = await getVerticalResults(
        searchQuery,
        config,
        undefined,
        3
      );
      resultBlocks = renderVerticalResults(searchQuery, verticalResponse);
      if (verticalResponse.resultsCount > verticalResponse.results.length) {
        resultBlocks.push(
          blocks.button("View All Results", buttonValues.VIEW_ALL)
        );
      }
    } else {
      try {
        const universalResponse = await getUniversalResults(
          searchQuery,
          config
        );
        resultBlocks = renderUniversalResults(
          searchQuery,
          universalResponse,
          3
        );
        if (
          (universalResponse &&
            universalResponse.modules.length > 0 &&
            universalResponse.modules[0].resultsCount >
              universalResponse.modules[0].results.length) ||
          universalResponse.modules.length > 0
        ) {
          resultBlocks.push(
            blocks.button("View All Results", buttonValues.VIEW_ALL)
          );
        }
      } catch (e) {
        console.log(e);
      }
    }

    try {
      const res = await slack.chat.postMessage({
        channel: channel,
        text: searchQuery,
        blocks: resultBlocks,
        link_names: true,
        thread_ts: response_thread_ts,
      });
    } catch (e) {
      console.log(e);
      slack.chat.postMessage({
        channel: channel,
        text:
          "We've had an error and are unable to respond at this time. Try again later.",
        thread_ts: response_thread_ts,
      });
    }
  }
};
