import axios from "axios";
import { WorkspaceConfig } from "../db";

export type AnswersVerticalResponse = {
  results: any[];
  resultsCount: number;
};

export const getVerticalResults = async (
  input: string,
  { apiKey, experienceKey, verticalKey }: WorkspaceConfig,
  verticalKeyOverride?: string,
  maxCount?: number
): Promise<AnswersVerticalResponse | undefined> => {
  const vkey = verticalKeyOverride ?? verticalKey;
  try {
    const res = await axios.get(
      "https://liveapi.yext.com/v2/accounts/me/answers/vertical/query",
      {
        params: {
          input,
          v: "20200101",
          api_key: apiKey,
          version: "PRODUCTION",
          experienceKey,
          verticalKey,
          limit: maxCount,
        },
      }
    );

    return res.data.response as AnswersVerticalResponse;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};

export type AnswersUniversalResponse = {
  directAnswer?: {
    type: "FIELD_VALUE";
    answer: {
      entityName: string;
      fieldName: string;
      fieldApiName: string;
      value: string;
      fieldType: string;
    };
  };
  modules: {
    verticalConfigId: string;
    resultsCount: number;
    results: any[];
  }[];
};

export const getUniversalResults = async (
  input: string,
  { apiKey, experienceKey }: WorkspaceConfig
): Promise<AnswersUniversalResponse | undefined> => {
  try {
    const res = await axios.get(
      "https://liveapi.yext.com/v2/accounts/me/answers/query",
      {
        params: {
          input,
          v: "20200101",
          api_key: apiKey,
          version: "PRODUCTION",
          experienceKey,
        },
      }
    );

    return res.data.response as AnswersUniversalResponse;
  } catch (e) {
    console.log(e);
    return undefined;
  }
};
