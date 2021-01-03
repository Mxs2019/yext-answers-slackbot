import { AnswersVerticalResponse } from "../../answers";
import { text } from "../blocks";
import { renderSection } from "./renderSection";

export const renderVerticalResults = (
  searchTerm: string,
  { results, resultsCount }: AnswersVerticalResponse
): any[] => {
  const blocks = [];

  // blocks.push(input("Search", "Search for answers...", "search_term", query));

  if (!results) return [];
  if (results.length === 0) {
    blocks.push(text(`_No Results found for "${searchTerm}"_`));
  } else {
    if (searchTerm === "") {
      blocks.push(
        text(`_Showing ${results.length} of ${resultsCount} Results_`)
      );
    } else {
      blocks.push(
        text(
          `_Showing ${results.length} of ${resultsCount} Results for "${searchTerm}"_`
        )
      );
    }

    blocks.push(...renderSection(results));
  }
  return blocks;
};
