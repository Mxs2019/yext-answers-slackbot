import { WebClient } from "@slack/web-api";
import { Request, Response } from "express";
import { setWorkspaceToken } from "../db";

export const slackButton = (req: Request, res: Response) => {
  res.sendFile(__dirname + "/add_to_slack.html");
};

export const authRedirect = async (req: Request, res: Response) => {
  try {
    const result = await new WebClient().oauth.v2.access({
      client_id: process.env.SLACK_CLIENT_ID,
      code: req.query.code as string,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      // redirect_uri: process.env.SLACK_REDIRECT_URI,
    });
    type ResponseType = {
      access_token: string;
      team: {
        id: string;
        name: string;
      };
    };
    const { access_token, team } = (result as any) as ResponseType;
    await setWorkspaceToken(team.id, access_token);

    res.send(
      `Answers Slackbot successfully installed in ${team.name}. Go back to slack and type \\answers to get started`
    );
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
