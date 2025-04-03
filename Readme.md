# Devvit Bolt Template

To use this template on Bolt.new, click here: https://bolt.new/github.com/sir-axolotl-alot/devvit-bolt-template

## Getting Started

> This requires you to have a Reddit account and Reddit developers account. Please [create an account](https://www.reddit.com/register/?dest=https%3A%2F%2Fdevelopers.reddit.com%2F) before continuing.

Once your Bolt template starts up you should see something like this:
![](./docs//assets/0-initialized.png)

Now, you need to get to your terminal:
![](./docs//assets/1-terminal.png)

Next, we need to login to devvit

![](./docs/assets/2-logging-in.mp4)

## Build your web view with mocked responses

The template is prepared to help you build a Web View directly in Bolt's web container.
Because Bolt and Devvit can't communicate, Bolt will try to mock all responses that it expects from Devvit.

You can see and edit the Mocked Responses in `web-view-app/src/lib/DevvitMockedResponses.ts`

Once you're happy with your webview, let Bolt know. The LLM will give you instructions on how to test your app on Reddit

## Testing on Reddit

Because Bolt can't authenticate directly to Reddit, it should give you instructions on how to export the project, and run command line scripts locally to test your project.
It's important to remember to update the `devvit-bolt.config.json` to connect to the real Devvit backend and stop using mocked responses:

```js
/// devvit-bolt.config.json
{
  "useMockedResponses": false, // <-- Set this to false, before testing on Reddit
  "testSubreddit": "r/my_test_subreddit"
}
```

Alternatively, you can use the command `npm run playtest` instead of `devvit playtest` which should take care of that for you, and run on your test subreddit.

The usual workflow for testing the application after downloading the Bolt project is:

1- Update `devvit-bolt.config.json` with your test subreddit

2- Update `devvit.yaml` with your app name and version (you can always set version to 0.0.0 and let the CLI take care of the rest)

3- Run `npm install`

4- Run `devvit upload`

5- Run `npm run playtest`
