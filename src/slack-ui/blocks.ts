import {
  ActionsBlock,
  ImageBlock,
  InputBlock,
  SectionBlock,
} from "@slack/web-api";

export const header = (text: string) => {
  return {
    type: "header",
    text: {
      type: "plain_text",
      text,
      emoji: true,
    },
  };
};

export const dividor = () => {
  return {
    type: "divider",
  };
};

export type ButtonElement = {
  label: string;
  value: string;
  url: string;
  style?: "primary" | "danger" | undefined;
};

export const image = (imageUrl: string, altText: string): ImageBlock => {
  return {
    type: "image",
    image_url: imageUrl,
    alt_text: altText,
  };
};

export const buttons = (buttons: ButtonElement[]): ActionsBlock => {
  const elements = buttons.map((b) => {
    return {
      type: "button",
      text: {
        type: "plain_text",
        text: b.label,
        emoji: true,
      },
      style: b.style,
      url: b.url,
      value: b.value,
    };
  });

  return {
    type: "actions",
    elements,
  };
};

export const button = (
  label: string,
  value: string,
  url?: string,
  style?: "primary" | "danger" | undefined
) => {
  return {
    type: "actions",
    elements: [
      {
        type: "button",
        text: {
          type: "plain_text",
          text: label,
          emoji: true,
        },
        style,
        url,
        value,
      },
    ],
  };
};

export const input = (
  label: string,
  placeholder: string,
  block_id: string,
  additionalConfig?: {
    initial_value?: string;
    optional?: boolean;
    hint?: string;
  }
): InputBlock => {
  const { initial_value, optional, hint } = additionalConfig ?? {};
  const inputBlock: InputBlock = {
    type: "input",
    element: {
      type: "plain_text_input",
      action_id: "input",
      placeholder: {
        type: "plain_text",
        text: placeholder,
      },
      initial_value,
    },
    block_id,
    optional,
    label: {
      type: "plain_text",
      text: label,
      emoji: true,
    },
  };
  if (hint) {
    inputBlock.hint = {
      type: "plain_text",
      text: hint,
      emoji: true,
    };
  }
  return inputBlock;
};

// const submit = (): InputBlock => {
//     return {
//         element: {
//             type: ""
//         }
//     }
// }

const MAX_LENGTH = 3000; //Slack limit of text in mock
export const text = (markdown: string, imageURL?: string, altText?: string) => {
  const section: SectionBlock = {
    type: "section",
    text: {
      type: "mrkdwn",
      text:
        markdown.length > MAX_LENGTH - 3
          ? markdown.substring(0, MAX_LENGTH - 3) + "..."
          : markdown,
    },
  };

  if (imageURL && altText) {
    section.accessory = {
      type: "image",
      image_url: imageURL,
      alt_text: altText,
    };
  }
  return section;
};

export default { button, input, header, dividor, text, image, buttons };
