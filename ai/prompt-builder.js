const basePrompt = require("./prompt");

class PromptBuilder {
  static build({
    history,
    latestMessage,
    profile,
    style,
    habits,
    phrases,
    examples,
  }) {
    const sections = [];

    // Base prompt
    sections.push(basePrompt.trim());

    // -----------------------------
    // Profile
    // -----------------------------
    if (profile) {
      sections.push(`
=== PERSON ===

Relationship:
${profile.relationship || "Friend"}

Nickname:
${profile.nickname || ""}
`);
    }

    // -----------------------------
    // Style
    // -----------------------------
    if (style) {
      sections.push(`
=== MY TEXTING STYLE ===

Average reply:
${style.averageReplyLength?.words || ""} words

Tone:
${style.tone?.default || style.tone || ""}

Capitalization:
${style.capitalization?.style || ""}

Punctuation:
${style.punctuation?.fullStops || ""}

Language:
${style.language?.primary || ""}

Common words:
${(style.commonWords || []).join(", ")}

Common abbreviations:
${(style.commonAbbreviations || []).join(", ")}

Generation rules:
${(style.generationRules || []).map((x) => "- " + x).join("\n")}
`);
    }

    // -----------------------------
    // Habits
    // -----------------------------
    if (habits) {
      sections.push(`
=== TEXTING HABITS ===

Conversation patterns:

${(habits.conversation_patterns || []).map((x) => "- " + x).join("\n")}

Behaviour rules:

${(habits.behavior_rules || []).map((x) => "- " + x).join("\n")}
`);
    }

    // -----------------------------
    // Phrases
    // -----------------------------
    if (phrases) {
      sections.push(`
=== COMMON PHRASES ===

Acknowledgements:
${(phrases.acknowledgements || []).join(", ")}

Questions:
${(phrases.questions || []).join(", ")}

Greetings:
${(phrases.greetings || []).join(", ")}

Common replies:
${(phrases.commonReplies || []).join(", ")}
`);
    }

    // -----------------------------
    // Examples
    // -----------------------------
    if (examples?.length) {
      sections.push("=== SIMILAR EXAMPLES ===");

      examples.forEach((example) => {
        if (!example.conversation) return;

        example.conversation.forEach((msg) => {
          sections.push(`${msg.sender}: ${msg.text}`);
        });

        sections.push("");
      });
    }

    // -----------------------------
    // Recent Conversation
    // -----------------------------
    sections.push("=== RECENT CONVERSATION ===");

    history.forEach((message) => {
      const speaker = message.sender === "me" ? "Me" : "Her";

      sections.push(`${speaker}: ${message.text}`);
    });

    // -----------------------------
    // Latest Message
    // -----------------------------
    sections.push(`
=== LATEST MESSAGE ===

Her:
${latestMessage.text}
`);

    // -----------------------------
    // Final instruction
    // -----------------------------
    sections.push(`
Reply ONLY with the next Instagram message.

Do not explain.

Do not use quotation marks.

Output only the message.
`);

    return sections.join("\n");
  }
}

module.exports = PromptBuilder;
