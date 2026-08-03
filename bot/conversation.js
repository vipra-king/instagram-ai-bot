const Message = require("./message");

class Conversation {
  constructor() {
    this.messages = [];
  }

  add(message) {
    if (!(message instanceof Message)) {
      message = new Message(message);
    }

    // Prevent duplicates using message id
    if (message.id && this.messages.some((m) => m.id === message.id)) {
      return false;
    }

    this.messages.push(message);

    // Always keep oldest → newest
    this.messages.sort((a, b) => a.timestamp - b.timestamp);

    return true;
  }

  addMany(messages) {
    for (const message of messages) {
      this.add(message);
    }
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
    return this.messages.find((m) => m.id === id) ?? null;
  }

  clear() {
    this.messages = [];
  }

  size() {
    return this.messages.length;
  }

  getAll() {
    return [...this.messages];
  }

  has(id) {
    return this.messages.some((m) => m.id === id);
  }

  remove(id) {
    this.messages = this.messages.filter((m) => m.id !== id);
  }

  print() {
    console.table(
      this.messages.map((m) => ({
        sender: m.sender,
        text: m.text,
        replyTo: m.replyTo,
      })),
    );
  }
}

module.exports = Conversation;
