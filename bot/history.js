class History {
  constructor(conversation) {
    this.conversation = conversation;
  }

  all() {
    return this.conversation.getAll();
  }

  last(count = 20) {
    return this.conversation.last(count);
  }

  lastFromFriend(count = 20) {
    return this.conversation
      .getAll()
      .filter((m) => m.isFriend())
      .slice(-count);
  }

  lastFromMe(count = 20) {
    return this.conversation
      .getAll()
      .filter((m) => m.isMine())
      .slice(-count);
  }

  /**
   * Converts history into AI-friendly chat format.
   */
  toChatGPT(count = 20) {
    return this.last(count).map((m) => ({
      role: m.isMine() ? "assistant" : "user",
      content: m.text,
    }));
  }

  /**
   * Simple text transcript.
   */
  transcript(count = 20) {
    return this.last(count)
      .map((m) => `${m.sender}: ${m.text}`)
      .join("\n");
  }

  /**
   * Last user message.
   */
  latestUserMessage() {
    return this.conversation
      .getAll()
      .filter((m) => m.isFriend())
      .at(-1);
  }

  /**
   * Last bot message.
   */
  latestBotMessage() {
    return this.conversation
      .getAll()
      .filter((m) => m.isMine())
      .at(-1);
  }
}

module.exports = History;
