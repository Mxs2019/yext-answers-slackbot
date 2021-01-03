import { View } from "@slack/web-api";
import { AnswersVerticalResponse } from "../answers";
import { WorkspaceConfig } from "../db";
import { AnswersUniversalResponse } from "./../answers/index";
import { buttonValues, callbackIds } from "./../enums";
import blocks, { button } from "./blocks";
import { renderUniversalResults } from "./resultsRendering/renderUniversalResults";
import { renderVerticalResults } from "./resultsRendering/renderVerticalResults";

export const configurationModal = (): View => {
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Set Up Answers Bot",
    },
    submit: {
      type: "plain_text",
      text: "Set Up",
    },
    callback_id: callbackIds.FINISH_CONFIGURATION,
    blocks: [
      blocks.input("API Key", "Enter your API Key", "apiKey"),
      blocks.input(
        "Experience Key",
        "Enter your Experience Key",
        "experienceKey"
      ),
      blocks.input("Vertical Key", "Enter the Vertical", "verticalKey", {
        optional: true,
        hint: "This will restrict the experience to one vertical.",
      }),
      blocks.input(
        "Click Through URL",
        "http://www.domain.com/search",
        "clickThroughURL",
        {
          optional: true,
          hint:
            "If this is filled out the slack bot will send users to the full experience if they want to see more results.",
        }
      ),
    ],
  };
};

export const answersVerticalResultsModal = (
  searchTerm: string,
  response: AnswersVerticalResponse,
  config: WorkspaceConfig
): View => {
  const blocks = renderVerticalResults(searchTerm, response);
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Answers Results",
    },
    callback_id: callbackIds.ANSWERS_RESULTS,
    blocks,
  };
};

export const answersUniversalResultsModal = (
  searchTerm: string,
  response: AnswersUniversalResponse,
  config: WorkspaceConfig
): View => {
  const blocks = renderUniversalResults(searchTerm, response);

  if (response.modules.length > 1 && config.clickThroughURL) {
    const url = `${config.clickThroughURL}?query=${encodeURI(searchTerm)}`;
    blocks.push(button(":link: View More Results", "click_through", url));
  }
  return {
    type: "modal",
    title: {
      type: "plain_text",
      text: "Answers Results",
    },
    callback_id: callbackIds.ANSWERS_RESULTS,
    blocks,
  };
};

export const notConfiguredHome = (): View => {
  return {
    type: "home",
    blocks: [
      blocks.header("Yext Answers Slackbot"),
      blocks.text(
        "Welcome to the Yext Answers Bot. This bot makes it easy to ask questions and get answers right form within slack"
      ),
      blocks.dividor(),
      blocks.header("Get Started"),
      blocks.text(
        "In order to get started with the Yext Answers Slackbot you need to enter credentials for your Yext Answers Experience."
      ),
      blocks.button(
        "Set Up",
        buttonValues.SHOW_CONFIGURATION_MODAL,
        undefined,
        "primary"
      ),
    ],
  };
};

export const configuredHome = (experienceKey: string): View => {
  return {
    type: "home",
    blocks: [
      blocks.header("Yext Answers Slackbot"),
      blocks.text(
        "Welcome to the Yext Answers Bot. This bot makes it easy to ask questions and get answers right form within slack"
      ),
      blocks.dividor(),
      blocks.header("How to Use Answers Slackbot"),
      blocks.text(`The Answers Bot makes it easy to get answers right from within slack. 
There are two ways to use the bot - an @ mention and a slash command.`),
      blocks.header("@ Mention"),
      blocks.text(
        `Simple mention @answers-bot in a channel or in a thread with a question and Answers Bot will respond
in line for everyone to see. This is a great way to bring in answers into an ongoing conversation. For example if you wanted to search
for the return policty then type \`@Answers Bot what is the return policy?\`.`
      ),
      blocks.header("Slach (/) Command"),
      blocks.text(` You can also use Answers Bot via a slash command. 
To do this type /answers followed by your search query. For example if you wanted
to know what the return policy is then type \`/answers what is the return policy\`. 
This will open your results in a modal that only you can see. 
    `),
      blocks.dividor(),
      blocks.header("Configuration"),
      blocks.text(
        `You are all set up with an answers experience with the key "${experienceKey}". To change your configuration reset it below.`
      ),
      blocks.button("Reset Configuration", buttonValues.RESET_CONFIGURATION),
    ],
  };
};
