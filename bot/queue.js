class MessageQueue {
  constructor(delay = 3000) {
    this.delay = delay;

    this.messages = [];

    this.timer = null;
  }

  add(message, callback) {
    this.messages.push(message);

    clearTimeout(this.timer);

    this.timer = setTimeout(async () => {
      const batch = [...this.messages];

      this.messages = [];

      await callback(batch);
    }, this.delay);
  }
}

module.exports = MessageQueue;
