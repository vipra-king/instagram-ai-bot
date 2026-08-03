const Message = require("./message");

class Conversation {
  constructor() {
    this.messages = [];
    this.messageMap = new Map();
  }

  add(message) {
    if (!(message instanceof Message)) {
      message = new Message(message);
    }

    if (message.id && this.messageMap.has(message.id)) {
      return false;
    }

    this.messages.push(message);

    if (message.id) {
      this.messageMap.set(message.id, message);
    }

    this.messages.sort((a, b) => a.timestamp - b.timestamp);

    return true;
  }

  addMany(messages) {
    for (const message of messages) {
      this.add(message);
    }
  }

  /**
   * Merge the latest messages fetched from Instagram.
   *
   * Since GraphQL only returns the latest N messages,
   * NEVER delete local history.
   *
   * Returns:
   * {
   *   added: [],
   *   updated: []
   * }
   */
  mergeLatest(messages) {
    const added = [];
    const updated = [];

    for (let msg of messages) {
      if (!(msg instanceof Message)) {
        msg = new Message(msg);
      }

      const existing = this.messageMap.get(msg.id);

      if (!existing) {
        this.messages.push(msg);
        this.messageMap.set(msg.id, msg);
        added.push(msg);
        continue;
      }

      const reactionsChanged =
        JSON.stringify(existing.reactions) !== JSON.stringify(msg.reactions);

      if (
        existing.text !== msg.text ||
        existing.replyTo !== msg.replyTo ||
        reactionsChanged
      ) {
        existing.text = msg.text;
        existing.replyTo = msg.replyTo;
        existing.reactions = msg.reactions;
        existing.sender = msg.sender;
        existing.timestamp = msg.timestamp;

        updated.push(existing);
      }
    }

    this.messages.sort((a, b) => a.timestamp - b.timestamp);

    return {
      added,
      updated,
    };
  }

  last(count = 20) {
    return this.messages.slice(-count);
  }

  first(count = 20) {
    return this.messages.slice(0, count);
  }

  latest() {
    return this.messages.at(-1) ?? null;
  }

  previous() {
    return this.messages.at(-2) ?? null;
  }

  findById(id) {
    return this.messageMap.get(id) ?? null;
  }

  has(id) {
    return this.messageMap.has(id);
  }

  remove(id) {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.messageMap.delete(id);
  }

  clear() {
    this.messages = [];
    this.messageMap.clear();
  }

  size() {
    return this.messages.length;
  }

  getAll() {
    return [...this.messages];
  }

  print() {
    console.table(
      this.messages.map((m) => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        replyTo: m.replyTo,
      })),
    );
  }
}

module.exports = Conversation;
