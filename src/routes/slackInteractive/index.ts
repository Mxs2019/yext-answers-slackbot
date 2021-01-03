import { Response } from "express";
import { blockActions } from "./blockActions";
import { viewSubmissions } from "./viewSubmissions/index";

export const slackInteractive = async (req, res: Response, next) => {
  if (!req.body.payload) return;

  const payload = JSON.parse(req.body.payload);

  const { type } = payload;

  switch (type) {
    case "block_actions":
      blockActions(req, res, next, payload);
      break;

    case "view_submission":
      viewSubmissions(req, res, next, payload);
      break;

    default:
      break;
  }
};
