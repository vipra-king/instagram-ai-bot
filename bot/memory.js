class Memory {
  constructor({
    profile = {},
    style = {},
    habits = {},
    phrases = {},
    examples = [],
  } = {}) {
    this.profile = profile;
    this.style = style;
    this.habits = habits;
    this.phrases = phrases;
    this.examples = examples;
  }

  getProfile() {
    return this.profile;
  }

  getStyle() {
    return this.style;
  }

  getHabits() {
    return this.habits;
  }

  getPhrases() {
    return this.phrases;
  }

  getExamples() {
    return this.examples;
  }

  setProfile(profile) {
    this.profile = profile;
  }

  setStyle(style) {
    this.style = style;
  }

  setHabits(habits) {
    this.habits = habits;
  }

  setPhrases(phrases) {
    this.phrases = phrases;
  }

  setExamples(examples) {
    this.examples = examples;
  }

  addExample(example) {
    this.examples.push(example);
  }

  updateProfile(data) {
    Object.assign(this.profile, data);
  }

  updateStyle(data) {
    Object.assign(this.style, data);
  }

  updateHabits(data) {
    Object.assign(this.habits, data);
  }

  updatePhrases(data) {
    Object.assign(this.phrases, data);
  }

  clearExamples() {
    this.examples = [];
  }
}

module.exports = Memory;
