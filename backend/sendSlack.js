// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require('@slack/web-api');

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(
  'xoxb-124913413189-4901604449877-Pw3b3aTlOtJkb4ws4QYQkeQW',
  {
    // LogLevel can be imported and used to make debugging simpler
    logLevel: LogLevel.DEBUG,
  },
);

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await client.chat.postMessage({
      // The token you used to initialize your app
      token: 'xoxb-124913413189-4901604449877-Pw3b3aTlOtJkb4ws4QYQkeQW',
      channel: id,
      text: text,
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { publishMessage };
