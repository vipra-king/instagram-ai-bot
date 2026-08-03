const { launchInstagram, openChat } = require("./browser");

const {
  fetchMessages,
  getMessageRequest,
  triggerMessageRequest,
  executeGraphQL,
  loadMessages,
} = require("./graphql");

const { sendMessage } = require("./sender");
const { loadLatest20Messages } = require("./graphql");
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
  loadLatest20Messages,
};
