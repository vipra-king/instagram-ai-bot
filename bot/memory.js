class Memory {
  constructor(initialMemory = {}) {
    this.memory = { ...initialMemory };
  }

  set(key, value) {
    this.memory[key] = value;
  }

  get(key) {
    return this.memory[key];
  }

  has(key) {
    return key in this.memory;
  }

  remove(key) {
    delete this.memory[key];
  }

  clear() {
    this.memory = {};
  }

  getAll() {
    return { ...this.memory };
  }

  update(data) {
    Object.assign(this.memory, data);
  }

  toPrompt() {
    const entries = Object.entries(this.memory);

    if (entries.length === 0) {
      return "";
    }

    return entries.map(([key, value]) => `- ${key}: ${value}`).join("\n");
  }
}

module.exports = Memory;
