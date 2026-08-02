const { launchInstagram, openChat } = require("./browser");

const {
  fetchMessages,
  getMessageRequest,
  triggerMessageRequest,
  executeGraphQL,
  loadMessages,
} = require("./graphql");

const { sendMessage } = require("./sender");

const { watchNewMessages, stopWatching } = require("./observer");

module.exports = {
  launchInstagram,
  openChat,

  fetchMessages,
  getMessageRequest,
  triggerMessageRequest,
  executeGraphQL,
  loadMessages,

  sendMessage,

  watchNewMessages,
  stopWatching,
};
