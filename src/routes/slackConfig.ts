import { WebClient } from "@slack/web-api";
import { Response } from "express";
import { getWorkspaceDetail } from "./../db";
import { WorkspaceConfig } from "./../db/index";

export type SlackRequest = {
  body: any;
  slack: WebClient;
  team_id: string;
  user_id: string;
  token: string;
  config?: WorkspaceConfig;
  payload?: object;
};

export const slackConfig = async (req, res: Response, next) => {
  let { team_id, challenge, user_id } = req.body;

  //   Challenge Request - just return the challenge
  if (challenge) {
    res.send({ challenge });
    return;
  }

  if (req.body.payload) {
    const payload = JSON.parse(req.body.payload);
    team_id = payload.user.team_id;
    user_id = payload.user.id;
  }

  if (!team_id) {
    res.sendStatus(200);
    return;
  }

  const { config, token } = await getWorkspaceDetail(team_id);

  if (!token) {
    res.sendStatus(200);
    return;
  }

  const slack = new WebClient(token);

  req.slack = slack;
  req.config = config;
  req.team_id = team_id;
  req.user_id = user_id;
  req.token = token;
  next();
};
