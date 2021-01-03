# Yext Answers Slackbot

This repo is an example of how you could create a slackbot on top of [Yext Answers](https://www.yext.com/products/answers).

> Note: This repo is not activly maintained by Yext and there is no gurantee of quality. This is meant to showcase how you could integrate Yext Answers with Slack. This is not meant for production environments and is an example of a tech demo.

# Video Walkthrough

[Watch Video Walkthrough](https://www.loom.com/share/1c89932894ec49dcb86a9218521af707)

# Installation

To try this out in your own workspace install via the link below. Note that this bot is not meant for production environments.

[Add To Slack](https://slack.com/oauth/v2/authorize?scope=commands,chat:write,app_mentions:read,chat:write.public,im:history&client_id=1138075688050.1604299461795)

# Configuration

Before the slackbot can be used it has to be configured. Each workspace is mapped to one Answers experience. Try to use the bot or go to the home screen to launch the configuration modal. Here are the configuration fields.

| Field            | Usage                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| API Key          | API Key of Answers Experience                                                                                |
| Experience Key   | Experience Key of the Answers Experience                                                                     |
| Vertical Key     | This will restrict the experience to one vertical.                                                           |
| Clickthrough URL | If this is filled out the slack bot will send users to the full experience if they want to see more results. |

# Slack Usage

This slackbot can be used in Slack via two methods:

## 1. Slash (/) Command

The first way to use this slackbot is with a slash command - `/answers`. A user types this command followed
by their question and then the slackbot will show the results in a modal. This modal is only shown
to the user who runs the command.

For example:

- `/answers how do I return shoes?`
- `/answers stores in nyc`
- `/phone number of dr. johnson`

## 2. @ Mention

The other way to use this slackbot is with an @mention - `@Answers bot`. A user types
this command followed by their question and then the slackbow will respond inline.

The response to @ mentions are public and are always set in a thread. Anyone
in the channel can see the response from the slackbot.

# Technical Details

This slackbot is built on top of the Yext Answers API. When a user types an @ mention or slash
command, the system calls the Answers API with the search term and then
renders the results inline or in a modal using the slack block layout configuration. This node app uses typescript and is built on top of the following frameworks and technologies:

- **Yext Answers**: The search engine is built on top of [Yext Answers](https://yext.com/products/answers) - a natural languge search engine.
- **Node**: The bot is built on top of Node
- **Typescript**: The app is written in Typescript
- **Express**: The app uses the express framework and exposes a set of REST APIs below. These API endpoints are then hooked up to the various slack hooks to get everything working.
- **Firestore**: Each workspace needs to maintain a bit of configuration and a slack oauth token. This information is persisted in Firestore but this could easily be swapped out with another database technology.
- **Heroku**: The version you can install above is hosted on Heroku. Note that this set up isn't meant for production grade scale

## API Endpoints

The following endpoints are exposed and hooked up to the relevant slack feature.

| API Endpoint          | Slack Feature                                                             |
| --------------------- | ------------------------------------------------------------------------- |
| `/auth/redirect/`     | [OAuth](https://api.slack.com/authentication/oauth-v2)                    |
| `/slack-command/`     | [Slash Commands](https://api.slack.com/interactivity/slash-commands)      |
| `/slack-events/`      | [Event Subscriptions](https://api.slack.com/events-api)                   |
| `/slack-interactive/` | [Interactivity](https://api.slack.com/messaging/interactivity#components) |

## Slack Permissions

This app requires the following slack permissions.

| Permission                        | Usage                                     |
| --------------------------------- | ----------------------------------------- |
| `commands`                        | Slack Slash Commands                      |
| `app_mentions:read`               | Listen for @ mentions                     |
| `chat:write`, `chat:write.public` | Reponse to @ mentions in a thread         |
| `im:history`                      | Direct Messeage with the slackbot History |

## Environment Variables

If you want to fork this repo and build something yourself, it's important that the following environment variables are present. For security reasons these are not checked into the repo.

| Variable                   | Useage                                |
| -------------------------- | ------------------------------------- |
| `SLACK_CLIENT_ID`          | The Client ID from the Slack App      |
| `SLACK_CLIENT_SECRET`      | The Client Secrete from the Slack App |
| `FIREBASE_SERVICE_ACCOUNT` | JSON Firebase Admin SDK Credentials   |
