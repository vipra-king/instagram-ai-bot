const { MY_NAME } = require("./constants");

function parseGraphQLResponse(json) {
  const slideMessages =
    json.data.fetch__SlideThread.as_ig_direct_thread.slide_messages;

  const messages = [];

  for (const edge of slideMessages.edges) {
    const msg = edge.node;

    // Ignore non-text messages
    if (msg.content_type !== "TEXT") continue;

    messages.push({
      id: msg.message_id,
      sender: msg.sender.name === MY_NAME ? "me" : msg.sender.name,
      text: msg.text_body,
      replyTo: msg.replied_to_message?.text_body ?? null,
      reactions: msg.msg_reactions ?? [],
      timestamp: Number(msg.timestamp_ms),
    });
  }

  return {
    messages,
    pageInfo: slideMessages.page_info,
  };
}

module.exports = {
  parseGraphQLResponse,
};
