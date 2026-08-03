const Intent = require("./intent");

class ContextEngine {
  static build(history, latestMessage) {
    const intent = Intent.detect(latestMessage.text);

    switch (intent) {
      case "GREETING":
        return [];

      case "ACKNOWLEDGEMENT":
        return history.last(2);

      case "REACTION":
        return history.last(1);

      case "CONTEXT":
        return history.last(20);

      case "NORMAL":
      default:
        return history.last(6);
    }
  }
}

module.exports = ContextEngine;
