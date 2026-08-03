class Message {
  constructor({
    id = null,
    sender,
    text,
    timestamp = Date.now(),
    replyTo = null,
    reactions = [],
    type = "TEXT",
  }) {
    this.id = id;
    this.sender = sender;
    this.text = text;
    this.timestamp = timestamp;
    this.replyTo = replyTo;
    this.reactions = reactions;
    this.type = type;
  }

  isMine() {
    return this.sender === "me";
  }

  isFriend() {
    return this.sender !== "me";
  }

  isReply() {
    return this.replyTo !== null;
  }

  hasReaction() {
    return this.reactions.length > 0;
  }

  toJSON() {
    return {
      id: this.id,
      sender: this.sender,
      text: this.text,
      timestamp: this.timestamp,
      replyTo: this.replyTo,
      reactions: this.reactions,
      type: this.type,
    };
  }
}

module.exports = Message;
