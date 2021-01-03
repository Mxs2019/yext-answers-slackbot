import { dividor, text } from "../blocks";
import { AnswersUniversalResponse } from "./../../answers/index";
import { renderSection } from "./renderSection";

export const renderUniversalResults = (
  searchTerm: string,
  { modules, directAnswer }: AnswersUniversalResponse,
  maxResults = 100
): any[] => {
  const blocks = [];

  if (!modules) return [];
  if (modules.length === 0) {
    blocks.push(text(`_No Results found for "${searchTerm}"_`));
  } else {
    if (directAnswer) {
      const { answer, type } = directAnswer;
      if (directAnswer.type === "FIELD_VALUE") {
        blocks.push(
          text(
            `:point_right: The *${answer.fieldName}* of *${answer.entityName}* is \`${answer.value}\`\n\n`
          )
        );
      }
    }

    blocks.push(text(`_Showing Results for "${searchTerm}"_`));
    blocks.push(dividor());

    blocks.push(
      ...renderSection(modules[0].results.filter((m, i) => i < maxResults))
    );
  }
  return blocks;
};
