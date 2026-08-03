class Intent {
  static detect(text) {
    text = text.toLowerCase().trim();

    // Greetings
    if (/^(hi|hii|hello|hey|gm|gn|oi|good morning|good night)$/i.test(text)) {
      return "GREETING";
    }

    // Simple acknowledgement
    if (/^(ok|okay|k|hmm|mmm|hmmm|seri|ama|illa|fine)$/i.test(text)) {
      return "ACKNOWLEDGEMENT";
    }

    // Laugh / reaction
    if (
      text.includes("😂") ||
      text.includes("🤣") ||
      text.includes("😭") ||
      text === "lol" ||
      text === "lmao"
    ) {
      return "REACTION";
    }

    // Needs previous context
    if (
      text.includes("adha") ||
      text.includes("athu") ||
      text.includes("it") ||
      text.includes("which") ||
      text.includes("that") ||
      text.includes("this") ||
      text.includes("why") ||
      text.includes("when")
    ) {
      return "CONTEXT";
    }

    return "NORMAL";
  }
}

module.exports = Intent;
